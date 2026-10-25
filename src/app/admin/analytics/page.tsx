'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  CalendarCheck,
  PartyPopper,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  Users,
  Award,
  Star,
  FileSpreadsheet,
} from 'lucide-react';

interface MetricsData {
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    rejected: number;
    confirmationRate: string;
  };
  events: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    quoted: number;
    confirmed: number;
    lost: number;
    closed: number;
    conversionRate: string;
  };
  breakdowns: {
    seating: Record<string, number>;
    occasions: Record<string, number>;
    eventTypes: Record<string, number>;
  };
  feedback: {
    totalCount: number;
    averageRating: string | null;
  };
  loyalty: {
    totalMembers: number;
    netPoints: number;
  };
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-8">
      {/* Title & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <BarChart3 className="w-6 h-6 text-gold" />
            <span>Owner Executive Analytics</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Real performance metrics computed directly from database reservations, event leads, and guest feedback.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 border border-border-dark bg-card-dark p-1">
          {(['7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                range === r
                  ? 'bg-gold text-deep-black font-bold'
                  : 'text-secondary-gray hover:text-warm-ivory'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-xs text-gold animate-pulse">
          Aggregating verified business metrics...
        </div>
      ) : !metrics ? (
        <div className="p-12 text-center text-secondary-gray text-xs">
          Unable to load analytics metrics.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Table Confirmation Rate */}
            <div className="bg-card-dark border border-border-dark p-5 space-y-2">
              <div className="flex items-center justify-between text-gold">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Table Bookings
                </span>
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="font-serif text-3xl font-bold text-warm-ivory">
                {metrics.reservations.total}
              </div>
              <div className="text-xs text-secondary-gray flex items-center space-x-1">
                <span className="text-emerald-400 font-bold">{metrics.reservations.confirmed} confirmed</span>
                <span>&bull; {metrics.reservations.confirmationRate}% success</span>
              </div>
            </div>

            {/* Event Inquiries & Conversion */}
            <div className="bg-card-dark border border-border-dark p-5 space-y-2">
              <div className="flex items-center justify-between text-gold">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Event Inquiries
                </span>
                <PartyPopper className="w-4 h-4" />
              </div>
              <div className="font-serif text-3xl font-bold text-warm-ivory">
                {metrics.events.total}
              </div>
              <div className="text-xs text-secondary-gray flex items-center space-x-1">
                <span className="text-emerald-400 font-bold">{metrics.events.confirmed} booked</span>
                <span>&bull; {metrics.events.conversionRate}% conversion</span>
              </div>
            </div>

            {/* Guest Satisfaction Rating */}
            <div className="bg-card-dark border border-border-dark p-5 space-y-2">
              <div className="flex items-center justify-between text-gold">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Guest Satisfaction
                </span>
                <Star className="w-4 h-4" />
              </div>
              <div className="font-serif text-3xl font-bold text-warm-ivory">
                {metrics.feedback.averageRating ? `${metrics.feedback.averageRating} / 5` : 'No reviews'}
              </div>
              <p className="text-xs text-secondary-gray">
                From {metrics.feedback.totalCount} private guest reviews
              </p>
            </div>

            {/* Loyalty Members */}
            <div className="bg-card-dark border border-border-dark p-5 space-y-2">
              <div className="flex items-center justify-between text-gold">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Privilege Members
                </span>
                <Award className="w-4 h-4" />
              </div>
              <div className="font-serif text-3xl font-bold text-warm-ivory">
                {metrics.loyalty.totalMembers}
              </div>
              <p className="text-xs text-secondary-gray">
                {metrics.loyalty.netPoints.toLocaleString()} active points issued
              </p>
            </div>
          </div>

          {/* Pipeline Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Reservation Breakdown */}
            <div className="bg-card-dark border border-border-dark p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-warm-ivory border-b border-border-dark pb-2">
                Table Reservation Status Distribution
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span>Pending Staff Review</span>
                  </span>
                  <span className="font-bold text-warm-ivory">{metrics.reservations.pending}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Confirmed Table Bookings</span>
                  </span>
                  <span className="font-bold text-warm-ivory">{metrics.reservations.confirmed}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span>Completed Visits</span>
                  </span>
                  <span className="font-bold text-warm-ivory">{metrics.reservations.completed}</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-secondary-gray flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span>Cancelled or Rejected</span>
                  </span>
                  <span className="font-bold text-warm-ivory">
                    {metrics.reservations.cancelled + metrics.reservations.rejected}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Pipeline Breakdown */}
            <div className="bg-card-dark border border-border-dark p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-warm-ivory border-b border-border-dark pb-2">
                Celebrations & Event Lead Funnel
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray">New Inquiries</span>
                  <span className="font-bold text-gold">{metrics.events.new}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray">Contacted / In Discussion</span>
                  <span className="font-bold text-warm-ivory">{metrics.events.contacted}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border-dark/60">
                  <span className="text-secondary-gray">Custom Quote Sent</span>
                  <span className="font-bold text-warm-ivory">{metrics.events.quoted}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-secondary-gray">Confirmed Private Bookings</span>
                  <span className="font-bold text-emerald-400">{metrics.events.confirmed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preference Categorization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seating Preferences */}
            <div className="bg-card-dark border border-border-dark p-6 space-y-3">
              <h4 className="font-serif text-sm font-bold text-warm-ivory">Guest Seating Preferences</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(metrics.breakdowns.seating).length === 0 ? (
                  <p className="text-secondary-gray text-[11px] italic">No reservation records in this period.</p>
                ) : (
                  Object.entries(metrics.breakdowns.seating).map(([zone, count]) => (
                    <div key={zone} className="flex justify-between py-1 border-b border-border-dark/60">
                      <span className="text-secondary-gray capitalize">{zone.toLowerCase().replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-warm-ivory">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Event Occasions */}
            <div className="bg-card-dark border border-border-dark p-6 space-y-3">
              <h4 className="font-serif text-sm font-bold text-warm-ivory">Event Occasion Inquiries</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(metrics.breakdowns.eventTypes).length === 0 ? (
                  <p className="text-secondary-gray text-[11px] italic">No event records in this period.</p>
                ) : (
                  Object.entries(metrics.breakdowns.eventTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between py-1 border-b border-border-dark/60">
                      <span className="text-secondary-gray capitalize">{type.toLowerCase().replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-gold">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
