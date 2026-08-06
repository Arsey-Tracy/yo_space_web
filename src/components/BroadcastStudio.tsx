import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Space, Broadcast } from '../types';
import { MessageSquare, Send, AlertTriangle, CheckCircle2, X, Sparkles, Building2, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, translateText, formatOrgBroadcast } from '../api/translation';

export const BroadcastStudio: React.FC = () => {
  const { organization } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'sent' | 'draft' | 'scheduled'>('sent');
  const [scheduledAt, setScheduledAt] = useState('');

  // Translation State
  const [targetLang, setTargetLang] = useState<string>('en');
  const [translating, setTranslating] = useState<boolean>(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSpaces = async () => {
    try {
      const res = await apiClient.get<Space[]>('/spaces/');
      const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
      setSpaces(list);
      if (list.length > 0 && !selectedSpaceId) {
        setSelectedSpaceId(list[0].id);
      }
    } catch (err) {
      console.error(err);
      setSpaces([]);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const res = await apiClient.get<Broadcast[]>('/broadcasts/');
      const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
      setBroadcasts(list);
    } catch (err) {
      console.error(err);
      setBroadcasts([]);
    }
  };

  useEffect(() => {
    fetchSpaces();
    fetchBroadcasts();
  }, []);

  const currentSpace = spaces.find((s) => s.id === Number(selectedSpaceId));
  const recipientCount = currentSpace?.members_count || 0;
  
  // Format message preview with Org Name prefix
  const formattedPreview = formatOrgBroadcast(message, organization?.name || 'Organization', organization?.sender_id);
  const smsSegments = Math.ceil((formattedPreview.length || 1) / 160);
  const totalCreditsNeeded = recipientCount * smsSegments;

  const handleTranslate = async () => {
    if (!message.trim()) return;
    setTranslating(true);
    setTranslationNotice(null);
    try {
      const res = await translateText(message, targetLang, 'en');
      if (res.success) {
        setMessage(res.translatedText);
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
        setTranslationNotice(`Message translated to ${langObj?.name || targetLang}!`);
      } else {
        setTranslationNotice('Could not translate. Original text preserved.');
      }
    } catch (err) {
      setTranslationNotice('Translation API unavailable.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpaceId || !message.trim()) return;
    setMsg(null);
    setLoading(true);

    try {
      await apiClient.post('/broadcasts/', {
        space: Number(selectedSpaceId),
        message: message, // Backend will auto-prefix Org Name if needed
        status,
        scheduled_at: status === 'scheduled' ? scheduledAt : null,
      });

      setMsg({ type: 'success', text: status === 'sent' ? 'SMS broadcast sent successfully!' : 'Broadcast saved.' });
      setMessage('');
      setTranslationNotice(null);
      fetchBroadcasts();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.[0] || err.response?.data?.detail || 'Failed to send broadcast.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-900 dark:text-slate-100">
      
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

      {/* Composer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SMS Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Broadcast Studio</h2>
              <p className="text-xs text-slate-500">Compose and dispatch bulk SMS alerts across your 2G spaces.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">
                Select Target Space *
              </label>
              <select
                required
                value={selectedSpaceId}
                onChange={(e) => setSelectedSpaceId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white text-xs font-semibold text-slate-900"
              >
                {(Array.isArray(spaces) ? spaces : []).map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.members_count} members)
                  </option>
                ))}
              </select>
            </div>

            {/* Translation & Org Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Languages className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-xs">Local Language Auto-Translate:</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-medium"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={translating || !message.trim()}
                    className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs disabled:opacity-50 transition"
                  >
                    {translating ? 'Translating...' : 'Translate'}
                  </button>
                </div>
              </div>

              {translationNotice && (
                <p className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {translationNotice}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                  Broadcast Message *
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {message.length} chars ({smsSegments} SMS segment{smsSegments > 1 ? 's' : ''})
                </span>
              </div>
              <textarea
                required
                rows={5}
                placeholder="Type your SMS message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs leading-relaxed text-slate-900"
              />
            </div>

            {/* Recipient Message Preview with Org Name */}
            {message.trim() && (
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-700" /> Recipient 2G Phone Display Preview:
                </span>
                <p className="text-xs text-slate-800 font-mono bg-white p-2 rounded-lg border border-blue-100">
                  {formattedPreview}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">
                  Sending Mode
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white text-xs font-medium text-slate-900"
                >
                  <option value="sent">Send Immediately</option>
                  <option value="draft">Save as Draft</option>
                  <option value="scheduled">Schedule Broadcast</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white text-xs text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Processing...' : status === 'sent' ? 'Send Bulk SMS Broadcast' : 'Save Broadcast'}
              </button>
            </div>
          </form>
        </div>

        {/* Calculation Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Delivery Estimate</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Target Space:</span>
              <span className="font-bold text-slate-900">{currentSpace?.name || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Recipients Count:</span>
              <span className="font-bold text-blue-700">{recipientCount} members</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">SMS Segments:</span>
              <span className="font-bold text-slate-800">{smsSegments} per recipient</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Total Credits Needed:</span>
              <span className="font-extrabold text-blue-800 text-sm">{totalCreditsNeeded} Credits</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">Organization Sender Header:</p>
            <p className="leading-relaxed">
              Messages automatically include <code className="bg-white px-1 py-0.5 rounded border border-slate-300 font-bold text-blue-800">[{organization?.name || 'OrgName'}]</code> to identify your organization on 2G mobile phones.
            </p>
          </div>
        </div>

      </div>

      {/* Broadcast History Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Broadcast History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Space</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Cost Credits</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!(Array.isArray(broadcasts) && broadcasts.length > 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No broadcasts sent yet.
                  </td>
                </tr>
              ) : (
                (Array.isArray(broadcasts) ? broadcasts : []).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{b.space_name}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700 font-mono text-[11px]">{b.message}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'sent' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        b.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{b.recipients_count}</td>
                    <td className="py-3 px-4 text-blue-700 font-bold">{b.cost_credits}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(b.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
