'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  MessageSquare,
  AlertCircle,
  Phone,
  Mail,
  User,
  Users,
} from 'lucide-react';
import { ReservationData, ReservationStatus } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ all: 0, pending: 0, confirmed: 0, rejected: 0, cancelled: 0 });

  // Selected reservation for notes / details modal
  const [selectedRes, setSelectedRes] = useState<ReservationData | null>(null);
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setReservations(data.reservations);
        setTotalPages(data.pagination.totalPages || 1);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus, notes?: string) => {
    setUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          internalNotes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update reservation');
      }

      setFeedback({ type: 'success', message: `Reservation ${data.reservation.reference} marked as ${newStatus}` });
      setSelectedRes(null);
      fetchReservations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating reservation';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-green-950/60 text-green-400 border border-green-700/60">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-yellow-950/60 text-yellow-400 border border-yellow-700/60">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-red-950/60 text-red-400 border border-red-700/60">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-gray-900 text-gray-400 border border-gray-700">
            <Ban className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <CalendarCheck className="w-6 h-6 text-gold" />
            <span>Reservation Requests</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Review guest requests, verify availability, confirm bookings, and manage internal notes.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border border-red-800 text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card-dark border border-border-dark p-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {[
            { label: 'All', value: 'ALL', count: counts.all },
            { label: 'Pending', value: 'PENDING', count: counts.pending },
            { label: 'Confirmed', value: 'CONFIRMED', count: counts.confirmed },
            { label: 'Rejected', value: 'REJECTED', count: counts.rejected },
            { label: 'Cancelled', value: 'CANCELLED', count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
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

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search ref, name, phone..."
            className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-1.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Reservations Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading reservations...
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 text-center space-y-2">
          <Filter className="w-8 h-8 text-secondary-gray mx-auto" />
          <p className="text-sm font-medium text-warm-ivory">No reservations match this filter</p>
          <p className="text-xs text-secondary-gray">Try clearing your search query or choosing another status tab.</p>
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Special Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/60">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-deep-black/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gold">{res.reference}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-warm-ivory">{res.customerName}</div>
                    <div className="text-secondary-gray flex items-center space-x-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gold/60" />
                      <a href={`tel:${res.phone}`} className="hover:underline">{res.phone}</a>
                    </div>
                    {res.email && (
                      <div className="text-secondary-gray/80 flex items-center space-x-1 text-[11px]">
                        <Mail className="w-3 h-3 text-secondary-gray" />
                        <span>{res.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-warm-ivory font-medium">{res.reservationDate}</div>
                    <div className="text-secondary-gray">{res.reservationTime}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-warm-ivory">{res.guestCount}</span> guests
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    {res.specialRequest ? (
                      <p className="text-secondary-gray line-clamp-2 italic">&ldquo;{res.specialRequest}&rdquo;</p>
                    ) : (
                      <span className="text-secondary-gray/50 italic">None</span>
                    )}
                    {res.internalNotes && (
                      <div className="mt-1 text-[10px] bg-gold/10 border border-gold/30 text-gold px-1.5 py-0.5 line-clamp-1">
                        Staff Note: {res.internalNotes}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(res.status)}</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    {res.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(res.id, 'CONFIRMED')}
                          disabled={updating}
                          className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-600 text-emerald-200 hover:bg-emerald-800 text-[10px] uppercase font-bold transition-colors"
                          title="Confirm Table Request"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(res.id, 'REJECTED')}
                          disabled={updating}
                          className="px-2.5 py-1 bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 text-[10px] uppercase font-bold transition-colors"
                          title="Reject Table Request"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRes(res);
                        setNoteText(res.internalNotes || '');
                      }}
                      className="px-2 py-1 bg-deep-black border border-border-dark text-warm-ivory hover:border-gold text-[10px] uppercase font-semibold"
                    >
                      Details & Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-secondary-gray pt-2">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-card-dark border border-border-dark disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-card-dark border border-border-dark disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail / Staff Notes Modal */}
      {selectedRes && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedRes(null)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-lg w-full space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-border-dark pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono">
                  Reservation Reference
                </span>
                <h3 className="font-mono text-xl font-bold text-warm-ivory">
                  {selectedRes.reference}
                </h3>
              </div>
              <div>{getStatusBadge(selectedRes.status)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border-dark/60">
                <span className="text-secondary-gray">Guest Name:</span>
                <span className="text-warm-ivory font-semibold">{selectedRes.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-dark/60">
                <span className="text-secondary-gray">Phone:</span>
                <span className="text-gold font-medium">{selectedRes.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-dark/60">
                <span className="text-secondary-gray">Date & Time:</span>
                <span className="text-warm-ivory font-medium">
                  {selectedRes.reservationDate} at {selectedRes.reservationTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-dark/60">
                <span className="text-secondary-gray">Guests:</span>
                <span className="text-warm-ivory">{selectedRes.guestCount} People</span>
              </div>
              {selectedRes.specialRequest && (
                <div className="py-2">
                  <span className="text-secondary-gray block mb-1">Customer Special Request:</span>
                  <p className="bg-deep-black p-3 border border-border-dark text-warm-ivory italic">
                    {selectedRes.specialRequest}
                  </p>
                </div>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-gold font-semibold flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Internal Staff Notes (Protected from Customer)</span>
              </label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Table 12 allocated. Guest called, confirmed arrival on time."
                className="w-full bg-deep-black border border-border-dark p-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>

            {/* Status Change Buttons in Modal */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-secondary-gray block">Update Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'] as ReservationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedRes.id, st, noteText)}
                    disabled={updating}
                    className={`py-2 text-[10px] uppercase font-bold border transition-colors ${
                      selectedRes.status === st
                        ? 'bg-gold text-deep-black border-gold'
                        : 'bg-deep-black border-border-dark text-secondary-gray hover:text-warm-ivory'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-border-dark">
              <button
                onClick={() => setSelectedRes(null)}
                className="px-4 py-2 bg-deep-black border border-border-dark text-secondary-gray hover:text-warm-ivory text-xs"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusChange(selectedRes.id, selectedRes.status, noteText)}
                disabled={updating}
                className="px-4 py-2 bg-gold text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-gold-light"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
