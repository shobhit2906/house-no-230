import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { MessageSquareText, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guest Experience & Private Feedback — House No. 230',
  description:
    'Share your dining remarks privately with House No. 230 management. Your direct feedback guides our continuous culinary and hospitality refinement.',
};

export default async function FeedbackPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' },
    select: {
      googleMapsUrl: true,
      phone: true,
    },
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 border border-gold/40 text-gold text-xs uppercase tracking-widest font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Service Excellence & Recovery</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Direct Guest Feedback
          </h1>

          <p className="text-sm text-secondary-gray leading-relaxed max-w-xl mx-auto">
            At House No. 230, your experience is our singular benchmark. Please share your candid remarks directly with our senior management team.
          </p>
        </div>

        {/* Private Guarantee Strip */}
        <div className="p-4 bg-card-dark border border-border-dark flex items-start space-x-3 text-xs text-secondary-gray">
          <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-warm-ivory">Privacy & Service Recovery:</strong> All submissions are received privately by restaurant directors and managers for service auditing. If you experienced any shortcoming during your visit, providing your contact details allows us to initiate immediate service recovery.
          </p>
        </div>

        {/* Feedback Form */}
        <FeedbackForm googleMapsUrl={settings?.googleMapsUrl} />
      </div>
    </div>
  );
}
