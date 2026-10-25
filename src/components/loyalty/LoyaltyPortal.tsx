'use client';

import React, { useState } from 'react';
import { Award, User, Phone, Mail, Search, CheckCircle2, AlertCircle, Sparkles, Clock } from 'lucide-react';

interface MemberData {
  id: string;
  name: string;
  phone: string;
  totalPoints: number;
  totalVisits: number;
  transactions?: {
    id: string;
    points: number;
    actionType: string;
    description: string;
    createdAt: string;
  }[];
}

export default function LoyaltyPortal() {
  const [activeTab, setActiveTab] = useState<'check' | 'enroll'>('check');

  // Enroll state
  const [enrollName, setEnrollName] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Check state
  const [checkPhone, setCheckPhone] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Active member result
  const [member, setMember] = useState<MemberData | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError(null);
    setEnrollLoading(true);

    try {
      const res = await fetch('/api/loyalty/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enrollName,
          phone: enrollPhone,
          email: enrollEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enroll');

      setNotification(data.message);
      setMember(data.customer);
    } catch (err: unknown) {
      setEnrollError(err instanceof Error ? err.message : 'Error enrolling member');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckError(null);
    setCheckLoading(true);

    try {
      const res = await fetch(`/api/loyalty/lookup?phone=${encodeURIComponent(checkPhone)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Member not found');

      setMember(data.customer);
      setNotification(null);
    } catch (err: unknown) {
      setCheckError(err instanceof Error ? err.message : 'Error finding membership');
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="bg-card-dark border border-border-dark p-6 sm:p-10 shadow-2xl space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-border-dark">
        <button
          onClick={() => {
            setActiveTab('check');
            setMember(null);
          }}
          className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'check'
              ? 'border-gold text-gold'
              : 'border-transparent text-secondary-gray hover:text-warm-ivory'
          }`}
        >
          Check My Points
        </button>
        <button
          onClick={() => {
            setActiveTab('enroll');
            setMember(null);
          }}
          className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'enroll'
              ? 'border-gold text-gold'
              : 'border-transparent text-secondary-gray hover:text-warm-ivory'
          }`}
        >
          Enroll in Privileges (+25 Bonus)
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-700 text-emerald-300 text-xs flex items-center space-x-2">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {member ? (
        /* Member Card Display */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-charcoal via-card-dark to-deep-black border border-gold/60 p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-gold/20">
              <Award className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                  House No. 230 &bull; Bhopal
                </span>
                <h3 className="font-serif text-2xl font-bold text-warm-ivory mt-1">{member.name}</h3>
                <span className="text-xs text-secondary-gray font-mono">{member.phone}</span>
              </div>
              <span className="px-3 py-1 bg-gold/15 text-gold border border-gold/40 text-[10px] uppercase tracking-wider font-bold">
                Privilege Member
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-dark/60">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-secondary-gray block">
                  Reward Points Available
                </span>
                <span className="font-serif text-3xl font-bold text-gold">{member.totalPoints}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-secondary-gray block">
                  Total Dining Visits
                </span>
                <span className="font-serif text-3xl font-bold text-warm-ivory">{member.totalVisits}</span>
              </div>
            </div>
          </div>

          {member.transactions && member.transactions.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-secondary-gray font-semibold block">
                Recent Privileges Activity:
              </span>
              <div className="bg-deep-black border border-border-dark divide-y divide-border-dark/60 text-xs">
                {member.transactions.map((tx) => (
                  <div key={tx.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-warm-ivory font-medium block">{tx.description}</span>
                      <span className="text-[10px] text-secondary-gray">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        tx.points > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setMember(null)}
            className="text-xs text-gold hover:underline block text-center w-full"
          >
            Check Another Mobile Number
          </button>
        </div>
      ) : activeTab === 'check' ? (
        /* Check Points Form */
        <form onSubmit={handleLookup} className="space-y-4 text-xs max-w-md mx-auto">
          {checkError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{checkError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-semibold">
              Registered Mobile Number (India)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="tel"
                required
                value={checkPhone}
                onChange={(e) => setCheckPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={checkLoading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-deep-black font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{checkLoading ? 'Retrieving Privileges...' : 'Check Points Balance'}</span>
          </button>
        </form>
      ) : (
        /* Enroll Form */
        <form onSubmit={handleEnroll} className="space-y-4 text-xs max-w-md mx-auto">
          {enrollError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{enrollError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-semibold">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="text"
                required
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                placeholder="e.g. Rohan Singhania"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-semibold">
              Mobile Number (India) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="tel"
                required
                value={enrollPhone}
                onChange={(e) => setEnrollPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-warm-ivory font-semibold">
              Email Address <span className="text-secondary-gray lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="email"
                value={enrollEmail}
                onChange={(e) => setEnrollEmail(e.target.value)}
                placeholder="e.g. member@example.com"
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enrollLoading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-deep-black font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{enrollLoading ? 'Enrolling...' : 'Join Gourmet Privileges (+25 Bonus Points)'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
