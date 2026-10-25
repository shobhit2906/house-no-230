import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sanitizePhoneNumber } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    const rateCheck = checkRateLimit(`lookup:${clientIp}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many lookup requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference')?.trim().toUpperCase();
    const rawPhone = searchParams.get('phone')?.trim();

    if (!reference || !rawPhone) {
      return NextResponse.json(
        { error: 'Reference code and registered phone number are required.' },
        { status: 400 }
      );
    }

    const phone = sanitizePhoneNumber(rawPhone);

    const reservation = await prisma.reservation.findFirst({
      where: {
        reference,
        phone,
      },
      select: {
        reference: true,
        customerName: true,
        reservationDate: true,
        reservationTime: true,
        guestCount: true,
        status: true,
        createdAt: true,
        // Notice: internalNotes and email/full phone are omitted for customer privacy!
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'No matching reservation found for the supplied reference and phone number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.error('Reservation lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to look up reservation details.' },
      { status: 500 }
    );
  }
}
