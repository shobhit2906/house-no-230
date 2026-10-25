import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';

    let dateFilter: Date | undefined;
    if (range === '7d') {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereRes = dateFilter ? { createdAt: { gte: dateFilter } } : {};
    const whereEvent = dateFilter ? { createdAt: { gte: dateFilter } } : {};

    // 1. Reservations Real Metrics
    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
      rejectedReservations,
    ] = await Promise.all([
      prisma.reservation.count({ where: whereRes }),
      prisma.reservation.count({ where: { ...whereRes, status: 'PENDING' } }),
      prisma.reservation.count({ where: { ...whereRes, status: 'CONFIRMED' } }),
      prisma.reservation.count({ where: { ...whereRes, status: 'COMPLETED' } }),
      prisma.reservation.count({ where: { ...whereRes, status: 'CANCELLED' } }),
      prisma.reservation.count({ where: { ...whereRes, status: 'REJECTED' } }),
    ]);

    // 2. Events Real Metrics
    const [
      totalEvents,
      newEvents,
      contactedEvents,
      qualifiedEvents,
      quotedEvents,
      confirmedEvents,
      lostEvents,
      closedEvents,
    ] = await Promise.all([
      prisma.eventLead.count({ where: whereEvent }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'NEW' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'CONTACTED' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'QUALIFIED' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'QUOTED' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'CONFIRMED' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'LOST' } }),
      prisma.eventLead.count({ where: { ...whereEvent, status: 'CLOSED' } }),
    ]);

    const eventConversionRate =
      totalEvents > 0 ? ((confirmedEvents / totalEvents) * 100).toFixed(1) : '0.0';

    // 3. Seating Preferences breakdown (real counts)
    const allReservations = await prisma.reservation.findMany({
      where: whereRes,
      select: { seatingPreference: true, occasion: true, reservationDate: true },
    });

    const seatingBreakdown: Record<string, number> = {};
    const occasionBreakdown: Record<string, number> = {};

    for (const r of allReservations) {
      const seat = r.seatingPreference || 'ANY';
      seatingBreakdown[seat] = (seatingBreakdown[seat] || 0) + 1;

      const occ = r.occasion || 'CASUAL';
      occasionBreakdown[occ] = (occasionBreakdown[occ] || 0) + 1;
    }

    // 4. Event Types breakdown
    const allEvents = await prisma.eventLead.findMany({
      where: whereEvent,
      select: { eventType: true, eventDate: true },
    });

    const eventTypeBreakdown: Record<string, number> = {};
    for (const e of allEvents) {
      eventTypeBreakdown[e.eventType] = (eventTypeBreakdown[e.eventType] || 0) + 1;
    }

    // 5. Customer Feedback metrics
    const [totalFeedback, avgRating] = await Promise.all([
      prisma.customerFeedback.count(),
      prisma.customerFeedback.aggregate({ _avg: { rating: true } }),
    ]);

    // 6. Loyalty metrics
    const [totalLoyaltyMembers, totalPointsIssued] = await Promise.all([
      prisma.loyaltyCustomer.count(),
      prisma.loyaltyTransaction.aggregate({ _sum: { points: true } }),
    ]);

    return NextResponse.json({
      success: true,
      range,
      metrics: {
        reservations: {
          total: totalReservations,
          pending: pendingReservations,
          confirmed: confirmedReservations,
          completed: completedReservations,
          cancelled: cancelledReservations,
          rejected: rejectedReservations,
          confirmationRate:
            totalReservations > 0
              ? (((confirmedReservations + completedReservations) / totalReservations) * 100).toFixed(1)
              : '0.0',
        },
        events: {
          total: totalEvents,
          new: newEvents,
          contacted: contactedEvents,
          qualified: qualifiedEvents,
          quoted: quotedEvents,
          confirmed: confirmedEvents,
          lost: lostEvents,
          closed: closedEvents,
          conversionRate: eventConversionRate,
        },
        breakdowns: {
          seating: seatingBreakdown,
          occasions: occasionBreakdown,
          eventTypes: eventTypeBreakdown,
        },
        feedback: {
          totalCount: totalFeedback,
          averageRating: avgRating._avg.rating ? avgRating._avg.rating.toFixed(2) : null,
        },
        loyalty: {
          totalMembers: totalLoyaltyMembers,
          netPoints: totalPointsIssued._sum.points || 0,
        },
      },
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return NextResponse.json({ error: 'Failed to aggregate analytics data' }, { status: 500 });
  }
}
