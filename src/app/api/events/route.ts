import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EventLeadSubmissionSchema, sanitizePhoneNumber } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';
import { sendNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

function generateEventReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EV230-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';

    // Rate limit: 5 event requests per hour per IP
    const rateCheck = checkRateLimit(`event:${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many event inquiries submitted. Please wait a while before requesting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = EventLeadSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid event inquiry details';
      return NextResponse.json({ error: firstError, details: parseResult.error.flatten() }, { status: 400 });
    }

    const data = parseResult.data;
    const sanitizedPhone = sanitizePhoneNumber(data.phone);

    // Prevent duplicate event submission in short window
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingRecent = await prisma.eventLead.findFirst({
      where: {
        phone: sanitizedPhone,
        eventDate: data.eventDate,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (existingRecent) {
      return NextResponse.json(
        {
          error: 'An event inquiry for this phone number and date was already submitted recently.',
          reference: existingRecent.reference,
        },
        { status: 409 }
      );
    }

    let reference = generateEventReference();
    let collision = await prisma.eventLead.findUnique({ where: { reference } });
    while (collision) {
      reference = generateEventReference();
      collision = await prisma.eventLead.findUnique({ where: { reference } });
    }

    const lead = await prisma.eventLead.create({
      data: {
        reference,
        customerName: data.customerName,
        phone: sanitizedPhone,
        email: data.email || null,
        eventType: data.eventType,
        eventDate: data.eventDate,
        guestCount: data.guestCount,
        budgetRange: data.budgetRange || null,
        decorationRequirements: data.decorationRequirements || null,
        notes: data.notes || null,
        status: 'NEW',
      },
    });

    await sendNotification({
      recipient: sanitizedPhone,
      channel: 'WHATSAPP',
      template: 'EVENT_INQUIRY_RECEIVED',
      data: {
        reference: lead.reference,
        customerName: lead.customerName,
        eventType: lead.eventType,
        eventDate: lead.eventDate,
        guestCount: lead.guestCount,
      },
    });

    return NextResponse.json(
      {
        success: true,
        reference: lead.reference,
        status: lead.status,
        message:
          'Thank you for your event inquiry! Our events and banquets team at House No. 230 will review your requirements and reach out to discuss custom menus, seating arrangements, and scheduling.',
        lead: {
          reference: lead.reference,
          customerName: lead.customerName,
          eventType: lead.eventType,
          eventDate: lead.eventDate,
          guestCount: lead.guestCount,
          status: lead.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process celebration inquiry. Please call our events team directly.' },
      { status: 500 }
    );
  }
}
