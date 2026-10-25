'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, Gift, History, UserCheck, ShieldAlert, Sparkles, CheckCircle2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  totalPoints: number;
  totalVisits: number;
  createdAt: string;
}

interface Reward {
  id: string;
  title: string;
  description: string | null;
  pointsRequired: number;
  active: boolean;
}

interface Transaction {
  id: string;
  points: number;
  actionType: string;
  description: string;
  referenceCode: string | null;
  createdAt: string;
  customer?: {
    name: string;
    phone: string;
  };
}

export default function AdminLoyaltyPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals / forms
  const [activeCustomer, setActiveCustomer] = useState<Member | null>(null);
  const [actionType, setActionType] = useState<'VISIT_STAMP' | 'REWARD_REDEMPTION' | 'MANUAL_ADJUSTMENT'>('VISIT_STAMP');
  const [stampPoints, setStampPoints] = useState(50);
  const [selectedRewardId, setSelectedRewardId] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // New reward creation modal
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardPoints, setRewardPoints] = useState(100);
  const [submittingReward, setSubmittingReward] = useState(false);

  const fetchLoyaltyData = async (query = '') => {
    try {
      setLoading(true);
      const url = query ? `/api/admin/loyalty?q=${encodeURIComponent(query)}` : '/api/admin/loyalty';
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setRewards(data.rewards || []);
        setTransactions(data.recentTransactions || []);
      }
    } catch (err) {
      console.error('Failed to load loyalty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLoyaltyData(searchQuery);
  };

  const handleExecuteTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;
    setSubmittingAction(true);
    setMessage(null);

    let pointsToSend = stampPoints;
    let descriptionToSend = transactionNote || 'Dining visit stamp';

    if (actionType === 'REWARD_REDEMPTION') {
      const selectedReward = rewards.find((r) => r.id === selectedRewardId);
      if (!selectedReward) {
        setMessage({ type: 'error', text: 'Please select a reward to redeem' });
        setSubmittingAction(false);
        return;
      }
      pointsToSend = selectedReward.pointsRequired;
      descriptionToSend = `Redeemed: ${selectedReward.title}`;
    }

    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: activeCustomer.id,
          actionType,
          points: pointsToSend,
          description: descriptionToSend,
          referenceCode: `TX-${Date.now().toString(36).toUpperCase()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record transaction');

      setMessage({ type: 'success', text: `Transaction recorded! New balance for ${activeCustomer.name}: ${data.customer.totalPoints} pts` });
      setActiveCustomer(null);
      setTransactionNote('');
      fetchLoyaltyData(searchQuery);
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error processing transaction' });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReward(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CREATE_REWARD',
          reward: {
            title: rewardTitle,
            description: rewardDesc || null,
            pointsRequired: rewardPoints,
            active: true,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create reward');

      setMessage({ type: 'success', text: `Reward "${rewardTitle}" created successfully.` });
      setShowRewardModal(false);
      setRewardTitle('');
      setRewardDesc('');
      setRewardPoints(100);
      fetchLoyaltyData(searchQuery);
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error creating reward' });
    } finally {
      setSubmittingReward(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-gold" />
            <span>House 230 Connoisseur Club</span>
          </h1>
          <p className="text-xs text-secondary-gray mt-1">
            Auditable digital loyalty ledger, customer point stamps, and reward fulfillment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRewardModal(true)}
            className="px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1.5"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Add Reward Tier</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border border-red-800 text-red-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-dark border border-border-dark p-4">
          <span className="text-[10px] uppercase tracking-wider text-secondary-gray">Active Members</span>
          <div className="text-2xl font-serif font-bold text-warm-ivory mt-1">{members.length}</div>
          <span className="text-[10px] text-gold mt-1 block">Enrolled patrons</span>
        </div>

        <div className="bg-card-dark border border-border-dark p-4">
          <span className="text-[10px] uppercase tracking-wider text-secondary-gray">Active Reward Catalog</span>
          <div className="text-2xl font-serif font-bold text-warm-ivory mt-1">{rewards.length}</div>
          <span className="text-[10px] text-secondary-gray mt-1 block">Tasting flights, desserts & treats</span>
        </div>

        <div className="bg-card-dark border border-border-dark p-4">
          <span className="text-[10px] uppercase tracking-wider text-secondary-gray">Recent Ledger Events</span>
          <div className="text-2xl font-serif font-bold text-warm-ivory mt-1">{transactions.length}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Audited staff adjustments</span>
        </div>
      </div>

      {/* Member Directory */}
      <div className="bg-card-dark border border-border-dark">
        <div className="p-4 border-b border-border-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-sm font-semibold text-warm-ivory">Patron Directory</h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-secondary-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-deep-black border border-border-dark pl-9 pr-3 py-1.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider transition-colors border border-gold/30"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-dark text-[10px] uppercase tracking-wider text-secondary-gray bg-deep-black/40">
                <th className="p-3">Member</th>
                <th className="p-3">Phone</th>
                <th className="p-3 text-right">Balance</th>
                <th className="p-3 text-right">Visits</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">Staff Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark text-warm-ivory">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-gold animate-pulse">
                    Loading loyalty members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-secondary-gray">
                    No loyalty members found. Guests can join directly at <span className="text-gold">/loyalty</span>.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-deep-black/30 transition-colors">
                    <td className="p-3 font-medium text-warm-ivory">
                      {member.name}
                      {member.email && <div className="text-[10px] text-secondary-gray">{member.email}</div>}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-secondary-gray">{member.phone}</td>
                    <td className="p-3 text-right font-serif font-bold text-gold text-sm">
                      {member.totalPoints} <span className="text-[10px] font-sans font-normal text-secondary-gray">pts</span>
                    </td>
                    <td className="p-3 text-right text-xs text-warm-ivory">{member.totalVisits}</td>
                    <td className="p-3 text-secondary-gray text-[11px]">
                      {new Date(member.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveCustomer(member);
                          setActionType('VISIT_STAMP');
                          setStampPoints(50);
                        }}
                        className="px-2.5 py-1 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 text-[10px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Stamp Visit</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveCustomer(member);
                          setActionType('REWARD_REDEMPTION');
                          if (rewards.length > 0) setSelectedRewardId(rewards[0].id);
                        }}
                        className="px-2.5 py-1 bg-deep-black hover:bg-charcoal text-warm-ivory border border-border-dark text-[10px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                      >
                        <Gift className="w-3 h-3 text-gold" />
                        <span>Redeem</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rewards Catalog & Recent Ledger Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards Catalog */}
        <div className="bg-card-dark border border-border-dark p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-dark pb-3">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-gold" />
              <h2 className="font-serif text-sm font-semibold text-warm-ivory">Active Reward Catalog</h2>
            </div>
            <button
              onClick={() => setShowRewardModal(true)}
              className="text-[11px] text-gold hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Create New</span>
            </button>
          </div>

          <div className="space-y-3">
            {rewards.length === 0 ? (
              <p className="text-xs text-secondary-gray py-4 text-center">No rewards created yet.</p>
            ) : (
              rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-3 bg-deep-black/50 border border-border-dark flex items-start justify-between gap-3"
                >
                  <div>
                    <h3 className="text-xs font-semibold text-warm-ivory">{reward.title}</h3>
                    {reward.description && (
                      <p className="text-[11px] text-secondary-gray mt-0.5">{reward.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-serif font-bold text-gold text-sm">{reward.pointsRequired}</span>
                    <span className="text-[10px] text-secondary-gray block">points</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Transaction Ledger */}
        <div className="bg-card-dark border border-border-dark p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
            <History className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-sm font-semibold text-warm-ivory">Recent Ledger Transactions</h2>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <p className="text-xs text-secondary-gray py-4 text-center">No transactions recorded yet.</p>
            ) : (
              transactions.map((tx) => {
                const isPositive = tx.points > 0;
                return (
                  <div
                    key={tx.id}
                    className="p-3 bg-deep-black/50 border border-border-dark flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-warm-ivory">{tx.customer?.name || 'Customer'}</span>
                        <span className="text-[10px] font-mono text-secondary-gray">({tx.customer?.phone || ''})</span>
                      </div>
                      <p className="text-[11px] text-secondary-gray">{tx.description}</p>
                      <span className="text-[9px] text-secondary-gray font-mono block">
                        {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })},{' '}
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <div className="text-right flex items-center space-x-1.5 flex-shrink-0">
                      {isPositive ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <span
                        className={`font-serif font-bold text-sm ${
                          isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? `+${tx.points}` : tx.points} pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Transaction Modal (Visit Stamp or Reward Redemption) */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/80 backdrop-blur-sm p-4">
          <div className="bg-card-dark border border-gold/40 p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-dark pb-3">
              <h3 className="font-serif text-lg font-bold text-warm-ivory flex items-center space-x-2">
                <Award className="w-5 h-5 text-gold" />
                <span>Loyalty Action: {activeCustomer.name}</span>
              </h3>
              <button
                onClick={() => setActiveCustomer(null)}
                className="text-secondary-gray hover:text-warm-ivory text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-deep-black/60 border border-border-dark text-xs flex justify-between items-center">
              <div>
                <span className="text-secondary-gray block text-[10px] uppercase">Current Balance</span>
                <span className="font-serif font-bold text-gold text-lg">{activeCustomer.totalPoints} pts</span>
              </div>
              <div className="text-right">
                <span className="text-secondary-gray block text-[10px] uppercase">Total Visits</span>
                <span className="font-serif font-bold text-warm-ivory text-lg">{activeCustomer.totalVisits}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteTransaction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionType('VISIT_STAMP')}
                    className={`p-2 text-center text-xs font-semibold border transition-colors ${
                      actionType === 'VISIT_STAMP'
                        ? 'bg-gold/15 border-gold text-gold'
                        : 'bg-deep-black border-border-dark text-secondary-gray'
                    }`}
                  >
                    Stamp Visit (+Pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionType('REWARD_REDEMPTION');
                      if (rewards.length > 0 && !selectedRewardId) setSelectedRewardId(rewards[0].id);
                    }}
                    className={`p-2 text-center text-xs font-semibold border transition-colors ${
                      actionType === 'REWARD_REDEMPTION'
                        ? 'bg-gold/15 border-gold text-gold'
                        : 'bg-deep-black border-border-dark text-secondary-gray'
                    }`}
                  >
                    Redeem Reward (-Pts)
                  </button>
                </div>
              </div>

              {actionType === 'VISIT_STAMP' ? (
                <div className="space-y-1">
                  <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">
                    Points to Award
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={stampPoints}
                    onChange={(e) => setStampPoints(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  />
                  <p className="text-[10px] text-secondary-gray">Standard dining visit is 50 points.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">
                    Select Reward to Redeem
                  </label>
                  <select
                    value={selectedRewardId}
                    onChange={(e) => setSelectedRewardId(e.target.value)}
                    className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                  >
                    {rewards.map((r) => {
                      const canAfford = activeCustomer.totalPoints >= r.pointsRequired;
                      return (
                        <option key={r.id} value={r.id} disabled={!canAfford}>
                          {r.title} ({r.pointsRequired} pts){!canAfford ? ' - Insufficient Balance' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">
                  Internal Staff Note (Audited)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 4 dinner stamp or birthday gift voucher"
                  value={transactionNote}
                  onChange={(e) => setTransactionNote(e.target.value)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCustomer(null)}
                  className="px-4 py-2 border border-border-dark text-secondary-gray hover:text-warm-ivory text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="px-5 py-2 bg-gold hover:bg-gold-light text-deep-black font-semibold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {submittingAction ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/80 backdrop-blur-sm p-4">
          <div className="bg-card-dark border border-gold/40 p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-dark pb-3">
              <h3 className="font-serif text-lg font-bold text-warm-ivory flex items-center space-x-2">
                <Gift className="w-5 h-5 text-gold" />
                <span>Create New Reward</span>
              </h3>
              <button
                onClick={() => setShowRewardModal(false)}
                className="text-secondary-gray hover:text-warm-ivory text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">Reward Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complimentary Chef Dessert"
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">Points Required</label>
                <input
                  type="number"
                  min={10}
                  step={5}
                  required
                  value={rewardPoints}
                  onChange={(e) => setRewardPoints(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-secondary-gray uppercase text-[10px] tracking-wider">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Any signature dessert from our pastry selection on your next dining visit."
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  className="w-full bg-deep-black border border-border-dark p-2 text-warm-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="px-4 py-2 border border-border-dark text-secondary-gray hover:text-warm-ivory text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReward}
                  className="px-5 py-2 bg-gold hover:bg-gold-light text-deep-black font-semibold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {submittingReward ? 'Saving...' : 'Create Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
