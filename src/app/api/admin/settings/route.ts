import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { SiteSettingsSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = SiteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid settings' }, { status: 400 });
    }

    const data = parsed.data;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'global' },
      update: {
        restaurantName: data.restaurantName,
        tagline: data.tagline,
        announcementActive: data.announcementActive,
        announcementText: data.announcementText || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        whatsappNumber: data.whatsappNumber || null,
        openingHours: data.openingHours || null,
        googleMapsUrl: data.googleMapsUrl || null,
        instagramUrl: data.instagramUrl || null,
        facebookUrl: data.facebookUrl || null,
        aboutStory: data.aboutStory || null,
      },
      create: {
        id: 'global',
        restaurantName: data.restaurantName,
        tagline: data.tagline,
        announcementActive: data.announcementActive,
        announcementText: data.announcementText || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        whatsappNumber: data.whatsappNumber || null,
        openingHours: data.openingHours || null,
        googleMapsUrl: data.googleMapsUrl || null,
        instagramUrl: data.instagramUrl || null,
        facebookUrl: data.facebookUrl || null,
        aboutStory: data.aboutStory || null,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'SITE_SETTINGS_UPDATE',
      entityType: 'SiteSettings',
      entityId: 'global',
      details: { announcementActive: settings.announcementActive },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
