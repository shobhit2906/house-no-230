import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { MapPin, Phone, Mail, Clock, MessageSquare, Navigation, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact & Location — House No. 230',
  description:
    'Contact House No. 230 — The Gourmet Kitchen & Bar. Find address details, hours of service, telephone reservations, and direct navigation links.',
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Location & Contact
          </h1>
          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            We are here to assist with table bookings, private dining queries, and feedback.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location & Directions */}
          <div className="p-8 bg-card-dark border border-border-dark space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-gold" />
              <h2 className="font-serif text-xl font-bold text-warm-ivory">Address</h2>
            </div>
            {settings?.address ? (
              <div className="space-y-4">
                <p className="text-sm text-secondary-gray leading-relaxed">{settings.address}</p>
                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold font-bold hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-secondary-gray italic leading-relaxed">
                The restaurant address will be updated in the system once final site operations begin.
              </p>
            )}
          </div>

          {/* Operating Hours */}
          <div className="p-8 bg-card-dark border border-border-dark space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-gold" />
              <h2 className="font-serif text-xl font-bold text-warm-ivory">Dining Hours</h2>
            </div>
            {settings?.openingHours ? (
              <p className="text-sm text-secondary-gray whitespace-pre-line leading-relaxed">
                {settings.openingHours}
              </p>
            ) : (
              <div className="space-y-2 text-sm text-secondary-gray">
                <p><strong className="text-warm-ivory">Lunch Service:</strong> 12:30 PM – 3:30 PM</p>
                <p><strong className="text-warm-ivory">Dinner Service:</strong> 7:00 PM – 11:30 PM</p>
                <p className="text-xs text-secondary-gray italic pt-2">
                  (Timings subject to operational confirmation)
                </p>
              </div>
            )}
          </div>

          {/* Direct Phone & WhatsApp */}
          <div className="p-8 bg-card-dark border border-border-dark space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6 text-gold" />
              <h2 className="font-serif text-xl font-bold text-warm-ivory">Direct Inquiries</h2>
            </div>
            <div className="space-y-3">
              {settings?.phone ? (
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary-gray block">Phone</span>
                  <a href={`tel:${settings.phone}`} className="text-base text-gold font-bold hover:underline">
                    {settings.phone}
                  </a>
                </div>
              ) : (
                <p className="text-xs text-secondary-gray italic">
                  Telephone reservations line is pending setup.
                </p>
              )}

              {settings?.whatsappNumber && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20House%20No.%20230,%20I%20would%20like%20to%20inquire%20about%20a%20table%20reservation`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-900/60 border border-emerald-600 text-emerald-200 text-xs uppercase tracking-widest font-bold hover:bg-emerald-800/80 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Email & Reservations */}
          <div className="p-8 bg-card-dark border border-border-dark space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-gold" />
              <h2 className="font-serif text-xl font-bold text-warm-ivory">Reservations Desk</h2>
            </div>
            <div className="space-y-4 text-sm text-secondary-gray">
              <p>
                Submit table requests online anytime for rapid review and schedule confirmation.
              </p>
              <Link
                href="/reservations"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Go To Reservation Form</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
