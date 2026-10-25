import React from 'react';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  // If no session, allow login page through, otherwise redirect to login
  if (!session) {
    return (
      <div className="min-h-screen bg-deep-black text-warm-ivory">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-warm-ivory flex flex-col">
      <AdminNav user={session} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
