import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface SettingsFormState {
  company_name: string;
  default_language: string;
  sms_sender_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  voice_enabled: boolean;
}

const defaultSettings: SettingsFormState = {
  company_name: '',
  default_language: 'en',
  sms_sender_id: '',
  email_notifications: true,
  sms_notifications: true,
  voice_enabled: true,
};

export const SettingsPage: React.FC = () => {
  const [form, setForm] = useState<SettingsFormState>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await apiClient.get('/settings/');
        setForm({
          company_name: res.data.company_name || '',
          default_language: res.data.default_language || 'en',
          sms_sender_id: res.data.sms_sender_id || '',
          email_notifications: Boolean(res.data.email_notifications),
          sms_notifications: Boolean(res.data.sms_notifications),
          voice_enabled: Boolean(res.data.voice_enabled),
        });
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateField = <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      await apiClient.put('/settings/', form);
      setMessage('Settings updated successfully.');
    } catch (error) {
      console.error('Failed to save settings', error);
      setMessage('Unable to save these changes right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-[10px] border-line shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Business defaults</p>
            <h2 className="mt-1 text-2xl font-display font-extrabold text-ink">Organization Settings</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        {message && (
          <p className="mt-4 text-xs font-medium text-success">{message}</p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-[10px] border-line shadow-xs space-y-5">
          <label className="block text-sm font-medium text-ink">
            Company name
            <input
              value={form.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              placeholder="Yo-Spaces Uganda"
              className="mt-2 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          <label className="block text-sm font-medium text-ink">
            Default language
            <select
              value={form.default_language}
              onChange={(e) => updateField('default_language', e.target.value)}
              className="mt-2 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="lug">Luganda</option>
              <option value="fr">French</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-ink">
            SMS sender ID
            <input
              value={form.sms_sender_id}
              onChange={(e) => updateField('sms_sender_id', e.target.value)}
              placeholder="YOSPACES"
              className="mt-2 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </label>
        </Card>

        <Card className="p-6 rounded-[10px] border-line shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Email notifications</p>
              <p className="text-xs text-muted">Send update emails for key events.</p>
            </div>
            <input
              type="checkbox"
              checked={form.email_notifications}
              onChange={(e) => updateField('email_notifications', e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">SMS notifications</p>
              <p className="text-xs text-muted">Send automatic SMS alerts to your users.</p>
            </div>
            <input
              type="checkbox"
              checked={form.sms_notifications}
              onChange={(e) => updateField('sms_notifications', e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Voice / call features</p>
              <p className="text-xs text-muted">Enable voice-based community flows.</p>
            </div>
            <input
              type="checkbox"
              checked={form.voice_enabled}
              onChange={(e) => updateField('voice_enabled', e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
