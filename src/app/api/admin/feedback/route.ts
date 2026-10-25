import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { CustomerFeedbackResolveSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (category && category !== 'ALL') where.category = category;
    if (rating && rating !== 'ALL') where.rating = parseInt(rating, 10);

    const [total, items] = await Promise.all([
      prisma.customerFeedback.count({ where }),
      prisma.customerFeedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const [newCount, underReviewCount, resolvedCount] = await Promise.all([
      prisma.customerFeedback.count({ where: { status: 'NEW' } }),
      prisma.customerFeedback.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.customerFeedback.count({ where: { status: 'RESOLVED' } }),
    ]);

    return NextResponse.json({
      success: true,
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        all: total,
        new: newCount,
        underReview: underReviewCount,
        resolved: resolvedCount,
      },
    });
  } catch (error) {
    console.error('Admin feedback list error:', error);
    return NextResponse.json({ error: 'Failed to retrieve feedback records' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 });
    }

    const parsed = CustomerFeedbackResolveSchema.safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid data' }, { status: 400 });
    }

    const existing = await prisma.customerFeedback.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Feedback entry not found' }, { status: 404 });
    }

    const isResolving = parsed.data.status === 'RESOLVED' && existing.status !== 'RESOLVED';

    const updated = await prisma.customerFeedback.update({
      where: { id },
      data: {
        status: parsed.data.status,
        assignedStaff: parsed.data.assignedStaff !== undefined ? parsed.data.assignedStaff : existing.assignedStaff,
        internalNotes: parsed.data.internalNotes !== undefined ? parsed.data.internalNotes : existing.internalNotes,
        resolvedAt: isResolving ? new Date() : existing.resolvedAt,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'FEEDBACK_RESOLUTION_UPDATE',
      entityType: 'CustomerFeedback',
      entityId: id,
      details: {
        previousStatus: existing.status,
        newStatus: updated.status,
        rating: updated.rating,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Admin feedback update error:', error);
    return NextResponse.json({ error: 'Failed to update feedback status' }, { status: 500 });
  }
}
