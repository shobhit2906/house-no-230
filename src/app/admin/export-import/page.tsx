'use client';

import React, { useState } from 'react';
import { FileDown, FileUp, Download, Upload, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function AdminExportImportPage() {
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDownloadJson = () => {
    window.open('/api/admin/export?format=json', '_blank');
  };

  const handleDownloadCsv = () => {
    window.open('/api/admin/export?format=csv', '_blank');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setFeedback(null);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(importJson);
      } catch {
        throw new Error('Invalid JSON format. Please ensure valid syntax.');
      }

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import menu data');

      setFeedback({ type: 'success', message: data.message || 'Menu data successfully imported.' });
      setImportJson('');
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error processing import',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-border-dark pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory flex items-center space-x-2.5">
          <FileDown className="w-6 h-6 text-gold" />
          <span>Menu Data Export & Import</span>
        </h1>
        <p className="text-xs text-secondary-gray mt-1">
          Backup current menu records, export CSV for spreadsheet editing, or batch import updated inventories.
        </p>
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

      {/* Export Section */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
          <Download className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">Export Live Menu Data</h2>
        </div>
        <p className="text-xs text-secondary-gray leading-relaxed">
          Download the entire active catalog containing all 17 categories and 145 dishes, prices, dietary classifications, and operational notes.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleDownloadCsv}
            className="px-5 py-2.5 bg-card-dark border border-gold/40 text-gold hover:bg-gold/10 text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download CSV (Excel / Sheets)</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-5 py-2.5 bg-deep-black border border-border-dark text-warm-ivory hover:text-gold hover:border-gold/30 text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Payload</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-card-dark border border-border-dark p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-border-dark pb-3">
          <Upload className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-base font-bold text-warm-ivory">Batch Import Menu JSON</h2>
        </div>
        <p className="text-xs text-secondary-gray leading-relaxed">
          Paste a JSON payload matching the category and item schema to upsert records into the database. Existing items with matching slugs will be safely updated without losing IDs.
        </p>

        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block uppercase tracking-wider text-secondary-gray font-medium">
              JSON Payload
            </label>
            <textarea
              rows={8}
              required
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{ "categories": [ { "name": "Desserts", "slug": "desserts", "items": [...] } ] }'
              className="w-full bg-deep-black border border-border-dark p-3 text-xs text-warm-ivory font-mono focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={importing || !importJson.trim()}
              className="px-6 py-2.5 bg-gold hover:bg-gold-light text-deep-black font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <FileUp className="w-4 h-4" />
              <span>{importing ? 'Processing Import...' : 'Import Menu Data'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
