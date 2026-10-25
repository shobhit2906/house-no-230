import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  MessageSquare,
  Navigation,
  ExternalLink,
  PartyPopper,
  QrCode,
  Award,
} from 'lucide-react';
import { SiteSettingsData } from '@/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface FooterProps {
  settings?: SiteSettingsData | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const primaryPhone = settings?.phone || '+91 89898 88988';
  const address =
    settings?.address ||
    '230, Kerwa Dam Road, opposite Bull Mother Farm, near N.L.I.U., National Law Institute University, Bhopal, Madhya Pradesh 462044, India.';
  const mapsUrl =
    settings?.googleMapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=House+No+230+The+Gourmet+Kitchen+Bar+Bhopal';
  const email = settings?.email || 'contact@houseno230.com';
  const districtUrl =
    settings?.districtUrl ||
    'https://www.district.in/dining/bhopal/house-no-230-the-gourmet-kitchen-mendori';
  const linktreeUrl = settings?.linktreeUrl || 'https://linktr.ee/Houseno230';

  const whatsAppUrl = buildWhatsAppLink({
    phone: primaryPhone,
    type: 'general',
  });

  return (
    <footer className="bg-deep-black border-t border-border-dark text-warm-ivory/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border-dark">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="w-5 h-5 text-gold" />
              <span className="font-serif text-xl font-bold tracking-widest text-warm-ivory">
                HOUSE NO. 230
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-light">
              The Gourmet Kitchen & Bar &bull; Bhopal
            </p>
            <p className="text-xs text-secondary-gray leading-relaxed pt-1">
              An experiential culinary and cocktail destination along Kerwa Dam Road in Bhopal. Bringing multicuisine gourmet craft, serene ambience, and refined hospitality to your table.
            </p>
            {/* Quick action buttons in footer */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-card-dark border border-border-dark hover:border-gold text-xs font-semibold text-warm-ivory transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Call Us</span>
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/80 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold">
              Explore & Dine
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-gold transition-colors">
                  Our Menu (145+ Dishes)
                </Link>
              </li>
              <li>
                <Link href="/qr-menu" className="hover:text-gold transition-colors flex items-center space-x-1">
                  <QrCode className="w-3 h-3 text-gold" />
                  <span>Mobile QR Code Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/celebrate" className="hover:text-gold transition-colors flex items-center space-x-1">
                  <PartyPopper className="w-3 h-3 text-gold" />
                  <span>Celebrate & Private Events</span>
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-gold transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors">
                  Ambience & Gallery
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-gold transition-colors flex items-center space-x-1">
                  <Award className="w-3 h-3 text-gold" />
                  <span>Gourmet Privileges</span>
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-gold transition-colors">
                  Private Guest Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Verified Bhopal Details) */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold">
              Visit & Connect
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-secondary-gray leading-relaxed block">{address}</span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-gold hover:underline font-semibold text-[11px]"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </li>

              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="hover:text-gold font-mono font-semibold transition-colors">
                    {primaryPhone}
                  </a>
                  {settings?.secondaryPhone && (
                    <div className="text-[10px] text-secondary-gray">
                      Secondary:{' '}
                      <a href={`tel:${settings.secondaryPhone.replace(/\s+/g, '')}`} className="hover:underline font-mono">
                        {settings.secondaryPhone}
                      </a>{' '}
                      {!settings.secondaryPhoneVerified && (
                        <span className="text-gold/70 italic">(Verification pending)</span>
                      )}
                    </div>
                  )}
                </div>
              </li>

              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
                  {email}
                </a>
              </li>

              <li className="flex items-start space-x-2.5 pt-1">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-secondary-gray leading-normal">
                  {settings?.openingHours || 'Daily: 12:30 PM – 11:30 PM (Lunch & Dinner)'}
                </span>
              </li>
            </ul>

            {/* Third-party listing links */}
            <div className="pt-2 border-t border-border-dark/60 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-secondary-gray block font-semibold">
                Online Listings:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <a
                  href={districtUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold flex items-center space-x-1 underline"
                >
                  <span>District.in Dining Profile</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="text-secondary-gray">&bull;</span>
                <a
                  href={linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold flex items-center space-x-1 underline"
                >
                  <span>Linktree</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Legal and Regulatory Notice */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Policies & Operations</span>
            </h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Bar offerings and Hookah service strictly adhere to Madhya Pradesh excise licensing, municipal guidelines, and legal drinking age restrictions.
            </p>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Valid government-issued photo ID is required for alcoholic beverage service. Management reserves the right of admission.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/admin/login"
                className="text-xs text-gold hover:underline font-semibold"
              >
                Staff Portal Sign In &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-gray space-y-4 sm:space-y-0">
          <p>
            &copy; {currentYear} House No. 230 — The Gourmet Kitchen & Bar. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center space-x-6">
            <Link href="/privacy" className="hover:text-warm-ivory transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-warm-ivory transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/feedback" className="hover:text-warm-ivory transition-colors">
              Guest Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
