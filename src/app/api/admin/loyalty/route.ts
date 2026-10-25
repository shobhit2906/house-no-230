import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { LoyaltyTransactionSchema, LoyaltyRewardSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('q')?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
      ];
    }

    const [members, rewards, recentTransactions] = await Promise.all([
      prisma.loyaltyCustomer.findMany({
        where,
        orderBy: { totalPoints: 'desc' },
        take: 50,
      }),
      prisma.loyaltyReward.findMany({
        orderBy: { pointsRequired: 'asc' },
      }),
      prisma.loyaltyTransaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          customer: {
            select: { name: true, phone: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      members,
      rewards,
      recentTransactions,
    });
  } catch (error) {
    console.error('Admin loyalty fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve loyalty records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();

    // Handle Reward creation or Transaction creation
    if (body.type === 'CREATE_REWARD') {
      const parsed = LoyaltyRewardSchema.safeParse(body.reward);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid reward' }, { status: 400 });
      }

      const reward = await prisma.loyaltyReward.create({ data: parsed.data });
      await logAuditEvent({
        actorId: auth.session.userId,
        actorEmail: auth.session.email,
        action: 'LOYALTY_REWARD_CREATE',
        entityType: 'LoyaltyReward',
        entityId: reward.id,
        details: { title: reward.title, pointsRequired: reward.pointsRequired },
      });

      return NextResponse.json({ success: true, reward }, { status: 201 });
    }

    // Otherwise handle Transaction
    const parsed = LoyaltyTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid transaction' }, { status: 400 });
    }

    const { customerId, points, actionType, description, referenceCode } = parsed.data;

    const customer = await prisma.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Loyalty member not found' }, { status: 404 });
    }

    // Prevent negative balances if redeeming
    if (actionType === 'REWARD_REDEMPTION') {
      const deduction = Math.abs(points);
      if (customer.totalPoints < deduction) {
        return NextResponse.json(
          { error: `Insufficient points balance. Member has ${customer.totalPoints} points, but ${deduction} points are required.` },
          { status: 400 }
        );
      }
    }

    const netPoints = actionType === 'REWARD_REDEMPTION' ? -Math.abs(points) : points;
    const isVisit = actionType === 'VISIT_STAMP';

    // Atomic update
    const [transaction, updatedCustomer] = await prisma.$transaction([
      prisma.loyaltyTransaction.create({
        data: {
          customerId,
          points: netPoints,
          actionType,
          description,
          referenceCode: referenceCode || null,
          actorStaffId: auth.session.userId,
        },
      }),
      prisma.loyaltyCustomer.update({
        where: { id: customerId },
        data: {
          totalPoints: { increment: netPoints },
          totalVisits: isVisit ? { increment: 1 } : undefined,
        },
      }),
    ]);

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'LOYALTY_TRANSACTION',
      entityType: 'LoyaltyCustomer',
      entityId: customerId,
      details: {
        actionType,
        points: netPoints,
        newBalance: updatedCustomer.totalPoints,
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Admin loyalty transaction error:', error);
    return NextResponse.json({ error: 'Failed to process loyalty action' }, { status: 500 });
  }
}
