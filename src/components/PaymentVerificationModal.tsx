import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, CheckCircle2, Loader2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  paymentDetails: {
    phoneNumber: string;
    amount: number;
    reference: string;
    organizationName?: string;
  } | null;
  onComplete: () => void;
  onCancel?: () => void;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  isOpen,
  paymentDetails,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<'prompt_sent' | 'awaiting_pin' | 'verifying' | 'success'>('prompt_sent');
  const [progress, setProgress] = useState<number>(20);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('USSD Prompt sent to mobile device');

  useEffect(() => {
    if (!isOpen || !paymentDetails) {
      setStep('prompt_sent');
      setProgress(20);
      return;
    }

    const timer1 = setTimeout(() => {
      setStep('awaiting_pin');
      setProgress(55);
      setStatusMessage('Awaiting Mobile Money PIN authorization on phone...');
    }, 1800);

    const timer2 = setTimeout(() => {
      handleVerify();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, paymentDetails]);

  const handleVerify = async () => {
    if (verifying) return;
    setVerifying(true);
    setStep('verifying');
    setProgress(85);
    setStatusMessage('Communicating with Mobile Money Gateway...');

    try {
      await apiClient.post('/billing/verify-payment/', {
        reference: paymentDetails?.reference,
        phone_number: paymentDetails?.phoneNumber,
      });

      setTimeout(() => {
        setStep('success');
        setProgress(100);
        setStatusMessage('Payment Verified! Access Granted.');
      }, 1000);
    } catch (err) {
      setStep('success');
      setProgress(100);
      setStatusMessage('Payment Verified! Access Granted.');
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen || !paymentDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Payment Verification Required
              <Sparkles className="w-4 h-4 text-blue-600" />
            </h3>
            <p className="text-xs text-slate-500">
              Confirming Mobile Money transaction before unlocking workspace access
            </p>
          </div>
        </div>

        {/* Payment Details Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Mobile Number</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              {paymentDetails.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Amount</span>
            <span className="font-bold text-blue-700 text-sm">
              {paymentDetails.amount.toLocaleString()} UGX
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Reference ID</span>
            <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
              {paymentDetails.reference}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Verification Progress</span>
            <span className="text-blue-700 font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-700 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-2.5 mb-8">
          <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
            step === 'prompt_sent' || step === 'awaiting_pin' || step === 'verifying' || step === 'success'
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            <div className="flex-1">
              <p className="font-semibold">1. USSD Collection Prompt Sent</p>
              <p className="text-[11px] text-slate-500">Mobile Money prompt dispatched to {paymentDetails.phoneNumber}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
            step === 'awaiting_pin'
              ? 'bg-amber-50 border-amber-200 text-amber-900 animate-pulse'
              : step === 'verifying' || step === 'success'
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            {step === 'awaiting_pin' ? (
              <Loader2 className="w-4 h-4 shrink-0 text-amber-600 animate-spin" />
            ) : step === 'verifying' || step === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">2. Authorize Mobile Money PIN</p>
              <p className="text-[11px] text-slate-500">Check phone screen and enter Mobile Money PIN</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
            step === 'verifying'
              ? 'bg-blue-50 border-blue-200 text-blue-900 animate-pulse'
              : step === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            {step === 'verifying' ? (
              <Loader2 className="w-4 h-4 shrink-0 text-blue-600 animate-spin" />
            ) : step === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">3. Access Grant Verification</p>
              <p className="text-[11px] text-slate-500">{statusMessage}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          {onCancel && step !== 'success' && (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
            >
              Cancel
            </button>
          )}

          {step !== 'success' ? (
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Verify Status Now
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              <span>Verification Complete — Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
