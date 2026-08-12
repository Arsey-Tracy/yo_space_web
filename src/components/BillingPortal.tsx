import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { SMSBundle } from '../types';
import { Sparkles, Phone, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { PaymentVerificationModal } from './PaymentVerificationModal';

import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const BillingPortal: React.FC = () => {
  const { organization, refreshOrg } = useAuth();
  // Subscription plans state removed for pay‑as‑you‑go model
  const [bundles, setBundles] = useState<SMSBundle[]>([]);
  
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<SMSBundle | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBillingData = async () => {
    try {
      const walletPromise = apiClient.get('/billing/current/').catch(async (err: any) => {
        if (err.response?.status === 404) {
          return apiClient.get('/billing/wallet/balance/');
        }
        throw err;
      });

      const [walletRes, bundlesRes] = await Promise.all([
        walletPromise,
        apiClient.get<SMSBundle[]>('/billing/sms-bundles/'),
      ]);

      const bList = Array.isArray(bundlesRes.data) ? bundlesRes.data : (bundlesRes.data as any)?.results || [];
      setBundles(bList);
      if (bList.length > 0) {
        setSelectedBundle(bList[0]);
      }
      if (walletRes?.data) {
        refreshOrg();
      }
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: 'Unable to load billing data at this time. Please try again later.' });
      setBundles([]);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handlePurchaseBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const normalizedAmount = Number(customAmount);
    const hasCustomAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0;
    const hasBundle = !!selectedBundle;

    if (!hasCustomAmount && !hasBundle) {
      setMsg({ type: 'error', text: 'Please select a bundle or enter a custom top-up amount.' });
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, any> = {
        payment_method: 'mobile_money',
        phone_number: momoPhone.trim().replace(/^\+/, ''),
        external_id: `yo-space-${organization?.id ?? 'anon'}-${selectedBundle?.id ?? 'custom'}-${Date.now()}`,
      };

      if (hasCustomAmount) {
        payload.amount = normalizedAmount;
      } else if (selectedBundle) {
        payload.bundle_id = selectedBundle.id;
      }

      const res = await apiClient.post('/billing/sms-bundles/purchase/', payload);

      const providerStatus = res.data?.provider?.status || 'Pending';
      setMsg({
        type: 'success',
        text: `Payment collection started. Provider status: ${providerStatus}. Credits will be applied after confirmation.`,
      });
      setIsTopUpOpen(false);
      setCustomAmount('');
      setUseCustomAmount(false);
      refreshOrg();
      fetchBillingData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to process mobile money purchase.' });
    } finally {
      setLoading(false);
    }
  };

  const [verificationModal, setVerificationModal] = useState<{
    phoneNumber: string;
    amount: number;
    reference: string;
    organizationName?: string;
  } | null>(null);

  const handleInitiateCollection = async () => {
    if (!momoPhone) {
      setMsg({ type: 'error', text: 'Please enter a Mobile Money phone number to start the payment collection.' });
      return;
    }

    const normalizedAmount = Number(customAmount);
    const hasCustomAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0;
    const hasBundle = !!selectedBundle;

    if (!hasCustomAmount && !hasBundle) {
      setMsg({ type: 'error', text: 'Please select a bundle or enter a custom top-up amount.' });
      return;
    }

    setMsg(null);
    setLoading(true);
    try {
      // Clean phone number (remove leading '+' and whitespace)
      const cleanPhone = momoPhone.trim().replace(/^\+/, '');

      // Build payload according to backend expectations
      const payload: Record<string, any> = {
        // Use backend enum for payment method
        payment_method: 'mobile_money',
        phone_number: cleanPhone,
        external_id: `yo-space-${organization?.id ?? 'anon'}-${selectedBundle?.id ?? 'custom'}-${Date.now()}`,
      };

      if (hasCustomAmount) {
        // Backend expects 'amount' for a custom top‑up
        payload.amount = normalizedAmount;
      } else if (selectedBundle) {
        payload.bundle_id = selectedBundle.id;
      }

      const res = await apiClient.post('/billing/sms-bundles/purchase/', payload);
      const providerStatus = res.data?.provider?.status || 'Pending';
      const externalId = res.data?.provider?.externalId || res.data?.purchase?.payment_reference || 'pending';
      setVerificationModal({
        phoneNumber: cleanPhone,
        amount: hasCustomAmount ? normalizedAmount : Number(selectedBundle?.price || 0),
        reference: externalId,
        organizationName: organization?.name,
      });
      setMsg({ type: 'success', text: `Collection initiated. Provider status: ${providerStatus}.` });
      setIsTopUpOpen(false);
      setCustomAmount('');
      setUseCustomAmount(false);
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err.response?.data?.detail || err.response?.data?.message || 'Failed to initiate ioTec collection.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-ink">
      
      {/* Notifications */}
      {msg && (
        <div className={`p-4 rounded-[10px] text-xs flex items-center justify-between gap-3 ${
          msg.type === 'success' ? 'bg-paper border border-line text-success' : 'bg-paper border border-line text-alert'
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-alert" />}
            <span className="font-medium">{msg.text}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMsg(null)} aria-label="Close notification">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Current Plan & SMS Credit Summary Banner */}
      <Card className="p-6 sm:p-8 rounded-[10px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-line shadow-xs">
        <div>
          <span className="px-2.5 py-1 rounded-[10px] bg-paper text-primary text-[11px] font-semibold border border-line">
            Pay-As-You-Go Model (Zero Expiring Credits)
          </span>
          <h2 className="text-2xl font-display font-extrabold text-ink mt-2">Prepaid Wallet & SMS Balance</h2>
          <p className="text-xs text-muted mt-1">
            Current Balance: <span className="text-primary font-mono font-bold">{organization?.sms_balance.toLocaleString()} SMS credits</span> (~UGX <span className="font-mono">{((organization?.sms_balance ?? 0) * 40).toLocaleString()}</span> value)
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsTopUpOpen(true)}
          className="shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Top Up Wallet (Mobile Money)
        </Button>
      </Card>

      {/* Pay-As-You-Go SMS Top-Up Bundles Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-display font-bold text-ink">Pay-As-You-Go Top-Up Packs</h3>
          <p className="text-xs text-muted">Top up credits anytime via MTN Mobile Money or Airtel Money. All rates calculated transparently from final selling prices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(bundles) ? bundles : []).map((b) => (
            <Card key={b.id} className="p-5 rounded-[10px] border-line flex flex-col justify-between hover:border-primary transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-sm">{b.name}</span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-paper border border-line px-2 py-0.5 rounded-[10px]">
                    UGX {Number(b.price_per_sms).toFixed(0)}/SMS
                  </span>
                </div>
                <p className="text-2xl font-display font-extrabold text-primary mt-2 font-mono">{b.sms_count.toLocaleString()} SMS</p>
                <p className="text-xs text-muted font-mono font-semibold mt-1">UGX {Number(b.price).toLocaleString()}</p>
              </div>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => {
                  setSelectedBundle(b);
                  setIsTopUpOpen(true);
                }}
                className="mt-4"
              >
                Buy Pack
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* SMS Top-Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 rounded-[10px] border-line shadow-2xl relative space-y-4 text-ink">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTopUpOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink p-1 rounded-[10px]"
              aria-label="Close top up modal"
            >
              <X className="w-5 h-5" />
            </Button>

            <h3 className="text-lg font-display font-bold text-ink">Top Up SMS Credits</h3>
            <p className="text-xs text-muted">Instant Mobile Money payment (MTN / Airtel Uganda)</p>

            <form onSubmit={handlePurchaseBundle} className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1">Select Bundle</label>
                <select
                  value={selectedBundle?.id ?? ''}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    if (nextValue === 'custom') {
                      setSelectedBundle(null);
                      setUseCustomAmount(true);
                    } else {
                      const b = bundles.find((item) => item.id === Number(nextValue));
                      if (b) {
                        setSelectedBundle(b);
                        setUseCustomAmount(false);
                      }
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-paper border border-line text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Choose a bundle</option>
                  {(Array.isArray(bundles) ? bundles : []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.sms_count.toLocaleString()} SMS (UGX {Number(b.price).toLocaleString()})
                    </option>
                  ))}
                  <option value="custom">Custom amount</option>
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Custom Amount (UGX)</label>
                <Input
                  type="number"
                  min="1000"
                  step="100"
                  placeholder="e.g. 5000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) {
                      setUseCustomAmount(true);
                    }
                  }}
                  className="font-mono"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Mobile Money Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-3 pointer-events-none" />
                  <Input
                    type="text"
                    required
                    placeholder="e.g. +256770000000"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    className="pl-9 font-mono"
                  />
                </div>
              </div>

              {(selectedBundle || useCustomAmount) && (
                <div className="p-3 rounded-[10px] bg-paper border border-line text-[11px] text-ink space-y-1 font-mono">
                  {selectedBundle && (
                    <div className="flex items-center justify-between">
                      <span>Bundle:</span>
                      <span className="font-bold text-ink">{selectedBundle.name} ({selectedBundle.sms_count} SMS)</span>
                    </div>
                  )}
                  {useCustomAmount && customAmount && (
                    <div className="flex items-center justify-between">
                      <span>Custom Amount:</span>
                      <span className="font-bold text-primary">UGX {Number(customAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-primary">
                      UGX {(useCustomAmount && customAmount ? Number(customAmount) : Number(selectedBundle?.price || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  fullWidth
                  size="md"
                >
                  {loading ? 'Processing Mobile Money...' : `Pay UGX ${(useCustomAmount && customAmount ? Number(customAmount) : Number(selectedBundle?.price || 0)).toLocaleString()}`}
                </Button>

                <Button
                  type="button"
                  onClick={handleInitiateCollection}
                  disabled={loading}
                  variant="outline"
                  fullWidth
                  size="md"
                >
                  ⚡ Start ioTec Collection Prompt
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {verificationModal && (
        <PaymentVerificationModal
          isOpen={!!verificationModal}
          paymentDetails={verificationModal}
          onComplete={() => {
            setVerificationModal(null);
            setMsg({ type: 'success', text: 'Payment verified successfully!' });
            refreshOrg();
            fetchBillingData();
          }}
          onCancel={() => setVerificationModal(null)}
        />
      )}

    </div>
  );
};
