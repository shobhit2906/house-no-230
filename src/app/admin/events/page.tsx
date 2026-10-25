'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PartyPopper,
  Search,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  X,
  AlertCircle,
} from 'lucide-react';
import { EventLeadData, EventLeadStatus } from '@/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AdminEventsPage() {
  const [leads, setLeads] = useState<EventLeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({
    all: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    quoted: 0,
    confirmed: 0,
    lost: 0,
    closed: 0,
  });

  // Modal / update state
  const [selectedLead, setSelectedLead] = useState<EventLeadData | null>(null);
  const [editStatus, setEditStatus] = useState<EventLeadStatus>('NEW');
  const [editStaff, setEditStaff] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editQuote, setEditQuote] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setLeads(data.leads);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load event leads:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const openEditModal = (lead: EventLeadData) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditStaff(lead.assignedStaff || '');
    setEditNotes(lead.internalNotes || '');
    setEditQuote(lead.quotedAmount !== null ? lead.quotedAmount.toString() : '');
    setEditFollowUp(lead.nextFollowUpDate || '');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          status: editStatus,
          assignedStaff: editStaff.trim() || null,
          internalNotes: editNotes.trim() || null,
          quotedAmount: editQuote.trim() !== '' ? parseFloat(editQuote) : null,
          nextFollowUpDate: editFollowUp.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead');

      setFeedback({ type: 'success', message: `Lead ${data.lead.reference} updated successfully` });
      setSelectedLead(null);
      fetchLeads();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating lead',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: EventLeadStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-green-950/70 text-green-300 border border-green-700">
            Confirmed
          </span>
        );
      case 'NEW':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-gold/20 text-gold border border-gold/40">
            New Lead
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-blue-950/70 text-blue-300 border border-blue-700">
            Contacted
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-950/70 text-purple-300 border border-purple-700">
            Qualified
          </span>
        );
      case 'QUOTED':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-yellow-950/70 text-yellow-300 border border-yellow-700">
            Quoted
          </span>
        );
      case 'LOST':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-red-950/70 text-red-400 border border-red-800">
            Lost
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-gray-900 text-gray-400 border border-border-dark">
            Closed
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
            <PartyPopper className="w-6 h-6 text-gold" />
            <span>Celebration & Event Leads</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Track inquiries, assign banquet staff, record quotes, set follow-up reminders, and track event conversions.
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
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {[
            { label: 'All', value: 'ALL', count: counts.all },
            { label: 'New', value: 'NEW', count: counts.new },
            { label: 'Contacted', value: 'CONTACTED', count: counts.contacted },
            { label: 'Quoted', value: 'QUOTED', count: counts.quoted },
            { label: 'Confirmed', value: 'CONFIRMED', count: counts.confirmed },
            { label: 'Lost / Closed', value: 'CLOSED', count: counts.closed + counts.lost },
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

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search host, phone, ref..."
            className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-1.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading event inquiries...
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 text-center space-y-2">
          <PartyPopper className="w-8 h-8 text-secondary-gray mx-auto" />
          <p className="text-sm font-medium text-warm-ivory">No event inquiries match this filter</p>
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Host / Contact</th>
                <th className="py-3 px-4">Occasion & Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Quote (INR)</th>
                <th className="py-3 px-4">Follow-up</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/60">
              {leads.map((lead) => {
                const whatsAppFollowUp = buildWhatsAppLink({
                  phone: lead.phone,
                  type: 'event',
                  context: {
                    reference: lead.reference,
                    customerName: lead.customerName,
                    date: lead.eventDate,
                    eventType: lead.eventType,
                    guests: lead.guestCount,
                  },
                });

                return (
                  <tr key={lead.id} className="hover:bg-deep-black/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gold">{lead.reference}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-warm-ivory">{lead.customerName}</div>
                      <div className="text-secondary-gray flex items-center space-x-1.5 mt-0.5">
                        <a href={`tel:${lead.phone}`} className="hover:text-gold flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gold/60" />
                          <span>{lead.phone}</span>
                        </a>
                        <a
                          href={whatsAppFollowUp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline pl-1"
                          title="Open WhatsApp Follow-up Chat"
                        >
                          <MessageSquare className="w-3 h-3 inline" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-warm-ivory font-medium capitalize">
                        {lead.eventType.toLowerCase().replace('_', ' ')}
                      </div>
                      <div className="text-secondary-gray text-[11px]">{lead.eventDate}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-warm-ivory">{lead.guestCount}</span> guests
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      {lead.quotedAmount !== null ? (
                        <span className="text-gold font-bold">₹{lead.quotedAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-secondary-gray italic text-[11px]">Pending Quote</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {lead.nextFollowUpDate ? (
                        <span className="text-warm-ivory text-[11px]">{lead.nextFollowUpDate}</span>
                      ) : (
                        <span className="text-secondary-gray/50 italic text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(lead.status)}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(lead)}
                        className="px-2.5 py-1 bg-deep-black border border-border-dark text-warm-ivory hover:border-gold hover:text-gold text-[10px] uppercase font-bold"
                      >
                        Manage & Quote
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Quote Modal */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-border-dark pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono">
                  Event Inquiry
                </span>
                <h3 className="font-serif text-xl font-bold text-warm-ivory">
                  {selectedLead.reference} &bull; {selectedLead.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-secondary-gray hover:text-warm-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-only requirements summary */}
            <div className="p-3 bg-deep-black border border-border-dark space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-secondary-gray">Event Type:</span>
                <span className="text-warm-ivory font-medium capitalize">
                  {selectedLead.eventType.toLowerCase().replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">Target Date:</span>
                <span className="text-warm-ivory">{selectedLead.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">Guests:</span>
                <span className="text-warm-ivory font-bold">{selectedLead.guestCount} People</span>
              </div>
              {selectedLead.budgetRange && (
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Host Budget:</span>
                  <span className="text-gold">{selectedLead.budgetRange}</span>
                </div>
              )}
              {selectedLead.decorationRequirements && (
                <div className="pt-1 border-t border-border-dark/60">
                  <span className="text-secondary-gray block text-[10px] uppercase">Decor Requests:</span>
                  <p className="text-warm-ivory italic">{selectedLead.decorationRequirements}</p>
                </div>
              )}
              {selectedLead.notes && (
                <div className="pt-1 border-t border-border-dark/60">
                  <span className="text-secondary-gray block text-[10px] uppercase">Host Notes:</span>
                  <p className="text-warm-ivory italic">{selectedLead.notes}</p>
                </div>
              )}
            </div>

            {/* Editable Staff Form */}
            <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                    Pipeline Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as EventLeadStatus)}
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  >
                    <option value="NEW">New Inquiry</option>
                    <option value="CONTACTED">Contacted Host</option>
                    <option value="QUALIFIED">Qualified Requirements</option>
                    <option value="QUOTED">Quotation Sent</option>
                    <option value="CONFIRMED">Confirmed & Booked</option>
                    <option value="LOST">Lost to Other Venue</option>
                    <option value="CLOSED">Closed Archive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                    Assigned Staff Member
                  </label>
                  <input
                    type="text"
                    value={editStaff}
                    onChange={(e) => setEditStaff(e.target.value)}
                    placeholder="e.g. Banquet Host Rahul"
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                    Quoted Package Amount (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={editQuote}
                    onChange={(e) => setEditQuote(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory font-mono focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={editFollowUp}
                    onChange={(e) => setEditFollowUp(e.target.value)}
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider text-secondary-gray font-semibold">
                  Private Internal Notes (Protected from Customer)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Called host on Oct 25; proposed 3-course multi-cuisine buffet @ ₹1,400/head. Awaiting deposit."
                  className="w-full bg-deep-black border border-border-dark p-2.5 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-border-dark">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-deep-black border border-border-dark text-secondary-gray hover:text-warm-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-gold hover:bg-gold-light text-deep-black font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Lead Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
