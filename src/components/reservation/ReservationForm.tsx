'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, CheckCircle, AlertCircle, Search, ShieldCheck } from 'lucide-react';

export default function ReservationForm() {
  const [tab, setTab] = useState<'request' | 'lookup'>('request');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    reservationDate: '',
    reservationTime: '19:30',
    guestCount: 2,
    specialRequest: '',
    consent: false,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    message: string;
    customerName: string;
    reservationDate: string;
    reservationTime: string;
    guestCount: number;
    status: string;
  } | null>(null);

  // Lookup state
  const [lookupRef, setLookupRef] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<{
    reference: string;
    customerName: string;
    reservationDate: string;
    reservationTime: string;
    guestCount: number;
    status: string;
    createdAt: string;
  } | null>(null);

  // Compute minimum selectable date (today in Asia/Kolkata)
  const todayKolkata = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const timeSlots = [
    '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guestCount: Number(formData.guestCount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit reservation request');
      }

      setSuccessData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);
    setLookupLoading(true);

    try {
      const res = await fetch(
        `/api/reservations/lookup?reference=${encodeURIComponent(lookupRef)}&phone=${encodeURIComponent(lookupPhone)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to look up reservation');
      }

      setLookupResult(data.reservation);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLookupError(err.message);
      } else {
        setLookupError('Failed to retrieve reservation details.');
      }
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="bg-card-dark border border-border-dark p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex border-b border-border-dark mb-8">
        <button
          onClick={() => {
            setTab('request');
            setSuccessData(null);
            setError(null);
          }}
          className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all border-b-2 -mb-[2px] ${
            tab === 'request'
              ? 'border-gold text-gold'
              : 'border-transparent text-secondary-gray hover:text-warm-ivory'
          }`}
        >
          Request a Table
        </button>
        <button
          onClick={() => {
            setTab('lookup');
            setLookupError(null);
            setLookupResult(null);
          }}
          className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all border-b-2 -mb-[2px] ${
            tab === 'lookup'
              ? 'border-gold text-gold'
              : 'border-transparent text-secondary-gray hover:text-warm-ivory'
          }`}
        >
          Check Existing Booking
        </button>
      </div>

      {tab === 'request' ? (
        successData ? (
          <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-gold/15 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-warm-ivory">Request Received</h3>
              <p className="text-sm text-secondary-gray max-w-md mx-auto">
                {successData.message}
              </p>
            </div>

            <div className="bg-deep-black border border-border-dark p-6 text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-border-dark">
                <span className="text-xs uppercase tracking-wider text-secondary-gray">Reference Code</span>
                <span className="font-mono text-base font-bold text-gold tracking-widest">
                  {successData.reference}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-gray">Guest Name</span>
                <span className="text-warm-ivory font-medium">{successData.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-gray">Date & Time</span>
                <span className="text-warm-ivory font-medium">
                  {successData.reservationDate} at {successData.reservationTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-gray">Guests</span>
                <span className="text-warm-ivory font-medium">{successData.guestCount} People</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-border-dark">
                <span className="text-secondary-gray">Status</span>
                <span className="text-xs uppercase tracking-widest font-bold px-2 py-0.5 bg-yellow-950/60 text-yellow-400 border border-yellow-700/50">
                  {successData.status} (Staff Review)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  customerName: '',
                  phone: '',
                  email: '',
                  reservationDate: '',
                  reservationTime: '19:30',
                  guestCount: 2,
                  specialRequest: '',
                  consent: false,
                });
              }}
              className="text-xs uppercase tracking-widest text-gold hover:underline pt-4"
            >
              Submit Another Reservation Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                  Full Name <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
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
                    className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-secondary-gray">10 digits starting with 6, 7, 8, or 9</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                  Date <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
                  <input
                    type="date"
                    required
                    min={todayKolkata}
                    value={formData.reservationDate}
                    onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                    className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                  Time Slot <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray pointer-events-none" />
                  <select
                    value={formData.reservationTime}
                    onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                    className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none appearance-none"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                  Guests <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                Email Address <span className="text-secondary-gray text-[10px] lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. guest@example.com"
                  className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
                Special Occasion / Dietary Notes{' '}
                <span className="text-secondary-gray text-[10px] lowercase">(optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-secondary-gray" />
                <textarea
                  rows={3}
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  placeholder="Anniversary, birthday celebration, high chair request, or specific seating preferences..."
                  className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Consent & Policy Checkbox */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
                />
                <span className="text-xs text-secondary-gray leading-relaxed">
                  I understand this is a <strong className="text-warm-ivory">reservation request</strong> and not an instant confirmed booking. The restaurant staff will contact me to confirm availability. I consent to receiving communication regarding this reservation request.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Table Reservation Request</span>
                </>
              )}
            </button>
          </form>
        )
      ) : (
        /* Status Lookup Tab */
        <div className="space-y-6">
          <p className="text-xs text-secondary-gray">
            Enter your booking reference code (provided upon submitting your request) and registered phone number to check current confirmation status.
          </p>

          <form onSubmit={handleLookup} className="space-y-4">
            {lookupError && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {lookupError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-warm-ivory font-medium">
                Reference Code
              </label>
              <input
                type="text"
                required
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
                placeholder="e.g. HN230-ABC123"
                className="w-full bg-deep-black border border-border-dark px-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none uppercase font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-warm-ivory font-medium">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                required
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-deep-black border border-border-dark px-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={lookupLoading}
              className="w-full py-3 border border-gold bg-gold/10 hover:bg-gold hover:text-deep-black text-gold text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{lookupLoading ? 'Checking...' : 'Check Status'}</span>
            </button>
          </form>

          {lookupResult && (
            <div className="mt-6 p-5 bg-deep-black border border-border-dark space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border-dark">
                <span className="text-xs uppercase tracking-wider text-secondary-gray">Reference</span>
                <span className="font-mono text-sm font-bold text-gold">{lookupResult.reference}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary-gray">Guest</span>
                <span className="text-warm-ivory">{lookupResult.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary-gray">Date & Time</span>
                <span className="text-warm-ivory">
                  {lookupResult.reservationDate} at {lookupResult.reservationTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary-gray">Party Size</span>
                <span className="text-warm-ivory">{lookupResult.guestCount} Guests</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border-dark">
                <span className="text-xs text-secondary-gray">Status</span>
                <span
                  className={`text-xs uppercase tracking-wider font-bold px-2 py-0.5 border ${
                    lookupResult.status === 'CONFIRMED'
                      ? 'bg-green-950/60 text-green-400 border-green-700/50'
                      : lookupResult.status === 'REJECTED' || lookupResult.status === 'CANCELLED'
                      ? 'bg-red-950/60 text-red-400 border-red-700/50'
                      : 'bg-yellow-950/60 text-yellow-400 border-yellow-700/50'
                  }`}
                >
                  {lookupResult.status}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
