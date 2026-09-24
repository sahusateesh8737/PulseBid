import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Trophy, ShieldCheck, Download, PackageCheck, CheckCircle2, QrCode } from 'lucide-react';

export const MyWinsPage = () => {
  const [selectedWin, setSelectedWin] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const wonAuctions = [
    {
      id: 'auc_004',
      title: 'Rolex Submariner Date 41mm',
      winningBid: 11200,
      wonAt: '2026-09-24 10:15 AM',
      reservationCode: 'RES-RLX-998231',
      tenantName: 'Vanguard Luxury',
      sku: 'SKU-ROLEX-SUB41',
      lockTxHash: '0x8f9b23a1c70e...41b',
    },
  ];

  const handleClaim = (win) => {
    setSelectedWin(win);
    setClaimSuccess(false);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Trophy className="w-7 h-7 text-brand" /> My Won Inventory Allocations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Auctions you have won with guaranteed PostgreSQL row-level stock reservations.
        </p>
      </div>

      {wonAuctions.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Won Auctions Yet"
          description="Keep placing real-time bids on live auction feeds to win protected inventory releases."
          actionLabel="Browse Live Auctions"
          onAction={() => window.location.href = '/auctions'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {wonAuctions.map((win) => (
            <Card key={win.id} className="p-6 space-y-4 border-brand/40 shadow-yellow-glow w-full">
              <div className="flex items-center justify-between">
                <Badge variant="brand">Auction Winner</Badge>
                <span className="text-xs font-mono text-slate-400">{win.wonAt}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100">{win.title}</h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">Tenant: {win.tenantName}</div>
              </div>

              <div className="p-4 bg-dark-surface rounded-2xl border border-dark-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Winning Price:</span>
                  <span className="font-mono font-extrabold text-brand text-lg">${win.winningBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-dark-border font-mono">
                  <span className="text-slate-400">Reservation Code:</span>
                  <span className="font-bold text-emerald-400">{win.reservationCode}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={PackageCheck}
                  className="flex-1 font-bold"
                  onClick={() => handleClaim(win)}
                >
                  Claim & View Receipt
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Claim & Reservation Receipt Modal */}
      <Modal
        isOpen={!!selectedWin}
        onClose={() => setSelectedWin(null)}
        title="PostgreSQL Reservation Certificate"
      >
        {selectedWin && (
          <div className="space-y-5 text-left font-sans">
            <div className="p-4 bg-dark-surface rounded-2xl border border-emerald-500/40 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
              <h4 className="text-base font-bold text-slate-100">{selectedWin.title}</h4>
              <p className="text-xs font-mono text-emerald-300">
                Transaction Lock Confirmed: {selectedWin.reservationCode}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono border-t border-b border-dark-border py-4">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Winning Amount:</span>
                <span className="font-bold text-brand">${selectedWin.winningBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">SKU Code:</span>
                <span className="text-slate-200">{selectedWin.sku}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tenant Namespace:</span>
                <span className="text-slate-200">{selectedWin.tenantName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lock Transaction Hash:</span>
                <span className="text-slate-400 truncate max-w-[180px]">{selectedWin.lockTxHash}</span>
              </div>
            </div>

            {claimSuccess ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Allocation token claimed successfully! Receipt sent to email.</span>
              </div>
            ) : (
              <Button
                variant="primary"
                className="w-full font-bold"
                icon={QrCode}
                onClick={() => setClaimSuccess(true)}
              >
                Confirm Claim & Generate Pass
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
