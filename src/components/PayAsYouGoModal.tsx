import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pay-As-You-Go Campaign Calculator</h3>
              <p className="text-xs text-blue-200 mt-0.5">Real-time breakdown of telecom rates & campaign cost</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Rate Transparency Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Transparent Telco Rate Structure</p>
              <p className="text-blue-700 mt-1 leading-relaxed">
                Zero subscription commitment. Charges are calculated strictly per unique recipient phone number categorized by operator.
              </p>
            </div>
          </div>

          {/* Sliders / Inputs */}
          <div className="space-y-4">
            {/* MTN Input */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <label className="text-sm font-bold text-slate-900">MTN Uganda</label>
                  <span className="text-xs text-slate-500 font-mono">(UGX 40 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  value={mtnRecipients}
                  onChange={(e) => setMtnRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-3 py-1 text-sm border border-slate-300 rounded-lg text-right font-mono font-semibold"
                />
              </div>
            </div>

            {/* Airtel Input */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <label className="text-sm font-bold text-slate-900">Airtel Uganda</label>
                  <span className="text-xs text-slate-500 font-mono">(UGX 40 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  value={airtelRecipients}
                  onChange={(e) => setAirtelRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-3 py-1 text-sm border border-slate-300 rounded-lg text-right font-mono font-semibold"
                />
              </div>
            </div>

            {/* Other Telcos Input */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <label className="text-sm font-bold text-slate-900">Other Operators (Lyca / Others)</label>
                  <span className="text-xs text-slate-500 font-mono">(UGX 50 / SMS)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  value={otherRecipients}
                  onChange={(e) => setOtherRecipients(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-3 py-1 text-sm border border-slate-300 rounded-lg text-right font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Cost Summary Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 shadow-inner">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Total Recipients (Unique)</span>
              <span className="font-mono text-slate-200">{totalRecipients.toLocaleString()} numbers</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Provider Net Cost (Africa's Talking)</span>
              <span className="font-mono text-slate-300">UGX {totalProviderCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Platform Margin</span>
              <span className="font-mono text-emerald-400">+UGX {totalMargin.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="font-bold text-base text-white">Estimated Wallet Deduction</span>
              <span className="text-2xl font-extrabold text-blue-400 font-mono">
                UGX {totalCustomerCharge.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Benefits list */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant Mobile Money Top-Up</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Balance Never Expires</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Automatic Deduplication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Auditable Ledger Logging</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Fund your wallet directly in the dashboard</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            Fund Wallet & Start Campaign <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
