'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, CalendarCheck, UtensilsCrossed } from 'lucide-react';

interface NavbarProps {
  restaurantName?: string;
  tagline?: string;
}

export default function Navbar({
  restaurantName = 'House No. 230',
  tagline = 'The Gourmet Kitchen & Bar',
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

  // Close mobile drawer on route change or Escape key
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

  // Lock body scroll when mobile menu is open
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
    { label: 'Our Story', href: '/story' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-deep-black/95 backdrop-blur-md border-b border-border-dark py-3 shadow-xl'
          : 'bg-deep-black/80 backdrop-blur-sm border-b border-border-dark/60 py-4'
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
            <span className="font-serif text-lg sm:text-xl font-bold tracking-widest text-warm-ivory group-hover:text-gold transition-colors">
              {restaurantName.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gold-light/80 font-sans pl-7">
            {tagline}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-wider font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-gold'
                    : 'text-warm-ivory/80 hover:text-warm-ivory'
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

        {/* Reserve CTA Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="/reservations"
            className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-none border border-gold bg-gold/10 hover:bg-gold hover:text-deep-black text-gold text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reserve a Table</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-warm-ivory hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
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
          className="fixed inset-0 top-[65px] z-50 bg-deep-black/98 border-t border-border-dark flex flex-col justify-between p-6 overflow-y-auto lg:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-6 pt-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg uppercase tracking-wider font-serif py-2 border-b border-border-dark/40 ${
                      isActive ? 'text-gold pl-2 border-gold/50 font-bold' : 'text-warm-ivory hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-8 pb-12 space-y-4">
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gold text-deep-black text-sm uppercase tracking-widest font-bold text-center transition-opacity hover:opacity-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve a Table</span>
            </Link>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-xs text-secondary-gray hover:text-warm-ivory py-2 uppercase tracking-widest"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
