'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, User, Filter } from 'lucide-react';

interface AuditEntry {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/audit?limit=100');
        const data = await res.json();
        if (res.ok) setLogs(data.logs);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-border-dark pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
          <History className="w-6 h-6 text-gold" />
          <span>Security & Activity Audit Log</span>
        </h1>
        <p className="text-xs text-secondary-gray mt-1">
          Immutable log of staff sign-ins, menu modifications, status transitions, and data operations.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-gold animate-pulse">
          Loading audit entries...
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 text-center space-y-2">
          <Shield className="w-8 h-8 text-secondary-gray mx-auto" />
          <p className="text-sm font-medium text-warm-ivory">No activity recorded yet</p>
        </div>
      ) : (
        <div className="bg-card-dark border border-border-dark overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep-black border-b border-border-dark uppercase tracking-wider text-secondary-gray">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-deep-black/40 transition-colors">
                  <td className="py-3 px-4 text-secondary-gray whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </td>
                  <td className="py-3 px-4 text-warm-ivory font-medium">
                    {log.actorEmail || 'System / Automated'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-gold/15 text-gold border border-gold/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-gray">{log.entityType}</td>
                  <td className="py-3 px-4 text-secondary-gray font-sans text-xs max-w-xs truncate">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
