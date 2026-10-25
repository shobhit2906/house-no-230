'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  FolderTree,
  Settings,
  History,
  FileDown,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { SessionPayload } from '@/types';

interface AdminNavProps {
  user: SessionPayload;
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
    { label: 'Menu Dishes', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Restaurant Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit History', href: '/admin/audit', icon: History },
    { label: 'Export / Import', href: '/admin/export-import', icon: FileDown },
  ];

  return (
    <header className="bg-card-dark border-b border-border-dark sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Staff Identity Strip */}
        <div className="py-3 border-b border-border-dark flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-sm font-bold text-gold tracking-wider">
              HOUSE NO. 230 &bull; STAFF MANAGEMENT
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-gold/15 text-gold text-[10px] uppercase font-mono">
              {user.role}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-secondary-gray hidden md:inline">
              Signed in as <strong className="text-warm-ivory">{user.email}</strong>
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-secondary-gray hover:text-gold flex items-center space-x-1"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center space-x-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gold text-deep-black'
                    : 'text-warm-ivory/80 hover:text-warm-ivory hover:bg-deep-black/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
