import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { SMSBundle } from '../types';
import { Sparkles, Phone, CheckCircle2, AlertTriangle, X } from 'lucide-react';

import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const BillingPortal: React.FC = () => {
  const { user, organization, refreshOrg } = useAuth();
  // Subscription plans state removed for pay‑as‑you‑go model
  const [bundles, setBundles] = useState<SMSBundle[]>([]);
  
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<SMSBundle | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ trackingId: string; redirectUrl: string } | null>(null);
  
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
    if (user?.email && !payerEmail) {
      setPayerEmail(user.email);
    }
  }, [user?.email]);

  const verifyPesapalPayment = async (trackingId: string) => {
    const res = await apiClient.post('/billing/pesapal/verify/', { tracking_id: trackingId });
    const status = res.data?.payment?.status;
    if (status === 'completed') {
      setPendingPayment(null);
      setIsTopUpOpen(false);
      setMsg({ type: 'success', text: 'PesaPal payment confirmed. SMS credits have been added to your wallet.' });
      refreshOrg();
      fetchBillingData();
      return true;
    }
    if (status === 'failed' || status === 'cancelled') {
      setPendingPayment(null);
      setMsg({ type: 'error', text: `Payment ${status}. You can try again from the wallet.` });
      return true;
    }
    return false;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackingFromReturn = params.get('OrderTrackingId') || params.get('tracking_id');
    if (!trackingFromReturn) return;

    setPendingPayment({ trackingId: trackingFromReturn, redirectUrl: '' });
    setMsg({ type: 'success', text: 'Confirming your PesaPal payment…' });
    verifyPesapalPayment(trackingFromReturn).catch(() => {
      setMsg({ type: 'error', text: 'Could not confirm payment yet. We will keep checking.' });
    });
  }, []);

  useEffect(() => {
    if (!pendingPayment?.trackingId) return;
    const interval = window.setInterval(() => {
      verifyPesapalPayment(pendingPayment.trackingId).catch(() => undefined);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [pendingPayment?.trackingId]);

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
    if (!momoPhone.trim()) {
      setMsg({ type: 'error', text: 'Enter the phone number that will pay on PesaPal.' });
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, any> = {
        phone_number: momoPhone.trim().replace(/^\+/, ''),
        email: payerEmail || user?.email,
        description: 'YoSpaces SMS credits',
      };

      if (hasCustomAmount) {
        payload.amount = normalizedAmount;
      } else if (selectedBundle) {
        payload.bundle_id = selectedBundle.id;
        payload.amount = Number(selectedBundle.price);
      }

      const res = await apiClient.post('/billing/pesapal/initiate/', payload);
      const redirectUrl = res.data?.redirect_url;
      const trackingId = res.data?.tracking_id;

      if (!redirectUrl || !trackingId) {
        setMsg({ type: 'error', text: res.data?.detail || 'PesaPal did not return a payment URL.' });
        return;
      }

      setPendingPayment({ trackingId, redirectUrl });
      setMsg({ type: 'success', text: 'Redirecting to PesaPal. Complete payment with Mobile Money or card, then return here.' });
      window.open(redirectUrl, 'PesaPal Payment', 'width=800,height=700');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const fallback = typeof detail === 'string' ? detail : 'Failed to start PesaPal payment.';
      setMsg({ type: 'error', text: fallback });
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
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[linear-gradient(135deg,#fff_0%,#ffe8d0_100%)]">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-white/80 text-primary text-[11px] font-semibold border border-line">
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
          <Sparkles className="w-4 h-4" /> Top Up Wallet (PesaPal)
        </Button>
      </Card>

      {/* Pay-As-You-Go SMS Top-Up Bundles Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-display font-bold text-ink">Pay-As-You-Go Top-Up Packs</h3>
          <p className="text-xs text-muted">Top up credits anytime via PesaPal (MTN, Airtel, or card). Credits are added after payment is confirmed.</p>
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
                <p className="text-2xl font-display font-extrabold text-primary mt-2">{b.sms_count.toLocaleString()} SMS</p>
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
            <p className="text-xs text-muted">Pay with PesaPal — Mobile Money or card. Credits appear after confirmation.</p>

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
                <label className="block text-ink font-semibold mb-1">PesaPal Phone Number *</label>
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

              <div>
                <label className="block text-ink font-semibold mb-1">Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                />
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
                  {loading ? 'Opening PesaPal...' : `Pay with PesaPal — UGX ${(useCustomAmount && customAmount ? Number(customAmount) : Number(selectedBundle?.price || 0)).toLocaleString()}`}
                </Button>
                {pendingPayment?.redirectUrl && (
                  <Button
                    type="button"
                    onClick={() => window.open(pendingPayment.redirectUrl, 'PesaPal Payment', 'width=800,height=700')}
                    variant="outline"
                    fullWidth
                    size="md"
                  >
                    Re-open PesaPal payment page
                  </Button>
                )}
                {pendingPayment && (
                  <p className="text-[11px] text-muted text-center">Waiting for PesaPal confirmation. This page updates automatically.</p>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
