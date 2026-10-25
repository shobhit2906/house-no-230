'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  active: boolean;
  text?: string | null;
}

export default function AnnouncementBar({ active, text }: AnnouncementBarProps) {
  if (!active || !text) return null;

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-charcoal via-gold-dark/20 to-charcoal border-b border-gold/30 text-warm-ivory py-2 px-4 text-xs tracking-wider uppercase">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0 animate-pulse" />
        <span className="font-medium text-warm-ivory">{text}</span>
      </div>
    </aside>
  );
}
