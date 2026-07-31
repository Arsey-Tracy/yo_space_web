import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Subscription, SMSBundle } from '../types';
import { Sparkles, Phone, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { PaymentVerificationModal } from './PaymentVerificationModal';

export const BillingPortal: React.FC = () => {
  const { organization, refreshOrg } = useAuth();
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [bundles, setBundles] = useState<SMSBundle[]>([]);
  
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<SMSBundle | null>(null);
  const [momoPhone, setMomoPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBillingData = async () => {
    try {
      const [plansRes, _currentRes, bundlesRes] = await Promise.all([
        apiClient.get<Subscription[]>('/billing/plans/'),
        apiClient.get('/billing/current/'),
        apiClient.get<SMSBundle[]>('/billing/sms-bundles/'),
      ]);
      const pList = Array.isArray(plansRes.data) ? plansRes.data : (plansRes.data as any)?.results || [];
      const bList = Array.isArray(bundlesRes.data) ? bundlesRes.data : (bundlesRes.data as any)?.results || [];
      setPlans(pList);
      setBundles(bList);
      if (bList.length > 0) {
        setSelectedBundle(bList[0]);
      }
    } catch (err) {
      console.error(err);
      setPlans([]);
      setBundles([]);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleSubscribeTier = async (tierName: string) => {
    setMsg(null);
    try {
      const res = await apiClient.post('/billing/subscribe/', { tier: tierName });
      setMsg({ type: 'success', text: res.data.message });
      refreshOrg();
      fetchBillingData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to change subscription plan.' });
    }
  };

  const handlePurchaseBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBundle) return;
    setMsg(null);
    setLoading(true);

    try {
      const res = await apiClient.post('/billing/sms-bundles/purchase/', {
        bundle_id: selectedBundle.id,
        payment_method: 'Mobile Money (MTN / Airtel)',
        payment_reference: momoPhone,
      });

      setMsg({ type: 'success', text: `${res.data.credits_added} SMS credits added to your balance via Mobile Money!` });
      setIsTopUpOpen(false);
      refreshOrg();
      fetchBillingData();
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Failed to process mobile money purchase.' });
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

  const handleTestMarzPayPayment = async () => {
    if (!momoPhone) {
      setMsg({ type: 'error', text: 'Please enter a Mobile Money phone number to trigger the 1000 UGX payment test.' });
      return;
    }
    setMsg(null);
    setLoading(true);
    try {
      const res = await apiClient.post('/billing/test-payment/', {
        phone_number: momoPhone,
        amount: 1000,
        description: `1000 UGX MarzPay Test Payment for ${organization?.name || 'Yo-Spaces'}`
      });
      const pRes = res.data.marzpay_result;
      setVerificationModal({
        phoneNumber: momoPhone,
        amount: 1000,
        reference: pRes?.reference || 'MARZPAY-TEST-REF',
        organizationName: organization?.name,
      });
      setIsTopUpOpen(false);
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err.response?.data?.detail || err.response?.data?.message || 'Failed to trigger MarzPay test payment.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Notifications */}
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
          msg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span className="font-medium">{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Current Plan & SMS Credit Summary Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-200 shadow-sm">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
            {organization?.subscription_tier} Subscription Active
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Billing & SMS Credits</h2>
          <p className="text-xs text-slate-500 mt-1">
            Current SMS Balance: <span className="text-blue-800 font-bold">{organization?.sms_balance.toLocaleString()} credits</span>
          </p>
        </div>

        <button
          onClick={() => setIsTopUpOpen(true)}
          className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Top Up SMS (Mobile Money)
        </button>
      </div>

      {/* Pay-As-You-Go SMS Top-Up Bundles Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Buy SMS Credit Bundles</h3>
          <p className="text-xs text-slate-500">Top up credits anytime via MTN Mobile Money or Airtel Money when your balance runs low.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(bundles) ? bundles : []).map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    UGX {Number(b.price_per_sms).toFixed(0)}/SMS
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-blue-800 mt-2">{b.sms_count.toLocaleString()} SMS</p>
                <p className="text-xs text-slate-600 font-semibold mt-1">UGX {Number(b.price).toLocaleString()}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedBundle(b);
                  setIsTopUpOpen(true);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-800 font-bold text-xs transition"
              >
                Buy Pack
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Subscription Tier Plans</h3>
          <p className="text-xs text-slate-500">Upgrade or change your monthly subscription tier.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(Array.isArray(plans) ? plans : []).map((p) => {
            const isCurrent = organization?.subscription_tier === p.name;
            return (
              <div
                key={p.id}
                className={`bg-white p-6 rounded-2xl flex flex-col justify-between ${
                  isCurrent ? 'border-2 border-blue-600 shadow-md bg-blue-50/20' : 'border border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-base">{p.name}</h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-700 text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-extrabold text-blue-800 mt-3">UGX {Number(p.price).toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span></p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {p.max_spaces} Space{p.max_spaces > 1 ? 's' : ''}</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Up to {p.max_members_per_space} members/space</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {p.monthly_sms_quota.toLocaleString()} Initial SMS</li>
                    {p.allow_merge_spaces && <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Merge Spaces</li>}
                    {p.allow_surveys && <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Surveys & Polls</li>}
                  </ul>
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => handleSubscribeTier(p.name)}
                  className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMS Top-Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <button onClick={() => setIsTopUpOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Top Up SMS Credits</h3>
            <p className="text-xs text-slate-500">Instant Mobile Money payment (MTN / Airtel Uganda)</p>

            <form onSubmit={handlePurchaseBundle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Bundle</label>
                <select
                  value={selectedBundle?.id}
                  onChange={(e) => {
                    const b = bundles.find((item) => item.id === Number(e.target.value));
                    if (b) setSelectedBundle(b);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                >
                  {(Array.isArray(bundles) ? bundles : []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.sms_count.toLocaleString()} SMS (UGX {Number(b.price).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Money Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. +256770000000"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {selectedBundle && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Bundle:</span>
                    <span className="font-bold text-slate-900">{selectedBundle.name} ({selectedBundle.sms_count} SMS)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-blue-800">UGX {Number(selectedBundle.price).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md disabled:opacity-50 transition"
                >
                  {loading ? 'Processing Mobile Money...' : `Pay UGX ${selectedBundle ? Number(selectedBundle.price).toLocaleString() : 0}`}
                </button>

                <button
                  type="button"
                  onClick={handleTestMarzPayPayment}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-800 bg-blue-50 font-bold text-xs hover:bg-blue-100 disabled:opacity-50 transition"
                >
                  ⚡ Test 1,000 UGX MarzPay Payment Prompt
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
