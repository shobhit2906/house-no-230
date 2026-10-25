import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 bg-card-dark border border-border-dark flex items-center justify-center mx-auto text-gold">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono">
          Error 404
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory">
          Page Not Found
        </h1>
        <p className="text-sm text-secondary-gray leading-relaxed">
          The table or dish you are looking for does not exist or may have been moved. Let us escort you back to our main dining selections.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gold text-deep-black text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
