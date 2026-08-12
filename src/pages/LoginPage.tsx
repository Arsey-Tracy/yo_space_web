import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
// import { X } from 'lucide-react';

type Props = {
  onNavigate: (tab: string) => void;
};

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onNavigate('landing');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
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
          Sign In
        </h2>
        {error && <div className="mt-2 text-alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-ink font-semibold mb-1">Username or Email</label>
            <Input
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <label className="block text-ink font-semibold mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary" fullWidth>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};