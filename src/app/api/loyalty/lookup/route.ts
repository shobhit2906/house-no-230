import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizePhoneNumber, indianPhoneRegex } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    const rateCheck = checkRateLimit(`loyalty_lookup:${clientIp}`, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get('phone')?.trim();

    if (!rawPhone || !indianPhoneRegex.test(rawPhone)) {
      return NextResponse.json({ error: 'Valid registered mobile number required.' }, { status: 400 });
    }

    const phone = sanitizePhoneNumber(rawPhone);

    const [customer, rewards] = await Promise.all([
      prisma.loyaltyCustomer.findUnique({
        where: { phone },
        select: {
          id: true,
          name: true,
          phone: true,
          totalPoints: true,
          totalVisits: true,
          optedInAt: true,
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              points: true,
              actionType: true,
              description: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.loyaltyReward.findMany({
        where: { isActive: true },
        orderBy: { pointsRequired: 'asc' },
      }),
    ]);

    if (!customer) {
      return NextResponse.json(
        { error: 'No loyalty membership found for this number. Sign up in seconds!' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
      availableRewards: rewards,
    });
  } catch (error) {
    console.error('Loyalty lookup error:', error);
    return NextResponse.json({ error: 'Failed to look up membership.' }, { status: 500 });
  }
}
