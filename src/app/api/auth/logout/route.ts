import { NextResponse } from 'next/server';
import { removeSessionCookie, getCurrentSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST() {
  const session = await getCurrentSession();
  if (session) {
    await logAuditEvent({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'ADMIN_LOGOUT',
      entityType: 'AdminUser',
      entityId: session.userId,
    });
  }

  await removeSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
