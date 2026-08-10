import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PayAsYouGoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface PayAsYouGoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const PayAsYouGoModal: React.FC<PayAsYouGoModalProps> = ({ isOpen, onClose, onGetStarted }) => {
  const [mtnRecipients, setMtnRecipients] = useState<number>(500);
  const [airtelRecipients, setAirtelRecipients] = useState<number>(300);
  const [otherRecipients, setOtherRecipients] = useState<number>(200);

  if (!isOpen) return null;

  // Rate constants (UGX)
  const RATES = {
    mtn: { base: 27, selling: 40, markup: 13 },
    airtel: { base: 25, selling: 40, markup: 15 },
    other: { base: 35, selling: 50, markup: 15 },
  };

  const totalMtnCost = mtnRecipients * RATES.mtn.selling;
  const totalAirtelCost = airtelRecipients * RATES.airtel.selling;
  const totalOtherCost = otherRecipients * RATES.other.selling;

  const totalRecipients = mtnRecipients + airtelRecipients + otherRecipients;
  const totalCustomerCharge = totalMtnCost + totalAirtelCost + totalOtherCost;
  const totalProviderCost =
    mtnRecipients * RATES.mtn.base +
    airtelRecipients * RATES.airtel.base +
    otherRecipients * RATES.other.base;
  const totalMargin = totalCustomerCharge - totalProviderCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <Card className="rounded-[10px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-line p-0 bg-card">
        {/* Modal Header */}
        <div className="p-6 border-b border-line flex items-center justify-between bg-ink text-paper rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-paper/10 border border-line/20 flex items-center justify-center text-primary">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-card">Pay-As-You-Go Campaign Calculator</h3>
              <p className="text-xs text-muted mt-0.5">Real-time breakdown of telecom rates & campaign cost</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-muted hover:text-paper"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-ink">
          {/* Rate Transparency Banner */}
          <div className="p-4 rounded-[10px] bg-paper border border-line text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink">Transparent Telco Rate Structure</p>
              <p className="text-muted mt-1 leading-relaxed">
                No monthly commitment. Charges are calculated strictly per unique recipient phone number categorized by operator.
              </p>
            </div>
          </div>

          {/* Sliders / Inputs */}
          <div className="space-y-4">
            {/* MTN Input */}
            <div className="p-4 bg-paper rounded-[10px] border border-line">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <label className="text-sm font-bold text-ink">MTN Uganda</label>
                  <span className="text-xs text-muted font-mono">(UGX 40 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-primary text-sm">
                  UGX {totalMtnCost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={mtnRecipients}
                  onChange={(e) => setMtnRecipients(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <Input
                  type="number"
                  min="0"
                  value={mtnRecipients}
                  onChange={(e) => setMtnRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 text-right font-mono font-semibold"
                />
              </div>
            </div>

            {/* Airtel Input */}
            <div className="p-4 bg-paper rounded-[10px] border border-line">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-alert"></span>
                  <label className="text-sm font-bold text-ink">Airtel Uganda</label>
                  <span className="text-xs text-muted font-mono">(UGX 40 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-primary text-sm">
                  UGX {totalAirtelCost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={airtelRecipients}
                  onChange={(e) => setAirtelRecipients(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <Input
                  type="number"
                  min="0"
                  value={airtelRecipients}
                  onChange={(e) => setAirtelRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 text-right font-mono font-semibold"
                />
              </div>
            </div>

            {/* Other Telcos Input */}
            <div className="p-4 bg-paper rounded-[10px] border border-line">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-muted"></span>
                  <label className="text-sm font-bold text-ink">Other Operators (Lyca / Others)</label>
                  <span className="text-xs text-muted font-mono">(UGX 50 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-primary text-sm">
                  UGX {totalOtherCost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={otherRecipients}
                  onChange={(e) => setOtherRecipients(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <Input
                  type="number"
                  min="0"
                  value={otherRecipients}
                  onChange={(e) => setOtherRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 text-right font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Cost Summary Box */}
          <div className="bg-ink text-paper rounded-[10px] p-5 space-y-3 shadow-inner font-mono">
            <div className="flex justify-between text-xs text-muted">
              <span>Total Recipients (Unique)</span>
              <span className="text-paper">{totalRecipients.toLocaleString()} numbers</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Provider Net Cost (Africa's Talking)</span>
              <span className="text-paper">UGX {totalProviderCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Platform Margin</span>
              <span className="text-success">+UGX {totalMargin.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-line/20 flex justify-between items-center">
              <span className="font-sans font-bold text-base text-card">Estimated Wallet Deduction</span>
              <span className="text-2xl font-display font-extrabold text-primary">
                UGX {totalCustomerCharge.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Benefits list */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Instant Mobile Money Top-Up</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Balance Never Expires</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Automatic Deduplication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Auditable Ledger Logging</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-line bg-paper rounded-b-[10px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Wallet className="w-4 h-4 text-primary" />
            <span>Fund your wallet directly in the dashboard</span>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="w-full sm:w-auto"
          >
            Fund Wallet & Start Campaign <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
