'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  PartyPopper,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface CelebrateFormProps {
  primaryPhone: string;
  eventPolicies?: string | null;
}

export default function CelebrateForm({ primaryPhone, eventPolicies }: CelebrateFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    eventType: 'BIRTHDAY',
    eventDate: '',
    guestCount: 15,
    budgetRange: '',
    decorationRequirements: '',
    notes: '',
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    message: string;
    lead: {
      reference: string;
      customerName: string;
      eventType: string;
      eventDate: string;
      guestCount: number;
    };
  } | null>(null);

  const todayKolkata = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guestCount: Number(formData.guestCount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit event inquiry');

      setSuccessData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    const whatsAppFollowUp = buildWhatsAppLink({
      phone: primaryPhone,
      type: 'event',
      context: {
        reference: successData.reference,
        customerName: successData.lead.customerName,
        date: successData.lead.eventDate,
        eventType: successData.lead.eventType,
        guests: successData.lead.guestCount,
      },
    });

    return (
      <div className="bg-card-dark border border-gold/40 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gold/15 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-gold font-mono">
            Inquiry Registered
          </span>
          <h3 className="font-serif text-2xl font-bold text-warm-ivory">
            Celebration Request Received
          </h3>
          <p className="text-xs text-secondary-gray leading-relaxed max-w-md mx-auto">
            {successData.message}
          </p>
        </div>

        <div className="bg-deep-black border border-border-dark p-5 text-left space-y-2.5 max-w-sm mx-auto text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-border-dark">
            <span className="text-secondary-gray uppercase tracking-wider">Inquiry Reference</span>
            <span className="font-mono text-sm font-bold text-gold">{successData.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-gray">Guest:</span>
            <span className="text-warm-ivory font-semibold">{successData.lead.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-gray">Occasion:</span>
            <span className="text-warm-ivory capitalize">
              {successData.lead.eventType.toLowerCase().replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-gray">Preferred Date:</span>
            <span className="text-warm-ivory">{successData.lead.eventDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-gray">Estimated Guests:</span>
            <span className="text-warm-ivory font-bold">{successData.lead.guestCount} People</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsAppFollowUp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-900/80 border border-emerald-600 hover:bg-emerald-800 text-emerald-200 text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Events Desk on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSuccessData(null);
              setFormData({
                customerName: '',
                phone: '',
                email: '',
                eventType: 'BIRTHDAY',
                eventDate: '',
                guestCount: 15,
                budgetRange: '',
                decorationRequirements: '',
                notes: '',
                consent: false,
              });
            }}
            className="text-xs text-secondary-gray hover:text-warm-ivory underline pt-2 sm:pt-0"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-dark border border-border-dark p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Host / Organizer Name <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Vikramaditya Rathore"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Mobile */}
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Mobile Number (India) <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-secondary-gray">Our banquet host will call to verify</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Event Type */}
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Celebration Type <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <PartyPopper className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray pointer-events-none" />
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none appearance-none"
              >
                <option value="BIRTHDAY">Birthday Celebration</option>
                <option value="ANNIVERSARY">Anniversary Dinner</option>
                <option value="CORPORATE">Corporate Mixer / Dinner</option>
                <option value="GROUP_DINNER">Large Group Gathering</option>
                <option value="PRIVATE_DINING">Private Dining Room</option>
                <option value="OTHER">Other Special Occasion</option>
              </select>
            </div>
          </div>

          {/* Preferred Date */}
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Preferred Date <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="date"
                required
                min={todayKolkata}
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Guest Count <span className="text-gold">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="number"
                min="5"
                max="500"
                required
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) || 5 })}
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Email Address <span className="text-secondary-gray lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. host@example.com"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-medium">
              Target Budget Range <span className="text-secondary-gray lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              placeholder="e.g. ₹1,200 – ₹1,800 per person"
              className="w-full bg-deep-black border border-border-dark px-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Decoration Requirements */}
        <div className="space-y-1.5">
          <label className="block uppercase tracking-wider text-warm-ivory font-medium">
            Decoration or Special Theme Requests <span className="text-secondary-gray lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.decorationRequirements}
            onChange={(e) => setFormData({ ...formData, decorationRequirements: e.target.value })}
            placeholder="e.g. Birthday balloons, floral centerpiece, anniversary cake arrangement"
            className="w-full bg-deep-black border border-border-dark px-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-1.5">
          <label className="block uppercase tracking-wider text-warm-ivory font-medium">
            Additional Dietary or Seating Notes <span className="text-secondary-gray lowercase">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special menu preferences, Jain food options, audio requirements, or preferred seating zone..."
            className="w-full bg-deep-black border border-border-dark p-3 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {/* Consent */}
        <div className="space-y-2 pt-1">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
            />
            <span className="text-xs text-secondary-gray leading-relaxed">
              I understand that submitting this inquiry does not guarantee event booking. The House No. 230 banquet manager will connect with me to confirm custom menus, quotes, and advance booking terms.{' '}
              {eventPolicies && <span className="block pt-1 text-[11px] text-warm-ivory/80">{eventPolicies}</span>}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{loading ? 'Submitting Inquiry...' : 'Submit Celebration & Event Inquiry'}</span>
        </button>
      </form>
    </div>
  );
}
