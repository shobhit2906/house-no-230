'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode as QrIcon, Table, Check } from 'lucide-react';

interface QrCodeGeneratorProps {
  initialUrl?: string;
}

export default function QrCodeGenerator({ initialUrl }: QrCodeGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState(initialUrl || 'https://www.houseno230.com/qr-menu');
  const [selectedTable, setSelectedTable] = useState<string>('general');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-detect origin in browser if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setBaseUrl(`${origin}/qr-menu`);
    }
  }, []);

  const fullQrUrl = selectedTable === 'general' ? baseUrl : `${baseUrl}?table=${selectedTable}`;

  useEffect(() => {
    QRCode.toDataURL(
      fullQrUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#10100F',
          light: '#F6F1E8',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [fullQrUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullQrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card-dark border border-border-dark p-6 sm:p-8 max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold">
          <QrIcon className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-warm-ivory">
          Printable Table QR Code Generator
        </h3>
        <p className="text-xs text-secondary-gray max-w-md mx-auto">
          Generate high-resolution QR codes linked to the mobile menu. Print table tent cards or download assets for acrylic display stands.
        </p>
      </div>

      {/* Table Selector */}
      <div className="space-y-1.5 text-xs">
        <label className="block uppercase tracking-wider text-secondary-gray font-semibold flex items-center space-x-1.5">
          <Table className="w-3.5 h-3.5 text-gold" />
          <span>Select Table Identifier:</span>
        </label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full bg-deep-black border border-border-dark p-2.5 text-warm-ivory focus:border-gold focus:outline-none text-xs"
        >
          <option value="general">General / Bar Counter (No Table Specified)</option>
          {Array.from({ length: 20 }, (_, i) => `T${i + 1}`).map((tbl) => (
            <option key={tbl} value={tbl}>
              Table {tbl} (Indoor / Garden Seating)
            </option>
          ))}
        </select>
      </div>

      {/* Target URL Preview */}
      <div className="p-3 bg-deep-black border border-border-dark text-xs flex items-center justify-between font-mono text-gold-light truncate">
        <span className="truncate pr-2">{fullQrUrl}</span>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 bg-card-dark border border-border-dark hover:border-gold text-[10px] uppercase font-sans font-bold text-warm-ivory flex-shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : 'Copy Link'}
        </button>
      </div>

      {/* Printable Card Preview */}
      <div
        id="printable-qr-card"
        className="p-8 bg-warm-ivory text-deep-black border-2 border-gold/60 max-w-xs mx-auto text-center space-y-4 shadow-2xl rounded-none"
      >
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8A7142] block">
            HOUSE NO. 230
          </span>
          <h4 className="font-serif text-lg font-bold tracking-wider leading-tight">
            THE GOURMET KITCHEN & BAR
          </h4>
          <p className="text-[10px] uppercase tracking-widest text-[#555] font-semibold">
            Bhopal &bull; Kerwa Dam Road
          </p>
        </div>

        {qrDataUrl && (
          <div className="p-2 bg-white inline-block border border-[#DDD] shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR Code for House No. 230 Menu ${selectedTable !== 'general' ? `Table ${selectedTable}` : ''}`}
              className="w-48 h-48 mx-auto"
            />
          </div>
        )}

        <div className="space-y-1 pt-1 border-t border-[#DDD]">
          {selectedTable !== 'general' && (
            <span className="inline-block px-3 py-0.5 bg-[#171715] text-[#F6F1E8] font-mono text-xs font-bold tracking-widest">
              TABLE {selectedTable}
            </span>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#171715] pt-1">
            Scan To Browse Digital Menu
          </p>
          <p className="text-[9px] text-[#777]">
            Wi-Fi or Mobile Data &bull; No App Download Required
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold flex items-center space-x-2 transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print Table Card</span>
        </button>

        {qrDataUrl && (
          <a
            href={qrDataUrl}
            download={`house-no-230-qr-${selectedTable}.png`}
            className="px-5 py-2.5 bg-deep-black border border-border-dark hover:border-gold text-warm-ivory hover:text-gold text-xs uppercase tracking-widest font-bold flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </a>
        )}
      </div>
    </div>
  );
}
