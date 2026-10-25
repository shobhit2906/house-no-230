import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ReservationSubmissionSchema, sanitizePhoneNumber } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';
import { sendNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

function generateReservationReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HN230-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';

    // Rate limit: 5 requests per hour per IP
    const rateCheck = checkRateLimit(`reservation:${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many reservation requests. Please wait a while before requesting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = ReservationSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid reservation details';
      return NextResponse.json({ error: firstError, details: parseResult.error.flatten() }, { status: 400 });
    }

    const data = parseResult.data;
    const sanitizedPhone = sanitizePhoneNumber(data.phone);

    // Prevent duplicate submissions: check if same phone requested same date & time within the past 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingRecent = await prisma.reservation.findFirst({
      where: {
        phone: sanitizedPhone,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (existingRecent) {
      return NextResponse.json(
        {
          error: 'A reservation request for this phone number, date, and time was already submitted recently.',
          reference: existingRecent.reference,
        },
        { status: 409 }
      );
    }

    // Generate unique reference
    let reference = generateReservationReference();
    let collision = await prisma.reservation.findUnique({ where: { reference } });
    while (collision) {
      reference = generateReservationReference();
      collision = await prisma.reservation.findUnique({ where: { reference } });
    }

    const reservation = await prisma.reservation.create({
      data: {
        reference,
        customerName: data.customerName,
        phone: sanitizedPhone,
        email: data.email || null,
        reservationDate: data.reservationDate,
        reservationTime: data.reservationTime,
        guestCount: data.guestCount,
        seatingPreference: data.seatingPreference,
        occasion: data.occasion,
        specialRequest: data.specialRequest || null,
        status: 'PENDING',
        internalNotes: null,
      },
    });

    // Dispatch modular notification
    await sendNotification({
      recipient: sanitizedPhone,
      channel: 'WHATSAPP',
      template: 'RESERVATION_REQUEST_RECEIVED',
      data: {
        reference: reservation.reference,
        customerName: reservation.customerName,
        date: reservation.reservationDate,
        time: reservation.reservationTime,
      },
    });

    return NextResponse.json(
      {
        success: true,
        reference: reservation.reference,
        status: reservation.status,
        message:
          'Your table reservation request has been received. Our team will review your request and confirm via phone call or SMS. Please note that this is a request and not an instant confirmed booking.',
        reservation: {
          reference: reservation.reference,
          customerName: reservation.customerName,
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          guestCount: reservation.guestCount,
          seatingPreference: reservation.seatingPreference,
          occasion: reservation.occasion,
          status: reservation.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process reservation request. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
