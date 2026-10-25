import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { EventLeadStatusUpdateSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const searchQuery = searchParams.get('q')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (searchQuery) {
      where.OR = [
        { customerName: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
        { reference: { contains: searchQuery.toUpperCase() } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.eventLead.count({ where }),
      prisma.eventLead.findMany({
        where,
        orderBy: [{ eventDate: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    // Counts for tabs
    const [newCount, contactedCount, qualifiedCount, quotedCount, confirmedCount, lostCount, closedCount] =
      await Promise.all([
        prisma.eventLead.count({ where: { status: 'NEW' } }),
        prisma.eventLead.count({ where: { status: 'CONTACTED' } }),
        prisma.eventLead.count({ where: { status: 'QUALIFIED' } }),
        prisma.eventLead.count({ where: { status: 'QUOTED' } }),
        prisma.eventLead.count({ where: { status: 'CONFIRMED' } }),
        prisma.eventLead.count({ where: { status: 'LOST' } }),
        prisma.eventLead.count({ where: { status: 'CLOSED' } }),
      ]);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        all: total,
        new: newCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        quoted: quotedCount,
        confirmed: confirmedCount,
        lost: lostCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    console.error('Admin event leads list error:', error);
    return NextResponse.json({ error: 'Failed to retrieve event leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Event lead ID is required' }, { status: 400 });
    }

    const parsed = EventLeadStatusUpdateSchema.safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid lead data' }, { status: 400 });
    }

    const existing = await prisma.eventLead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event lead not found' }, { status: 404 });
    }

    const updated = await prisma.eventLead.update({
      where: { id },
      data: {
        status: parsed.data.status,
        assignedStaff: parsed.data.assignedStaff !== undefined ? parsed.data.assignedStaff : existing.assignedStaff,
        internalNotes: parsed.data.internalNotes !== undefined ? parsed.data.internalNotes : existing.internalNotes,
        quotedAmount: parsed.data.quotedAmount !== undefined ? parsed.data.quotedAmount : existing.quotedAmount,
        nextFollowUpDate:
          parsed.data.nextFollowUpDate !== undefined ? parsed.data.nextFollowUpDate : existing.nextFollowUpDate,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'EVENT_LEAD_UPDATE',
      entityType: 'EventLead',
      entityId: id,
      details: {
        previousStatus: existing.status,
        newStatus: updated.status,
        reference: updated.reference,
        quotedAmount: updated.quotedAmount,
      },
    });

    return NextResponse.json({
      success: true,
      lead: updated,
    });
  } catch (error) {
    console.error('Admin event lead update error:', error);
    return NextResponse.json({ error: 'Failed to update event lead' }, { status: 500 });
  }
}
