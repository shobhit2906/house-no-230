import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  UtensilsCrossed,
  FolderTree,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminOverviewPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [
    totalReservations,
    pendingReservations,
    confirmedReservations,
    totalDishes,
    totalCategories,
    recentPending,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.menuItem.count(),
    prisma.menuCategory.count({ where: { isPublished: true } }),
    prisma.reservation.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory">
            Operations Dashboard
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Real-time table reservations, menu management, and restaurant settings.
          </p>
        </div>
        <Link
          href="/admin/reservations"
          className="px-4 py-2 bg-gold text-deep-black text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all flex items-center space-x-1.5"
        >
          <span>Manage All Bookings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Requests */}
        <div className="bg-card-dark border border-gold/40 p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs uppercase tracking-widest font-semibold">Pending Review</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl font-bold text-warm-ivory">
            {pendingReservations}
          </div>
          <p className="text-[11px] text-secondary-gray">Awaiting staff confirmation</p>
        </div>

        {/* Confirmed */}
        <div className="bg-card-dark border border-border-dark p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs uppercase tracking-widest font-semibold">Confirmed</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl font-bold text-warm-ivory">
            {confirmedReservations}
          </div>
          <p className="text-[11px] text-secondary-gray">Verified table bookings</p>
        </div>

        {/* Menu Dishes */}
        <div className="bg-card-dark border border-border-dark p-5 space-y-2">
          <div className="flex items-center justify-between text-warm-ivory">
            <span className="text-xs uppercase tracking-widest font-semibold">Menu Dishes</span>
            <UtensilsCrossed className="w-5 h-5 text-gold" />
          </div>
          <div className="font-serif text-3xl font-bold text-warm-ivory">
            {totalDishes}
          </div>
          <p className="text-[11px] text-secondary-gray">In database catalog</p>
        </div>

        {/* Categories */}
        <div className="bg-card-dark border border-border-dark p-5 space-y-2">
          <div className="flex items-center justify-between text-warm-ivory">
            <span className="text-xs uppercase tracking-widest font-semibold">Categories</span>
            <FolderTree className="w-5 h-5 text-gold" />
          </div>
          <div className="font-serif text-3xl font-bold text-warm-ivory">
            {totalCategories}
          </div>
          <p className="text-[11px] text-secondary-gray">Published menu sections</p>
        </div>
      </div>

      {/* Pending Reservations Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-warm-ivory flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-gold" />
            <span>Pending Reservation Requests ({recentPending.length})</span>
          </h2>
          <Link
            href="/admin/reservations?status=PENDING"
            className="text-xs text-gold hover:underline"
          >
            View all pending &rarr;
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="bg-card-dark border border-border-dark p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm text-warm-ivory font-medium">All caught up!</p>
            <p className="text-xs text-secondary-gray">No pending table booking requests require action right now.</p>
          </div>
        ) : (
          <div className="bg-card-dark border border-border-dark overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/60">
                {recentPending.map((res) => (
                  <tr key={res.id} className="hover:bg-deep-black/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold">{res.reference}</td>
                    <td className="py-3 px-4 font-medium text-warm-ivory">{res.customerName}</td>
                    <td className="py-3 px-4 text-secondary-gray">{res.phone}</td>
                    <td className="py-3 px-4 text-warm-ivory font-medium">
                      {res.reservationDate} at {res.reservationTime}
                    </td>
                    <td className="py-3 px-4 text-secondary-gray">{res.guestCount} guests</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/reservations?q=${res.reference}`}
                        className="inline-flex items-center space-x-1 text-gold hover:underline font-semibold"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
        <Link
          href="/admin/menu"
          className="p-5 bg-card-dark border border-border-dark hover:border-gold/40 transition-all space-y-2 block"
        >
          <UtensilsCrossed className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-sm font-bold text-warm-ivory">Menu Items & Pricing</h3>
          <p className="text-xs text-secondary-gray">
            Update prices, toggle availability, add new dishes, and manage featured specials.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 bg-card-dark border border-border-dark hover:border-gold/40 transition-all space-y-2 block"
        >
          <Clock className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-sm font-bold text-warm-ivory">Hours & Contact Info</h3>
          <p className="text-xs text-secondary-gray">
            Configure announcement banner, restaurant address, phone number, and hours.
          </p>
        </Link>

        <Link
          href="/admin/export-import"
          className="p-5 bg-card-dark border border-border-dark hover:border-gold/40 transition-all space-y-2 block"
        >
          <FolderTree className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-sm font-bold text-warm-ivory">Export & Import Data</h3>
          <p className="text-xs text-secondary-gray">
            Backup all 145 dishes to CSV/JSON or import updated catalog spreadsheets.
          </p>
        </Link>
      </div>
    </div>
  );
}
