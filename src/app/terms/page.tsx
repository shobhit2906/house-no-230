import React from 'react';
import { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions — House No. 230',
  description: 'Terms and dining conditions for House No. 230 — The Gourmet Kitchen & Bar.',
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Dining & Venue Conditions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Terms & Conditions
          </h1>
          <p className="text-xs text-secondary-gray">
            House No. 230 — The Gourmet Kitchen & Bar
          </p>
        </div>

        <div className="prose prose-invert text-secondary-gray text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">1. Nature of Reservation Requests</h2>
            <p>
              Submitting a reservation request through our website constitutes an inquiry for table accommodation. It does <strong>not</strong> represent an instant, legally binding, or guaranteed booking until confirmed explicitly by restaurant staff via telephone or text notification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">2. Alcoholic Beverage & Bar Regulations</h2>
            <p>
              In strict accordance with Indian excise laws and municipal regulations:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alcoholic beverages will only be served to guests meeting the statutory legal drinking age applicable in the restaurant&apos;s jurisdiction.</li>
              <li>Valid government-issued photo identification with date of birth (e.g. Aadhaar Card, Passport, Driver&apos;s License) may be requested prior to service.</li>
              <li>We strictly adhere to responsible service guidelines and reserve the right to decline service to visibly intoxicated patrons.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">3. Hookah & Smoking Policies</h2>
            <p>
              Hookah service and tobacco-related offerings are restricted strictly to designated outdoor or smoking zones in compliance with municipal regulations and health statutes. Service is restricted strictly to adults of legal age.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">4. Right of Admission</h2>
            <p>
              House No. 230 management reserves the right of admission and the right to request any guest engaging in disruptive or unlawful behavior to vacate the premises.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-warm-ivory">5. Menu Pricing & Availability</h2>
            <p>
              Items, prices, and seasonal ingredients displayed on this website are subject to market availability and verification upon dining. All applicable taxes (GST) and service charges are itemized on the restaurant bill.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
