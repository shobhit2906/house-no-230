'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  CalendarCheck,
  UtensilsCrossed,
  Phone,
  MessageSquare,
  QrCode,
  PartyPopper,
} from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface NavbarProps {
  restaurantName?: string;
  tagline?: string;
  primaryPhone?: string;
}

export default function Navbar({
  restaurantName = 'House No. 230',
  tagline = 'The Gourmet Kitchen & Bar',
  primaryPhone = '+91 89898 88988',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Celebrate', href: '/celebrate' },
    { label: 'QR Menu', href: '/qr-menu' },
    { label: 'Story', href: '/story' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
  ];

  const whatsAppUrl = buildWhatsAppLink({
    phone: primaryPhone,
    type: 'general',
  });

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-deep-black/95 backdrop-blur-md border-b border-border-dark py-2.5 shadow-xl'
          : 'bg-deep-black/85 backdrop-blur-sm border-b border-border-dark/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Typographic Wordmark */}
        <Link
          href="/"
          className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label={`${restaurantName} Home`}
        >
          <div className="flex items-center space-x-2">
            <UtensilsCrossed className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-warm-ivory group-hover:text-gold transition-colors">
              {restaurantName.toUpperCase()}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-gold-light/80 font-sans pl-7">
            {tagline}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1 ${
                  isActive ? 'text-gold' : 'text-warm-ivory/80 hover:text-warm-ivory'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Direct Action Contacts: Call, WhatsApp, Reserve */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Quick Click-to-Call */}
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
            className="p-2 sm:px-3 sm:py-2 border border-border-dark hover:border-gold/50 bg-card-dark text-warm-ivory hover:text-gold text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title={`Call Restaurant: ${primaryPhone}`}
            aria-label={`Call Restaurant at ${primaryPhone}`}
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline font-mono">{primaryPhone}</span>
          </a>

          {/* Quick WhatsApp */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Chat on WhatsApp"
            aria-label="Chat with House No. 230 on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          {/* Reserve CTA Button */}
          <Link
            href="/reservations"
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 border border-gold bg-gold/15 hover:bg-gold hover:text-deep-black text-gold text-xs uppercase tracking-widest font-bold transition-all duration-200 shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book Table</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-warm-ivory hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 top-[60px] z-50 bg-deep-black/98 border-t border-border-dark flex flex-col justify-between p-6 overflow-y-auto xl:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-4 pt-2">
            {/* Quick Action Pills in Drawer */}
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border-dark/60">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="py-2.5 px-3 bg-card-dark border border-border-dark flex items-center justify-center space-x-2 text-xs text-warm-ivory font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Call Now</span>
              </a>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-950/80 border border-emerald-700 flex items-center justify-center space-x-2 text-xs text-emerald-300 font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base uppercase tracking-wider font-serif py-2.5 border-b border-border-dark/30 ${
                      isActive ? 'text-gold pl-2 border-gold/50 font-bold' : 'text-warm-ivory hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 pb-8 space-y-3 border-t border-border-dark/60">
            <Link
              href="/celebrate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-card-dark border border-gold/40 text-gold text-xs uppercase tracking-widest font-bold"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Celebrate at House No. 230</span>
            </Link>

            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gold text-deep-black text-xs uppercase tracking-widest font-bold text-center"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Request a Table Reservation</span>
            </Link>

            <div className="flex justify-between items-center pt-2 text-xs text-secondary-gray">
              <Link
                href="/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-warm-ivory"
              >
                Share Feedback
              </Link>
              <Link
                href="/loyalty"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-warm-ivory"
              >
                Gourmet Privileges
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
