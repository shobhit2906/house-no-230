import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LoyaltyCustomerOptInSchema, sanitizePhoneNumber } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    const rateCheck = checkRateLimit(`loyalty_optin:${clientIp}`, 10, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const parseResult = LoyaltyCustomerOptInSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Invalid details' },
        { status: 400 }
      );
    }

    const { phone, name, email } = parseResult.data;
    const sanitizedPhone = sanitizePhoneNumber(phone);

    let customer = await prisma.loyaltyCustomer.findUnique({
      where: { phone: sanitizedPhone },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    let isNew = false;
    if (!customer) {
      customer = await prisma.loyaltyCustomer.create({
        data: {
          phone: sanitizedPhone,
          name,
          email: email || null,
          totalPoints: 25, // 25 welcome points on first sign-up!
          totalVisits: 0,
        },
        include: {
          transactions: true,
        },
      });

      // Create welcome transaction record in ledger
      await prisma.loyaltyTransaction.create({
        data: {
          customerId: customer.id,
          points: 25,
          actionType: 'MANUAL_ADJUSTMENT',
          description: 'Welcome Bonus Points on Enrollment',
        },
      });
      isNew = true;
    }

    return NextResponse.json({
      success: true,
      isNew,
      message: isNew
        ? 'Welcome to House No. 230 Gourmet Privileges! You have received 25 bonus welcome points.'
        : 'Welcome back! Your existing membership has been retrieved.',
      customer: {
        name: customer.name,
        phone: customer.phone,
        totalPoints: isNew ? 25 : customer.totalPoints,
        totalVisits: customer.totalVisits,
      },
    });
  } catch (error) {
    console.error('Loyalty opt-in error:', error);
    return NextResponse.json({ error: 'Failed to process loyalty registration.' }, { status: 500 });
  }
}
