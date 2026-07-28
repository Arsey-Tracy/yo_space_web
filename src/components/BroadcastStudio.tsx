import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Space, Broadcast } from '../types';
import { MessageSquare, Send, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export const BroadcastStudio: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'sent' | 'draft' | 'scheduled'>('sent');
  const [scheduledAt, setScheduledAt] = useState('');

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
  const smsSegments = Math.ceil((message.length || 1) / 160);
  const totalCreditsNeeded = recipientCount * smsSegments;

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpaceId || !message.trim()) return;
    setMsg(null);
    setLoading(true);

    try {
      await apiClient.post('/broadcasts/', {
        space: Number(selectedSpaceId),
        message,
        status,
        scheduled_at: status === 'scheduled' ? scheduledAt : null,
      });

      setMsg({ type: 'success', text: status === 'sent' ? 'SMS broadcast sent successfully!' : 'Broadcast saved.' });
      setMessage('');
      fetchBroadcasts();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.[0] || err.response?.data?.detail || 'Failed to send broadcast.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Notifications */}
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Composer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SMS Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Broadcast Studio</h2>
              <p className="text-xs text-slate-400">Compose and send bulk SMS messages to space members.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Select Target Space *</label>
              <select
                required
                value={selectedSpaceId}
                onChange={(e) => setSelectedSpaceId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
              >
                {(Array.isArray(spaces) ? spaces : []).map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.members_count} members)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 font-medium">Broadcast Message *</label>
                <span className="text-[11px] text-slate-400">
                  {message.length} chars ({smsSegments} SMS segment{smsSegments > 1 ? 's' : ''})
                </span>
              </div>
              <textarea
                required
                rows={5}
                placeholder="Type your SMS message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Sending Mode</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                >
                  <option value="sent">Send Immediately</option>
                  <option value="draft">Save as Draft</option>
                  <option value="scheduled">Schedule Broadcast</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Processing...' : status === 'sent' ? 'Send SMS Broadcast Now' : 'Save Broadcast'}
              </button>
            </div>
          </form>
        </div>

        {/* Calculation Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 h-fit">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Delivery Estimate</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Target Space:</span>
              <span className="font-bold text-white">{currentSpace?.name || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Recipients Count:</span>
              <span className="font-bold text-teal-400">{recipientCount} members</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">SMS Segments:</span>
              <span className="font-bold text-slate-200">{smsSegments} per recipient</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Total Credits Needed:</span>
              <span className="font-extrabold text-cyan-400 text-sm">{totalCreditsNeeded} Credits</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">Delivery Guarantee:</p>
            <p>SMS broadcasts are delivered via Africa's Talking direct network routes to all major Ugandan telcos (MTN & Airtel).</p>
          </div>
        </div>

      </div>

      {/* Broadcast History Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-base">Broadcast History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Space</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Cost Credits</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {!(Array.isArray(broadcasts) && broadcasts.length > 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No broadcasts sent yet.
                  </td>
                </tr>
              ) : (
                (Array.isArray(broadcasts) ? broadcasts : []).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-semibold text-white">{b.space_name}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-300">{b.message}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        b.status === 'scheduled' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{b.recipients_count}</td>
                    <td className="py-3 px-4 text-teal-400 font-semibold">{b.cost_credits}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(b.created_at).toLocaleString()}</td>
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
