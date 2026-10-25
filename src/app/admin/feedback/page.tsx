'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareText,
  Star,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Tag,
  AlertCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { CustomerFeedbackData, FeedbackStatus } from '@/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<CustomerFeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [counts, setCounts] = useState({ all: 0, new: 0, underReview: 0, resolved: 0 });

  // Modal / Resolution state
  const [selectedEntry, setSelectedEntry] = useState<CustomerFeedbackData | null>(null);
  const [resolveStatus, setResolveStatus] = useState<FeedbackStatus>('NEW');
  const [resolveStaff, setResolveStaff] = useState('');
  const [resolveNotes, setResolveNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/feedback?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setFeedbackList(data.items);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const openResolveModal = (entry: CustomerFeedbackData) => {
    setSelectedEntry(entry);
    setResolveStatus(entry.status);
    setResolveStaff(entry.assignedStaff || '');
    setResolveNotes(entry.internalNotes || '');
  };

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    setUpdating(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEntry.id,
          status: resolveStatus,
          assignedStaff: resolveStaff.trim() || null,
          internalNotes: resolveNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update feedback');

      setFeedbackMsg({ type: 'success', message: `Feedback ${data.item.reference} updated` });
      setSelectedEntry(null);
      fetchFeedback();
    } catch (err: unknown) {
      setFeedbackMsg({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating feedback',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <MessageSquareText className="w-6 h-6 text-gold" />
            <span>Private Guest Feedback & Service Recovery</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Review guest dining ratings, manage service recovery notes, and track resolution.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 text-xs flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border border-red-800 text-red-300'
          }`}
        >
          <span>{feedbackMsg.message}</span>
          <button onClick={() => setFeedbackMsg(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-card-dark border border-border-dark p-3 overflow-x-auto scrollbar-thin">
        {[
          { label: 'All Reviews', value: 'ALL', count: counts.all },
          { label: 'New', value: 'NEW', count: counts.new },
          { label: 'Under Review', value: 'UNDER_REVIEW', count: counts.underReview },
          { label: 'Resolved', value: 'RESOLVED', count: counts.resolved },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-gold text-deep-black font-bold'
                : 'text-secondary-gray hover:text-warm-ivory hover:bg-deep-black/60'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading feedback submissions...
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-secondary-gray mx-auto" />
          <p className="text-sm font-medium text-warm-ivory">No feedback entries under this tab</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((entry) => {
            const whatsAppRecovery = entry.customerPhone
              ? buildWhatsAppLink({
                  phone: entry.customerPhone,
                  type: 'feedback_followup',
                  context: { customerName: entry.customerName || 'Guest' },
                })
              : null;

            return (
              <div
                key={entry.id}
                className="bg-card-dark border border-border-dark p-5 space-y-3 hover:border-gold/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-dark/60 pb-2.5">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-gold">{entry.reference}</span>
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < entry.rating ? 'text-gold fill-gold' : 'text-border-dark'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-deep-black border border-border-dark text-secondary-gray">
                      {entry.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                        entry.status === 'RESOLVED'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700'
                          : entry.status === 'UNDER_REVIEW'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-700'
                          : 'bg-yellow-950/60 text-yellow-400 border-yellow-700'
                      }`}
                    >
                      {entry.status}
                    </span>
                    <span className="text-[11px] text-secondary-gray">
                      {new Date(entry.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-xs text-warm-ivory leading-relaxed bg-deep-black/60 p-3 border border-border-dark/40 italic">
                  &ldquo;{entry.comments}&rdquo;
                </p>

                {/* Meta details & Recovery Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="text-secondary-gray space-x-3">
                    {entry.customerName ? (
                      <span className="text-warm-ivory font-semibold">{entry.customerName}</span>
                    ) : (
                      <span className="italic text-secondary-gray/70">Anonymous Guest</span>
                    )}

                    {entry.customerPhone && (
                      <span className="space-x-1.5 font-mono">
                        <a href={`tel:${entry.customerPhone}`} className="hover:text-gold">
                          {entry.customerPhone}
                        </a>
                        {whatsAppRecovery && (
                          <a
                            href={whatsAppRecovery}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline"
                            title="WhatsApp Service Recovery"
                          >
                            (WhatsApp)
                          </a>
                        )}
                      </span>
                    )}

                    {entry.visitReference && (
                      <span>&bull; Ref: <strong className="text-warm-ivory">{entry.visitReference}</strong></span>
                    )}
                  </div>

                  <button
                    onClick={() => openResolveModal(entry)}
                    className="px-3 py-1 bg-deep-black border border-border-dark hover:border-gold text-xs font-bold text-warm-ivory uppercase"
                  >
                    Service Recovery
                  </button>
                </div>

                {entry.internalNotes && (
                  <div className="mt-2 text-[11px] bg-gold/10 border border-gold/30 text-gold p-2">
                    <strong>Staff Recovery Note:</strong> {entry.internalNotes} (Handled by: {entry.assignedStaff || 'Manager'})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {selectedEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-border-dark pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-gold">Service Recovery</span>
                <h3 className="font-serif text-lg font-bold text-warm-ivory">
                  Feedback {selectedEntry.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-secondary-gray hover:text-warm-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                  Resolution Status
                </label>
                <select
                  value={resolveStatus}
                  onChange={(e) => setResolveStatus(e.target.value as FeedbackStatus)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                >
                  <option value="NEW">New Remark</option>
                  <option value="UNDER_REVIEW">Under Review / In Discussion</option>
                  <option value="RESOLVED">Resolved (Service Recovery Completed)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                  Assigned Staff / Manager
                </label>
                <input
                  type="text"
                  value={resolveStaff}
                  onChange={(e) => setResolveStaff(e.target.value)}
                  placeholder="e.g. General Manager Arvind"
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                  Internal Service Recovery Notes
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="e.g. Contacted patron on phone, offered complimentary dessert voucher on next visit, retrained kitchen on sizzler timing."
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-border-dark">
                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-deep-black border border-border-dark text-secondary-gray hover:text-warm-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-gold hover:bg-gold-light text-deep-black font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
