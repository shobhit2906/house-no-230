import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { ReservationStatusUpdateSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const searchQuery = searchParams.get('q')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (date) {
      where.reservationDate = date;
    }
    if (searchQuery) {
      where.OR = [
        { customerName: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
        { reference: { contains: searchQuery.toUpperCase() } },
      ];
    }

    const [total, reservations] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.findMany({
        where,
        orderBy: [{ reservationDate: 'desc' }, { reservationTime: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    // Counts by status for dashboard tabs
    const [pendingCount, confirmedCount, rejectedCount, cancelledCount] = await Promise.all([
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
      prisma.reservation.count({ where: { status: 'REJECTED' } }),
      prisma.reservation.count({ where: { status: 'CANCELLED' } }),
    ]);

    return NextResponse.json({
      success: true,
      reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        all: total,
        pending: pendingCount,
        confirmed: confirmedCount,
        rejected: rejectedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    console.error('Admin reservations list error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reservations' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const parsed = ReservationStatusUpdateSchema.safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid data' }, { status: 400 });
    }

    const existing = await prisma.reservation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: parsed.data.status,
        internalNotes: parsed.data.internalNotes !== undefined ? parsed.data.internalNotes : existing.internalNotes,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'RESERVATION_STATUS_UPDATE',
      entityType: 'Reservation',
      entityId: id,
      details: {
        previousStatus: existing.status,
        newStatus: updated.status,
        reference: updated.reference,
      },
    });

    return NextResponse.json({
      success: true,
      reservation: updated,
    });
  } catch (error) {
    console.error('Admin reservation update error:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
