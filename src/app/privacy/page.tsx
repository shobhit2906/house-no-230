import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — House No. 230',
  description: 'Privacy Policy and customer data handling practices for House No. 230.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Privacy Commitment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Privacy Policy
          </h1>
          <p className="text-xs text-secondary-gray">
            Last updated: October 2026 &bull; House No. 230 — The Gourmet Kitchen & Bar
          </p>
        </div>

        <div className="prose prose-invert text-secondary-gray text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">1. Data We Collect</h2>
            <p>
              When you submit a table reservation request or interact with our services, we collect only the information necessary to fulfill your dining experience:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Guest Name</li>
              <li>Contact Mobile Number (used strictly to confirm reservation status)</li>
              <li>Email address (if voluntarily supplied)</li>
              <li>Date, time, guest count, and optional seating/dietary preferences</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">2. How We Use Your Information</h2>
            <p>
              Your contact details are utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reviewing and confirming table availability</li>
              <li>Contacting you regarding scheduling adjustments or reservation reminders</li>
              <li>Internal operational quality and guest hospitality management</li>
            </ul>
            <p>
              We do not sell, rent, or lease your personal information to third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">3. Data Retention & Deletion</h2>
            <p>
              Reservation request records are retained for a reasonable operational period to verify bookings and manage recurring hospitality preferences. Guests may request deletion of their past contact records by reaching out to our restaurant administration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">4. Security Measures</h2>
            <p>
              All customer records are stored in a secured database with parameterized access controls, role-based authorization for restaurant personnel, and encrypted sessions for staff administrative actions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
