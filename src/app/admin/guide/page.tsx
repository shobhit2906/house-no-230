'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  UtensilsCrossed,
  Sparkles,
  PhoneCall,
  QrCode,
  Shield,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminGuidePage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-dark pb-6">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Operational Documentation</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory">
          House No. 230 — Restaurant Operations Guide
        </h1>
        <p className="text-xs text-secondary-gray mt-1">
          Simple, non-technical instructions for managers and hosts to run daily operations smoothly.
        </p>
      </div>

      {/* Routine 1: Daily Service Protocol */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-border-dark pb-3">
          <Calendar className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">
            Daily Service Workflow (Host & Manager)
          </h2>
        </div>

        <div className="space-y-3 text-xs text-secondary-gray leading-relaxed">
          <div className="flex items-start space-x-3 p-3 bg-deep-black/60 border border-border-dark">
            <span className="font-mono text-gold font-bold">01</span>
            <div>
              <strong className="text-warm-ivory block mb-0.5">Morning Check (11:00 AM)</strong>
              Open <Link href="/admin/reservations" className="text-gold underline">Reservations</Link> and filter by &quot;Pending&quot;. Check party sizes and contact guests via the WhatsApp or Call button to confirm table readiness.
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-deep-black/60 border border-border-dark">
            <span className="font-mono text-gold font-bold">02</span>
            <div>
              <strong className="text-warm-ivory block mb-0.5">Event Lead Review</strong>
              Open <Link href="/admin/events" className="text-gold underline">Celebration Inquiries</Link>. Review incoming birthday or anniversary requests. Assign a manager and log notes after quoting party packages.
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-deep-black/60 border border-border-dark">
            <span className="font-mono text-gold font-bold">03</span>
            <div>
              <strong className="text-warm-ivory block mb-0.5">Evening Shift Close (11:30 PM)</strong>
              Mark arrived guests as &quot;Completed&quot; and no-shows as &quot;Cancelled&quot;. Check <Link href="/admin/feedback" className="text-gold underline">Feedback</Link> for any guest critiques from dinner service that require proactive service recovery.
            </div>
          </div>
        </div>
      </div>

      {/* Routine 2: Updating the Menu */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-border-dark pb-3">
          <UtensilsCrossed className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">
            Menu Updates & 86ing (Out of Stock)
          </h2>
        </div>

        <p className="text-xs text-secondary-gray leading-relaxed">
          The 145 dishes in your catalog can be updated instantly from <Link href="/admin/menu" className="text-gold underline">Menu Management</Link>:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-secondary-gray">
          <li className="p-3 bg-deep-black/60 border border-border-dark">
            <strong className="text-warm-ivory block mb-1">Marking Items Unavailable:</strong>
            Toggle the active switch next to any dish. It will vanish from the public menu and QR menu immediately, preventing kitchen stockout issues.
          </li>
          <li className="p-3 bg-deep-black/60 border border-border-dark">
            <strong className="text-warm-ivory block mb-1">Adjusting Prices:</strong>
            Click &quot;Edit&quot; on any dish, update the price in INR (₹), and save. The change reflects instantly across both web and QR interfaces.
          </li>
          <li className="p-3 bg-deep-black/60 border border-border-dark">
            <strong className="text-warm-ivory block mb-1">Adding Chef Specials:</strong>
            Mark &quot;Featured&quot; on any signature dish to elevate its placement on the homepage signature showcase.
          </li>
          <li className="p-3 bg-deep-black/60 border border-border-dark">
            <strong className="text-warm-ivory block mb-1">Dietary Badges:</strong>
            Ensure vegetarian and non-vegetarian badges match the actual preparation to respect guest preferences.
          </li>
        </ul>
      </div>

      {/* Routine 3: Printing Table QR Codes */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-border-dark pb-3">
          <QrCode className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">
            Printing & Placing Physical Table QR Tents
          </h2>
        </div>

        <div className="text-xs text-secondary-gray space-y-2 leading-relaxed">
          <p>
            Go to <Link href="/admin/qr" className="text-gold underline">QR Code Generator</Link>. You can enter table numbers (e.g. Table 1, Table 12, PDR 1) and click &quot;Print Menu Stand&quot; to print elegant, brand-aligned acrylic table tent inserts.
          </p>
          <div className="p-3 bg-gold/10 border border-gold/30 text-warm-ivory text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Scanning these codes opens the ultra-fast mobile menu with zero downloads required for guests.</span>
          </div>
        </div>
      </div>

      {/* Routine 4: Security & Auditability */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-border-dark pb-3">
          <Shield className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">
            Security, Staff Passwords & Audit Trail
          </h2>
        </div>

        <div className="text-xs text-secondary-gray space-y-2 leading-relaxed">
          <p>
            Every single administrative action (approving reservations, changing prices, awarding loyalty stamps, editing hours) is recorded in the immutable <Link href="/admin/audit" className="text-gold underline">Security Audit Log</Link> with the manager&apos;s email and exact timestamp.
          </p>
          <div className="p-3 bg-deep-black/60 border border-border-dark text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-secondary-gray flex-shrink-0 mt-0.5" />
            <span>
              Always ensure individual managers have their own accounts rather than sharing passwords. Create new staff in the database using the initial admin seed script.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
