'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, AlertCircle, Send, ExternalLink, User, Phone, Tag } from 'lucide-react';

interface FeedbackFormProps {
  googleMapsUrl?: string | null;
}

export default function FeedbackForm({ googleMapsUrl }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<'FOOD' | 'SERVICE' | 'AMBIENCE' | 'BOOKING' | 'OTHER'>('FOOD');
  const [comments, setComments] = useState('');
  const [visitReference, setVisitReference] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [contactConsent, setContactConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          comments,
          visitReference: visitReference.trim() || undefined,
          customerName: customerName.trim() || undefined,
          customerPhone: customerPhone.trim() || undefined,
          contactConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

      setSuccessReference(data.reference);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successReference) {
    return (
      <div className="bg-card-dark border border-gold/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gold/15 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-warm-ivory">Thank You for Your Feedback</h3>
          <p className="text-xs text-secondary-gray max-w-md mx-auto leading-relaxed">
            Your remarks have been securely routed to our management team with tracking reference{' '}
            <strong className="text-gold font-mono">{successReference}</strong>.
          </p>
        </div>

        {rating >= 4 && googleMapsUrl && (
          <div className="p-5 bg-deep-black border border-border-dark max-w-md mx-auto space-y-3 text-xs">
            <p className="text-warm-ivory font-semibold">Enjoyed your experience at House No. 230?</p>
            <p className="text-secondary-gray text-[11px]">
              We would be deeply grateful if you shared your experience on our official Google Maps profile.
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gold text-deep-black font-bold uppercase tracking-wider text-[11px] hover:bg-gold-light"
            >
              <span>Write a Review on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <button
          onClick={() => {
            setSuccessReference(null);
            setComments('');
            setVisitReference('');
          }}
          className="text-xs text-secondary-gray hover:text-warm-ivory underline pt-2"
        >
          Submit Another Remark
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card-dark border border-border-dark p-6 sm:p-8 space-y-6 text-xs shadow-xl">
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Interactive Star Rating */}
      <div className="space-y-2 text-center pb-2">
        <label className="block uppercase tracking-wider text-warm-ivory font-bold text-sm">
          Overall Dining Experience
        </label>
        <div className="flex items-center justify-center space-x-2 pt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none focus:scale-110 transition-transform"
              aria-label={`Rate ${star} Stars`}
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                  (hoverRating || rating) >= star
                    ? 'text-gold fill-gold'
                    : 'text-border-dark stroke-secondary-gray'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        <span className="text-[11px] text-gold font-medium font-mono">
          {rating === 5 && 'Outstanding Experience'}
          {rating === 4 && 'Very Good Dining'}
          {rating === 3 && 'Average / Room for Improvement'}
          {rating === 2 && 'Disappointing Experience'}
          {rating === 1 && 'Unacceptable Experience'}
        </span>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
          Primary Area of Remark:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { label: 'Food & Flavors', value: 'FOOD' },
            { label: 'Service & Staff', value: 'SERVICE' },
            { label: 'Ambience & Music', value: 'AMBIENCE' },
            { label: 'Reservations', value: 'BOOKING' },
            { label: 'Other', value: 'OTHER' },
          ].map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value as typeof category)}
              className={`py-2 px-2 text-[11px] uppercase tracking-wider font-semibold border transition-all text-center ${
                category === cat.value
                  ? 'bg-gold text-deep-black border-gold font-bold'
                  : 'bg-deep-black border-border-dark text-secondary-gray hover:text-warm-ivory'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-1.5">
        <label className="block uppercase tracking-wider text-warm-ivory font-semibold">
          Your Specific Remarks & Observations <span className="text-gold">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Please tell us about your experience — what delighted you or how we can improve..."
          className="w-full bg-deep-black border border-border-dark p-3 text-xs text-warm-ivory focus:border-gold focus:outline-none"
        />
      </div>

      {/* Optional Visit Reference */}
      <div className="space-y-1.5">
        <label className="block uppercase tracking-wider text-secondary-gray">
          Reservation or Bill Reference <span className="text-secondary-gray/70 lowercase">(optional)</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={visitReference}
            onChange={(e) => setVisitReference(e.target.value)}
            placeholder="e.g. HN230-ABC123 or Table 8"
            className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Optional Contact for Service Recovery */}
      <div className="p-4 bg-deep-black/60 border border-border-dark space-y-3">
        <span className="text-[11px] uppercase tracking-wider text-gold font-bold block">
          Follow-up & Service Recovery (Optional)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-gray" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your Name (optional)"
              className="w-full bg-card-dark border border-border-dark pl-8 pr-3 py-2 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-gray" />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Mobile Number (optional)"
              className="w-full bg-card-dark border border-border-dark pl-8 pr-3 py-2 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-center space-x-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={contactConsent}
            onChange={(e) => setContactConsent(e.target.checked)}
            className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
          />
          <span className="text-[11px] text-secondary-gray">
            Management may contact me regarding this feedback to ensure my dining satisfaction.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || comments.trim().length < 5}
        className="w-full py-3 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Submitting Remarks...' : 'Submit Private Feedback'}</span>
      </button>
    </form>
  );
}
