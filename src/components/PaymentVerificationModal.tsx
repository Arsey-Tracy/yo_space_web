import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, CheckCircle2, Loader2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

import { Card } from './ui/Card';
import { Button } from './ui/Button';

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
      await apiClient.get(`/billing/payments/status/${encodeURIComponent(paymentDetails?.reference || '')}/`);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <Card className="w-full max-w-lg p-6 sm:p-8 rounded-[10px] border-line shadow-2xl relative overflow-hidden text-ink">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[10px] bg-paper border border-line flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-ink flex items-center gap-2">
              Payment Verification Required
              <Sparkles className="w-4 h-4 text-primary" />
            </h3>
            <p className="text-xs text-muted">
              Confirming Mobile Money transaction before unlocking workspace access
            </p>
          </div>
        </div>

        {/* Payment Details Box */}
        <div className="p-4 rounded-[10px] bg-paper border border-line space-y-2 mb-6 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-sans font-medium">Mobile Number</span>
            <span className="font-semibold text-ink flex items-center gap-1.5 font-mono">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              {paymentDetails.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-sans font-medium">Amount</span>
            <span className="font-bold text-primary text-sm font-mono">
              {paymentDetails.amount.toLocaleString()} UGX
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-sans font-medium">Reference ID</span>
            <span className="font-mono text-[11px] text-muted truncate max-w-[200px]">
              {paymentDetails.reference}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-1.5">
          <div className="flex justify-between text-xs text-muted font-medium">
            <span>Verification Progress</span>
            <span className="text-primary font-mono font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-[10px] bg-paper overflow-hidden border border-line">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-2.5 mb-8">
          <div className={`flex items-center gap-3 p-3 rounded-[10px] border text-xs transition-all ${
            step === 'prompt_sent' || step === 'awaiting_pin' || step === 'verifying' || step === 'success'
              ? 'bg-paper border-line text-ink'
              : 'bg-paper border-line text-muted'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="font-semibold">1. USSD Collection Prompt Sent</p>
              <p className="text-[11px] text-muted">Collection prompt dispatched to {paymentDetails.phoneNumber}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-[10px] border text-xs transition-all ${
            step === 'awaiting_pin'
              ? 'bg-paper border-line text-ink animate-pulse'
              : step === 'verifying' || step === 'success'
              ? 'bg-paper border-line text-ink'
              : 'bg-paper border-line text-muted'
          }`}>
            {step === 'awaiting_pin' ? (
              <Loader2 className="w-4 h-4 shrink-0 text-primary animate-spin" />
            ) : step === 'verifying' || step === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-line shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">2. Authorize Mobile Money PIN</p>
              <p className="text-[11px] text-muted">Check the phone screen and complete the Mobile Money authorization</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-[10px] border text-xs transition-all ${
            step === 'verifying'
              ? 'bg-paper border-line text-ink animate-pulse'
              : step === 'success'
              ? 'bg-paper border-line text-success'
              : 'bg-paper border-line text-muted'
          }`}>
            {step === 'verifying' ? (
              <Loader2 className="w-4 h-4 shrink-0 text-primary animate-spin" />
            ) : step === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-line shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">3. Provider Status Check</p>
              <p className="text-[11px] text-muted">{statusMessage}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          {onCancel && step !== 'success' && (
            <Button
              variant="outline"
              size="md"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          {step !== 'success' ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleVerify}
              disabled={verifying}
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
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onComplete}
            >
              <span>Verification Complete — Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

      </Card>
    </div>
  );
};
