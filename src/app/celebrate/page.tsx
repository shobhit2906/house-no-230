import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import CelebrateForm from '@/components/events/CelebrateForm';
import { PartyPopper, Users, Sparkles, Wine, UtensilsCrossed, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Celebrate at House No. 230 — Private Dining & Events Bhopal',
  description:
    'Plan your birthday celebration, anniversary, corporate dinner, or private banquet at House No. 230 — The Gourmet Kitchen & Bar, Bhopal.',
};

export default async function CelebratePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' },
    select: {
      phone: true,
      whatsappNumber: true,
      eventPolicies: true,
    },
  });

  return (
    <div className="py-12 sm:py-20 space-y-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-gold/40 bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] font-medium">
            <PartyPopper className="w-4 h-4" />
            <span>Private Events & Dining</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warm-ivory leading-tight">
            Celebrate at House No. 230
          </h1>

          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            From intimate birthday dinners and milestone anniversaries to corporate banquets and cocktail evenings. Let our culinary team and hospitality hosts design an unforgettable celebration along Kerwa Dam Road, Bhopal.
          </p>
        </div>

        {/* Event Ambience Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <Sparkles className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Milestone Celebrations</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Custom table decor, personalized multi-course gourmet menus, sizzling brownie surprises, and dedicated servers for your family or friends.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <Wine className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Cocktails & Bar Lounges</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Curated mocktail fountains, international lagers, signature starters, and ambient evening illumination suited for celebratory toasts.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <Users className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Corporate & Group Banquets</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Comfortable seating configurations, buffet or plated dining arrangements, and attentive coordination for executive dinners and team celebrations.
            </p>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              Event Consultation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory">
              Submit an Event Inquiry
            </h2>
            <p className="text-xs text-secondary-gray max-w-lg mx-auto">
              Tell us about your celebration requirements. Our banquet manager will review availability and contact you with custom arrangements.
            </p>
          </div>

          <CelebrateForm
            primaryPhone={settings?.phone || '+91 89898 88988'}
            eventPolicies={settings?.eventPolicies}
          />
        </div>
      </div>
    </div>
  );
}
