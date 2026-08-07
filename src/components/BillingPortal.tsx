import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { SMSBundle } from '../types';
import { Sparkles, Phone, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { PaymentVerificationModal } from './PaymentVerificationModal';

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

  // Subscription handling removed – pay‑as‑you‑go model does not use tiers

  const handlePurchaseBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const normalizedAmount = Number(customAmount);
    const hasCustomAmount = useCustomAmount && Number.isFinite(normalizedAmount) && normalizedAmount > 0;
    const hasBundle = !!selectedBundle;

    if (!hasCustomAmount && !hasBundle) {
      setMsg({ type: 'error', text: 'Please select a bundle or enter a custom top-up amount.' });
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, any> = {
        payment_method: 'Mobile Money (MTN / Airtel)',
        payment_reference: momoPhone,
        phone_number: momoPhone,
        external_id: `yo-space-${organization?.id || 'anon'}-${selectedBundle?.id || 'custom'}-${Date.now()}`,
      };

      if (hasCustomAmount) {
        payload.custom_amount = normalizedAmount;
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
    const hasCustomAmount = useCustomAmount && Number.isFinite(normalizedAmount) && normalizedAmount > 0;
    const hasBundle = !!selectedBundle;

    if (!hasCustomAmount && !hasBundle) {
      setMsg({ type: 'error', text: 'Please select a bundle or enter a custom top-up amount.' });
      return;
    }

    setMsg(null);
    setLoading(true);
    try {
      const payload: Record<string, any> = {
        payment_method: 'Mobile Money (MTN / Airtel)',
        payment_reference: momoPhone,
        phone_number: momoPhone,
        external_id: `yo-space-${organization?.id || 'anon'}-${selectedBundle?.id || 'custom'}-${Date.now()}`,
      };

      if (hasCustomAmount) {
        payload.custom_amount = normalizedAmount;
      } else if (selectedBundle) {
        payload.bundle_id = selectedBundle.id;
      }

      const res = await apiClient.post('/billing/sms-bundles/purchase/', payload);
      const providerStatus = res.data?.provider?.status || 'Pending';
      const externalId = res.data?.provider?.externalId || res.data?.purchase?.payment_reference || 'pending';
      setVerificationModal({
        phoneNumber: momoPhone,
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
    <div className="space-y-8 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Notifications */}
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
          msg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
            <span className="font-medium">{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Current Plan & SMS Credit Summary Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-200 dark:border-blue-900 shadow-sm transition-colors">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
            Pay-As-You-Go Model (Zero Expiring Credits)
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">Prepaid Wallet & SMS Balance</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Current Balance: <span className="text-blue-800 dark:text-blue-300 font-bold">{organization?.sms_balance.toLocaleString()} SMS credits</span> (~UGX {((organization?.sms_balance ?? 0) * 40).toLocaleString()} value)
          </p>
        </div>

        <button
          onClick={() => setIsTopUpOpen(true)}
          className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Top Up Wallet (Mobile Money)
        </button>
      </div>

      {/* Pay-As-You-Go SMS Top-Up Bundles Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay-As-You-Go Top-Up Packs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Top up credits anytime via MTN Mobile Money or Airtel Money. All rates calculated transparently from final selling prices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(bundles) ? bundles : []).map((b) => (
            <div key={b.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-600 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                  <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                    UGX {Number(b.price_per_sms).toFixed(0)}/SMS
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-400 mt-2">{b.sms_count.toLocaleString()} SMS</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">UGX {Number(b.price).toLocaleString()}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedBundle(b);
                  setIsTopUpOpen(true);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                Buy Pack
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Top-Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4 text-slate-900 dark:text-white">
            <button onClick={() => setIsTopUpOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Up SMS Credits</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instant Mobile Money payment (MTN / Airtel Uganda)</p>

            <form onSubmit={handlePurchaseBundle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Bundle</label>
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
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
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
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Custom Amount (UGX)</label>
                <input
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
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mobile Money Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. +256770000000"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {(selectedBundle || useCustomAmount) && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  {selectedBundle && (
                    <div className="flex items-center justify-between">
                      <span>Bundle:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedBundle.name} ({selectedBundle.sms_count} SMS)</span>
                    </div>
                  )}
                  {useCustomAmount && customAmount && (
                    <div className="flex items-center justify-between">
                      <span>Custom Amount:</span>
                      <span className="font-bold text-blue-800 dark:text-blue-400">UGX {Number(customAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-blue-800 dark:text-blue-400">
                      UGX {(useCustomAmount && customAmount ? Number(customAmount) : Number(selectedBundle?.price || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md disabled:opacity-50 transition"
                >
                  {loading ? 'Processing Mobile Money...' : `Pay UGX ${(useCustomAmount && customAmount ? Number(customAmount) : Number(selectedBundle?.price || 0)).toLocaleString()}`}
                </button>

                <button
                  type="button"
                  onClick={handleInitiateCollection}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-50 transition"
                >
                  ⚡ Start ioTec Collection Prompt
                </button>
              </div>
            </form>
          </div>
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
