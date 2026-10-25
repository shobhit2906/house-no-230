'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, MapPin, Phone, Mail, Clock, MessageSquare, Info, ShieldCheck, Calendar, Users, ExternalLink } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    restaurantName: 'House No. 230',
    tagline: 'The Gourmet Kitchen & Bar',
    announcementActive: false,
    announcementText: '',
    address: '',
    phone: '',
    secondaryPhone: '',
    secondaryPhoneVerified: false,
    email: '',
    whatsappNumber: '',
    openingHours: '',
    googleMapsUrl: '',
    districtUrl: '',
    linktreeUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    aboutStory: '',
    reservationLeadHours: 2,
    maxPartySize: 20,
    reservationPolicies: '',
    eventPolicies: '',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (res.ok && data.settings) {
          setFormData({
            restaurantName: data.settings.restaurantName || 'House No. 230',
            tagline: data.settings.tagline || 'The Gourmet Kitchen & Bar',
            announcementActive: data.settings.announcementActive || false,
            announcementText: data.settings.announcementText || '',
            address: data.settings.address || '',
            phone: data.settings.phone || '',
            secondaryPhone: data.settings.secondaryPhone || '',
            secondaryPhoneVerified: data.settings.secondaryPhoneVerified || false,
            email: data.settings.email || '',
            whatsappNumber: data.settings.whatsappNumber || '',
            openingHours: data.settings.openingHours || '',
            googleMapsUrl: data.settings.googleMapsUrl || '',
            districtUrl: data.settings.districtUrl || '',
            linktreeUrl: data.settings.linktreeUrl || '',
            instagramUrl: data.settings.instagramUrl || '',
            facebookUrl: data.settings.facebookUrl || '',
            aboutStory: data.settings.aboutStory || '',
            reservationLeadHours: data.settings.reservationLeadHours ?? 2,
            maxPartySize: data.settings.maxPartySize ?? 20,
            reservationPolicies: data.settings.reservationPolicies || '',
            eventPolicies: data.settings.eventPolicies || '',
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setFeedback({ type: 'success', message: 'Restaurant settings updated and audited successfully.' });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-gold animate-pulse">
        Loading restaurant settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-gold" />
            <span>Restaurant Configuration</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Update verified Bhopal venue details, reservation lead rules, online directories, and brand policies.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border border-red-800 text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Announcement Strip Settings */}
        <div className="bg-card-dark border border-border-dark p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-base font-bold text-warm-ivory">
              Announcement & Notification Strip
            </h2>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.announcementActive}
              onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
              className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
            />
            <span className="text-xs font-semibold text-warm-ivory">
              Display Announcement Banner at top of website
            </span>
          </label>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-secondary-gray">
              Banner Message
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="e.g. Special Weekend Chef Platter now serving. Reserve your table early."
              className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Business Contact & Verified Details */}
        <div className="bg-card-dark border border-border-dark p-6 space-y-5">
          <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
            <MapPin className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-base font-bold text-warm-ivory">
              Verified Business Details (Bhopal Venue)
            </h2>
          </div>

          <div className="p-3 bg-deep-black/60 border border-border-dark flex items-start space-x-2.5 text-xs text-secondary-gray">
            <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <span>
              Per brand guidelines: Secondary phone numbers remain flagged as unverified until confirmed by the owner. Public visitors only see verified numbers.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Primary Phone Number (Click-to-call)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 89898 88988"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                WhatsApp Inquiries Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+91 89898 88988"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Secondary Phone Number (Optional)
              </label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                placeholder="+91 91312 45032"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.secondaryPhoneVerified}
                  onChange={(e) => setFormData({ ...formData, secondaryPhoneVerified: e.target.checked })}
                  className="rounded border-border-dark bg-deep-black text-gold focus:ring-gold"
                />
                <span className="text-xs font-semibold text-warm-ivory flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Mark Secondary Phone as Verified</span>
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-secondary-gray">
              Physical Street Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="230, Kerwa Dam Road, opposite Bull Mother Farm, near N.L.I.U., Bhopal, MP 462044"
              className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Google Maps Directions URL
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Reservations Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@houseno230.com"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                District.in Listing URL
              </label>
              <input
                type="url"
                value={formData.districtUrl}
                onChange={(e) => setFormData({ ...formData, districtUrl: e.target.value })}
                placeholder="https://www.district.in/dining/bhopal/house-no-230-the-gourmet-kitchen-mendori"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Linktree Official Profile
              </label>
              <input
                type="url"
                value={formData.linktreeUrl}
                onChange={(e) => setFormData({ ...formData, linktreeUrl: e.target.value })}
                placeholder="https://linktr.ee/Houseno230"
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-secondary-gray">
              Operating Hours Summary
            </label>
            <textarea
              rows={2}
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="e.g. Lunch: 12:30 PM – 3:30 PM | Dinner: 7:00 PM – 11:30 PM (Daily)"
              className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Reservation & Lead Policies */}
        <div className="bg-card-dark border border-border-dark p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
            <Calendar className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-base font-bold text-warm-ivory">
              Booking Lead Times & Capacity Limits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Minimum Advance Notice (Hours)
              </label>
              <input
                type="number"
                min={0}
                max={48}
                value={formData.reservationLeadHours}
                onChange={(e) => setFormData({ ...formData, reservationLeadHours: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
              <p className="text-[10px] text-secondary-gray">Guests cannot book same-day slots within this buffer window.</p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Maximum Party Size (Online Booking)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.maxPartySize}
                onChange={(e) => setFormData({ ...formData, maxPartySize: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
              <p className="text-[10px] text-secondary-gray">Larger groups will be prompted to contact our events desk.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Dining Reservation Policies
              </label>
              <textarea
                rows={3}
                value={formData.reservationPolicies}
                onChange={(e) => setFormData({ ...formData, reservationPolicies: e.target.value })}
                placeholder="Tables are held for 15 minutes past scheduled time..."
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-secondary-gray">
                Private Celebration & Event Policies
              </label>
              <textarea
                rows={3}
                value={formData.eventPolicies}
                onChange={(e) => setFormData({ ...formData, eventPolicies: e.target.value })}
                placeholder="Outside decor subject to manager review. Advance token required for private zones..."
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Editorial Restaurant Story */}
        <div className="bg-card-dark border border-border-dark p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
            <Clock className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-base font-bold text-warm-ivory">
              Editorial Dining Narrative
            </h2>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-secondary-gray">
              Homepage & Story Page Narrative
            </label>
            <textarea
              rows={4}
              value={formData.aboutStory}
              onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
              className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center space-x-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
