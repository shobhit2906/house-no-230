import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import LoyaltyPortal from '@/components/loyalty/LoyaltyPortal';
import { Award, Gift, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gourmet Privileges Loyalty Program — House No. 230',
  description:
    'Join House No. 230 Gourmet Privileges. Earn dining stamps, unlock artisanal desserts, complimentary platters, and exclusive chef tastings.',
};

export default async function LoyaltyPage() {
  const rewards = await prisma.loyaltyReward.findMany({
    where: { isActive: true },
    orderBy: { pointsRequired: 'asc' },
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-gold/10 border border-gold/40 text-gold text-xs uppercase tracking-widest font-semibold">
            <Award className="w-4 h-4" />
            <span>Gourmet Privileges</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Digital Loyalty & Rewards
          </h1>

          <p className="text-sm text-secondary-gray leading-relaxed">
            A token of gratitude for our patron community. Earn dining reward points with every visit to House No. 230 and unlock artisanal culinary rewards.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-card-dark border border-border-dark space-y-2.5">
            <Sparkles className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-base font-bold text-warm-ivory">Welcome Bonus</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Enroll with your phone number and instantly receive 25 complimentary welcome points.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-2.5">
            <Gift className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-base font-bold text-warm-ivory">Dining Stamps</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Earn points on every dine-in visit verified seamlessly at your table by your server.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-base font-bold text-warm-ivory">Curated Rewards</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Redeem points for chef desserts, gourmet platters, and bespoke anniversary tasting dinners.
            </p>
          </div>
        </div>

        {/* Active Rewards Catalog */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-warm-ivory border-b border-border-dark pb-2">
            Active Privileges & Rewards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <div key={r.id} className="p-5 bg-card-dark border border-gold/30 space-y-2">
                <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider block">
                  {r.pointsRequired} Points Required
                </span>
                <h4 className="font-serif text-base font-semibold text-warm-ivory">{r.title}</h4>
                {r.description && (
                  <p className="text-xs text-secondary-gray leading-relaxed">{r.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Opt-In & Points Check Component */}
        <LoyaltyPortal />
      </div>
    </div>
  );
}
