import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CustomerFeedbackSubmissionSchema, sanitizePhoneNumber } from '@/lib/validations';
import { checkRateLimit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function generateFeedbackReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FB230-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';

    // Rate limit: 5 feedback per hour per IP
    const rateCheck = checkRateLimit(`feedback:${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a while before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = CustomerFeedbackSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid feedback details';
      return NextResponse.json({ error: firstError, details: parseResult.error.flatten() }, { status: 400 });
    }

    const data = parseResult.data;
    const sanitizedPhone = data.customerPhone ? sanitizePhoneNumber(data.customerPhone) : null;

    let reference = generateFeedbackReference();
    let collision = await prisma.customerFeedback.findUnique({ where: { reference } });
    while (collision) {
      reference = generateFeedbackReference();
      collision = await prisma.customerFeedback.findUnique({ where: { reference } });
    }

    const feedback = await prisma.customerFeedback.create({
      data: {
        reference,
        visitReference: data.visitReference || null,
        rating: data.rating,
        category: data.category,
        comments: data.comments,
        customerName: data.customerName || null,
        customerPhone: sanitizedPhone,
        contactConsent: data.contactConsent,
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        success: true,
        reference: feedback.reference,
        message:
          'Thank you for your valuable feedback. Your remarks have been sent privately to our management team for quality assurance and continuous service improvement.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback. Please contact restaurant management directly.' },
      { status: 500 }
    );
  }
}
