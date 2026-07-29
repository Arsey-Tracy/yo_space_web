import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, User, Mail, Phone, Building2, AlertCircle } from 'lucide-react';
import { PaymentVerificationModal } from './PaymentVerificationModal';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose, onSwitchMode }) => {
  const { login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [defaultLanguage] = useState('en');
  const [triggerPayment, setTriggerPayment] = useState(true);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    phoneNumber: string;
    amount: number;
    reference: string;
    organizationName?: string;
  } | null>(null);

  if (!isOpen && !verificationData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(username, password);
        onClose();
      } else {
        const res = await register({
          username,
          email,
          password,
          organization_name: organizationName,
          phone,
          default_language: defaultLanguage,
          trigger_test_payment: triggerPayment,
        });

        if (res?.payment_result) {
          const pRes = res.payment_result;
          setVerificationData({
            phoneNumber: pRes.phone_number || phone,
            amount: pRes.amount || 1000,
            reference: pRes.reference || 'MARZPAY-TEST-REF',
            organizationName,
          });
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = '';
      if (!err.response) {
        msg = `Network connection error (${err.message || 'Failed to fetch'}). Please verify Django server is running on http://127.0.0.1:8000.`;
      } else if (err.response.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data.detail) {
          msg = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          msg = err.response.data.non_field_errors[0];
        } else {
          const keys = Object.keys(err.response.data);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const val = err.response.data[firstKey];
            msg = `${firstKey}: ${Array.isArray(val) ? val[0] : val}`;
          } else {
            msg = 'Authentication failed. Please check your inputs.';
          }
        }
      } else {
        msg = 'Authentication failed. Please check your credentials.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white text-center">
              {mode === 'login' ? 'Welcome Back' : 'Create Organization Space'}
            </h2>
            <p className="text-xs text-slate-400 text-center mt-1">
              {mode === 'login' ? 'Sign in to access your dashboard' : 'Set up your community communication platform'}
            </p>

            {successMsg && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Organization Name *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bukedi Farmers Co-op"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass-input text-xs"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="name@organization.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Host Phone Number (for MarzPay / Voice / USSD)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="+256700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      id="triggerPayment"
                      checked={triggerPayment}
                      onChange={(e) => setTriggerPayment(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-400"
                    />
                    <label htmlFor="triggerPayment" className="text-slate-300 text-xs cursor-pointer">
                      <span className="font-semibold text-teal-400">Trigger 1,000 UGX MarzPay Test Payment</span>
                      <br />
                      <span className="text-[11px] text-slate-400">Sends a real Mobile Money USSD payment prompt to the provided phone number via MarzPay API upon registration.</span>
                    </label>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg glass-input text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Organization Space'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => onSwitchMode('register')} className="text-teal-400 font-semibold hover:underline">
                    Create One
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => onSwitchMode('login')} className="text-teal-400 font-semibold hover:underline">
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {verificationData && (
        <PaymentVerificationModal
          isOpen={!!verificationData}
          paymentDetails={verificationData}
          onComplete={() => {
            setVerificationData(null);
            onClose();
          }}
          onCancel={() => {
            setVerificationData(null);
            onClose();
          }}
        />
      )}
    </>
  );
};
