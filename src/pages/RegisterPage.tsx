import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Building2, User, Phone, Mail, Lock } from 'lucide-react';

type Props = {
  onNavigate: (tab: string) => void;
};

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [defaultLanguage] = useState('en');
  const [triggerPayment, setTriggerPayment] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register({
        username,
        email,
        password,
        organization_name: organizationName,
        phone,
        default_language: defaultLanguage,
        trigger_test_payment: triggerPayment,
      });
      onNavigate('landing');
    } catch (err: any) {
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
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-paper border border-line rounded-[10px] shadow-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('landing')}
          className="mb-4 text-center"
        >
          Back to Home
        </Button>
        <h2 className="text-2xl font-display font-bold text-ink text-center">
          Create Organization Space
        </h2>
        {error && <div className="mt-2 text-alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Name */}
          <div>
            <label className="block text-ink font-semibold mb-1">Organization Name *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-muted absolute left-3 top-3 z-10 pointer-events-none" />
              <Input
                type="text"
                required
                placeholder="e.g. Bukedi Farmers Co-op"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Username or Email */}
          <div>
            <label className="block text-ink font-semibold mb-1">Username or Email *</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted absolute left-3 top-3 z-10 pointer-events-none" />
              <Input
                type="text"
                required
                placeholder="Username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-ink font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3 z-10 pointer-events-none" />
              <Input
                type="email"
                required
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Host Phone Number */}
          <div>
            <label className="block text-ink font-semibold mb-1">Host Phone Number (for Mobile Money / Voice / USSD)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-muted absolute left-3 top-3 z-10 pointer-events-none" />
              <Input
                type="text"
                placeholder="+256700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 font-mono"
              />
            </div>
          </div>

          {/* Trigger Payment checkbox */}
          <div className="p-3 rounded-[10px] bg-paper border border-line flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              id="triggerPayment"
              checked={triggerPayment}
              onChange={(e) => setTriggerPayment(e.target.checked)}
              className="mt-0.5 rounded-[10px] border-line text-primary focus:ring-primary"
            />
            <label htmlFor="triggerPayment" className="text-ink text-xs cursor-pointer">
              <span className="font-bold text-ink">Trigger 1,000 UGX Mobile Money Test Payment</span>
              <br />
              <span className="text-[11px] text-muted">Sends a real Mobile Money USSD payment prompt to the provided phone number upon registration.</span>
            </label>
          </div>

          {/* Password */}
          <div>
            <label className="block text-ink font-semibold mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3 z-10 pointer-events-none" />
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} variant="primary" fullWidth>
            Create Organization Space
          </Button>
        </form>
      </div>
    </div>
  );
};