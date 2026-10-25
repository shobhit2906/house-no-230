import React from 'react';
import { Metadata } from 'next';
import ReservationForm from '@/components/reservation/ReservationForm';
import { Clock, ShieldAlert, CheckCircle2, PhoneCall } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Table Reservations — House No. 230',
  description:
    'Request a table reservation at House No. 230 — The Gourmet Kitchen & Bar. Prompt confirmation by restaurant staff for dinner, lunch, and celebration gatherings.',
};

export default async function ReservationsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Join Our Table
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Table Reservations
          </h1>
          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            We look forward to hosting you. Please submit your booking request below. Our team reviews table availability and confirms your reservation via phone call or SMS.
          </p>
        </div>

        {/* Guidelines Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-xs text-secondary-gray">
          <div className="p-4 bg-card-dark border border-border-dark flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-warm-ivory block font-semibold mb-1">Advance Notice</strong>
              Requests are recommended at least 2 hours prior to your preferred dining time.
            </div>
          </div>

          <div className="p-4 bg-card-dark border border-border-dark flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-warm-ivory block font-semibold mb-1">Table Holding Time</strong>
              Reserved tables are held for up to 15 minutes past the confirmed schedule.
            </div>
          </div>

          <div className="p-4 bg-card-dark border border-border-dark flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-warm-ivory block font-semibold mb-1">Large Parties</strong>
              For groups larger than 12 guests or private banquet bookings, please contact us directly.
            </div>
          </div>
        </div>

        {/* The Form */}
        <ReservationForm />

        {/* Direct Contact Backup */}
        {settings?.phone && (
          <div className="text-center pt-8 border-t border-border-dark max-w-md mx-auto space-y-2">
            <p className="text-xs text-secondary-gray">Need immediate assistance or last-minute seating?</p>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center space-x-2 text-sm text-gold font-bold hover:underline"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Us Directly: {settings.phone}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
