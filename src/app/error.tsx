'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="space-y-6 max-w-md mx-auto bg-card-dark border border-border-dark p-8">
        <div className="w-12 h-12 bg-red-950/50 border border-red-800 rounded-full flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-red-400 font-mono">
          System Notice
        </span>
        <h1 className="font-serif text-2xl font-bold text-warm-ivory">
          An Unexpected Error Occurred
        </h1>
        <p className="text-xs text-secondary-gray leading-relaxed">
          We encountered a brief disruption while loading this section. Please refresh the page or try again.
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gold text-deep-black text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
