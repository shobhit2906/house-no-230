'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  QrCode,
  CalendarCheck,
  MessageSquare,
  Award,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

const JOURNEY_STEPS = [
  {
    step: 1,
    id: 'discovery',
    title: '1. Discovery & Verified Local Presence',
    badge: 'Guest Acquisition',
    description:
      'A patron in Bhopal searches for gourmet dining or spots House No. 230 on Instagram or District.in.',
    details: [
      'Verified physical address on Kerwa Dam Road, opposite Bull Mother Farm.',
      'Click-to-call direct to +91 89898 88988 without intermediaries.',
      'Pre-formatted WhatsApp inquiries encode reservation intent automatically.',
      'Direct Google Maps navigation route for hassle-free arrival.',
    ],
    liveLinks: [
      { label: 'View Homepage Hero & Contact Actions', href: '/' },
      { label: 'Inspect Verified Business Settings', href: '/admin/settings' },
    ],
  },
  {
    step: 2,
    id: 'menu',
    title: '2. Lightning-Fast QR & Web Menu',
    badge: 'Dine-In & Pre-Visit',
    description:
      'At the table or from home, guests browse 145 curated gourmet dishes with zero app install required.',
    details: [
      'Zero-latency category filtering across 17 departments (Starters, Tandoor, Main Course, Bar).',
      'Vegetarian and Non-Vegetarian badges with honest pricing.',
      'Table-specific QR code generator for printable physical table tents.',
      'Dedicated mobile-optimized QR menu route (/qr-menu) tailored for smartphones.',
    ],
    liveLinks: [
      { label: 'Launch Public Menu', href: '/menu' },
      { label: 'Open Mobile QR Menu (/qr-menu)', href: '/qr-menu' },
      { label: 'Print Table QR Codes', href: '/admin/qr' },
    ],
  },
  {
    step: 3,
    id: 'booking',
    title: '3. Smart Table & Celebration Requests',
    badge: 'Intent Capture',
    description:
      'Guests request dining tables or private events with seating preferences and lead time validation.',
    details: [
      'Enforces minimum advance notice (e.g. 2 hours) and party limits.',
      'Client generates privacy-safe reference codes (e.g. RES230-XXXXXX & EV230-XXXXXX).',
      'No false "instant confirmation" promises — sets honest human expectation.',
      'Auto-formats WhatsApp confirmation link for the customer.',
    ],
    liveLinks: [
      { label: 'Test Table Reservation Form', href: '/reservations' },
      { label: 'Test Celebrate & Private Event Inquiries', href: '/celebrate' },
    ],
  },
  {
    step: 4,
    id: 'staff-workflow',
    title: '4. Staff Administration & State Machine',
    badge: 'Operations Control',
    description:
      'Authorized management reviews incoming requests, assigns tables, logs notes, and transitions status.',
    details: [
      'Strict server-side state machine: PENDING → CONFIRMED / REJECTED → COMPLETED / CANCELLED.',
      'Event lead pipeline tracking (New → Contacted → Quoted → Confirmed → Lost).',
      'One-click WhatsApp client contact with pre-filled acknowledgment message.',
      'Every action is tracked in an immutable, timestamped Audit Log with staff credentials.',
    ],
    liveLinks: [
      { label: 'Open Reservations Dashboard', href: '/admin/reservations' },
      { label: 'Open Event Lead Pipeline', href: '/admin/events' },
      { label: 'Inspect Security Audit Log', href: '/admin/audit' },
    ],
  },
  {
    step: 5,
    id: 'retention',
    title: '5. Loyalty Club & Service Recovery',
    badge: 'LTV & Brand Protection',
    description:
      'Turning one-time diners into regular patrons while quietly addressing any service issues.',
    details: [
      'Digital Connoisseur Club (/loyalty): Guests earn points on dining visits with 25 welcome points.',
      'Staff can stamp visits (+50 pts) or redeem reward tiers with balance verification.',
      'Direct feedback portal (/feedback) captures private customer critiques before public social posting.',
      'Executive dashboard aggregates real party sizes, meal periods, and lead conversion rates.',
    ],
    liveLinks: [
      { label: 'Guest Loyalty Portal', href: '/loyalty' },
      { label: 'Staff Loyalty Ledger', href: '/admin/loyalty' },
      { label: 'Private Feedback Inbox', href: '/admin/feedback' },
      { label: 'Executive Analytics Hub', href: '/admin/analytics' },
    ],
  },
];

export default function AdminDemoPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div className="border-b border-border-dark pb-6">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Owner Walkthrough</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory">
          The House No. 230 Customer & Operations Journey
        </h1>
        <p className="text-xs text-secondary-gray mt-1 max-w-2xl">
          Follow the 5 key stages of your platform to see how prospective diners discover, reserve, experience,
          and return to your gourmet kitchen and bar.
        </p>
      </div>

      {/* Step Progress Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-border-dark pb-4">
        {JOURNEY_STEPS.map((s, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 text-left border transition-all text-xs flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'border-gold bg-gold/10 text-warm-ivory'
                  : 'border-border-dark bg-card-dark text-secondary-gray hover:border-gold/40'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-gold' : 'text-secondary-gray'}`}>
                STAGE 0{s.step}
              </span>
              <span className="font-serif font-semibold text-xs leading-tight line-clamp-2">
                {s.title.split('. ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Presentation */}
      <div className="bg-card-dark border border-border-dark p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-gold/15 text-gold border border-gold/30">
              {currentStep.badge}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-warm-ivory mt-2">
              {currentStep.title}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 border border-border-dark text-xs text-secondary-gray hover:text-warm-ivory disabled:opacity-30"
            >
              Previous
            </button>
            <button
              disabled={activeStepIndex === JOURNEY_STEPS.length - 1}
              onClick={() => setActiveStepIndex((prev) => Math.min(JOURNEY_STEPS.length - 1, prev + 1))}
              className="px-3 py-1.5 bg-gold text-deep-black text-xs font-semibold hover:bg-gold-light disabled:opacity-30"
            >
              Next Stage
            </button>
          </div>
        </div>

        <p className="text-sm text-warm-ivory leading-relaxed font-sans">{currentStep.description}</p>

        {/* Feature Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentStep.details.map((detail, dIdx) => (
            <div
              key={dIdx}
              className="p-3 bg-deep-black/60 border border-border-dark flex items-start space-x-3 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-secondary-gray leading-normal">{detail}</span>
            </div>
          ))}
        </div>

        {/* Quick Launchpad to Test in Real Time */}
        <div className="border-t border-border-dark pt-5">
          <span className="text-[10px] uppercase tracking-wider text-secondary-gray block mb-3 font-semibold">
            Test Live In This Platform:
          </span>
          <div className="flex flex-wrap gap-3">
            {currentStep.liveLinks.map((link, lIdx) => (
              <Link
                key={lIdx}
                href={link.href}
                target="_blank"
                className="px-4 py-2 bg-deep-black hover:bg-charcoal border border-gold/40 text-warm-ivory hover:text-gold text-xs font-semibold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Integrity Note */}
      <div className="p-4 bg-deep-black/40 border border-border-dark flex items-start space-x-3 text-xs text-secondary-gray">
        <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-warm-ivory">Architectural Guarantee:</strong> Every user submission creates genuine records in your persistent database with validation and security checks. No mock or ephemeral data is presented in your production environment.
        </p>
      </div>
    </div>
  );
}
