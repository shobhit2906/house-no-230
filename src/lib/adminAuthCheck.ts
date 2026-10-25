import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { SessionPayload } from '@/types';

export async function requireAdminSession(): Promise<
  { session: SessionPayload; errorResponse?: never } | { session?: never; errorResponse: NextResponse }
> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Staff authentication required' },
        { status: 401 }
      ),
    };
  }
  return { session };
}
