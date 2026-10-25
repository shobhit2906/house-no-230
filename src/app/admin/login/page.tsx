'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ShieldCheck, UtensilsCrossed } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 bg-card-dark border border-border-dark p-8 sm:p-10 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono">
            Restricted Staff Access
          </span>
          <h1 className="font-serif text-2xl font-bold text-warm-ivory">
            House No. 230 Admin
          </h1>
          <p className="text-xs text-secondary-gray">
            Authenticate to manage table reservations, menu items, and restaurant configuration.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@houseno230.com"
                className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-warm-ivory/90 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-deep-black border border-border-dark pl-10 pr-3 py-2.5 text-sm text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-border-dark text-center">
          <p className="text-[11px] text-secondary-gray">
            Protected internal system. IP addresses and administrative actions are logged for security auditing.
          </p>
        </div>
      </div>
    </div>
  );
}
