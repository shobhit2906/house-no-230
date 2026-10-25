import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { SiteSettingsData } from '@/types';

interface FooterProps {
  settings?: SiteSettingsData | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
              The Gourmet Kitchen & Bar
            </p>
            <p className="text-sm text-secondary-gray leading-relaxed pt-2">
              An experiential culinary haven bringing refined flavours, artisanal sips, and sophisticated hospitality to your table.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-gold transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors">
                  Ambience & Gallery
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-gold transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Honest: renders only what is configured) */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold">
              Visit & Connect
            </h3>
            <ul className="space-y-3 text-sm">
              {settings?.address ? (
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-gray">{settings.address}</span>
                </li>
              ) : (
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-gold/60 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-gray text-xs italic">
                    Location address will be updated shortly upon official opening.
                  </span>
                </li>
              )}

              {settings?.phone && (
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-gold transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}

              {settings?.email && (
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}

              {settings?.openingHours ? (
                <li className="flex items-start space-x-2.5 pt-1">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-gray text-xs leading-normal">
                    {settings.openingHours}
                  </span>
                </li>
              ) : (
                <li className="flex items-start space-x-2.5 pt-1">
                  <Clock className="w-4 h-4 text-gold/60 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-gray text-xs italic">
                    Opening hours: Confirmed on booking request confirmation.
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Legal and Regulatory Notice */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-wider text-warm-ivory font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Dining Policies</span>
            </h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Bar offerings and Hookah service strictly adhere to local statutory licensing, municipal guidelines, and legal drinking age restrictions.
            </p>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Valid government-issued photo ID is required for alcoholic beverage service. Management reserves the right of admission.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-xs text-gold/70 hover:text-gold underline underline-offset-4"
              >
                Staff Administration
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-gray space-y-4 sm:space-y-0">
          <p>
            &copy; {currentYear} House No. 230 — The Gourmet Kitchen & Bar. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-warm-ivory transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-warm-ivory transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
