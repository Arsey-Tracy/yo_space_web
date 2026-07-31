import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Space, SpaceMember } from '../types';
import { Plus, Upload, Download, PhoneCall, GitMerge, Search, Trash2, AlertCircle, CheckCircle2, X, Users, Building2 } from 'lucide-react';

export const SpaceManager: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [search, setSearch] = useState<string>('');

  // Modals state
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  // Form states
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');
  
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberRole, setMemberRole] = useState<'admin' | 'communications' | 'secretary' | 'member'>('member');

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [targetMergeSpaceId, setTargetMergeSpaceId] = useState<number | ''>('');

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSpaces = async () => {
    try {
      const res = await apiClient.get<Space[]>('/spaces/');
      const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
      setSpaces(list);
      if (list.length > 0 && !selectedSpace) {
        setSelectedSpace(list[0]);
      }
    } catch (err) {
      console.error('Failed to fetch spaces', err);
      setSpaces([]);
    }
  };

  const fetchMembers = async (spaceId: number) => {
    try {
      const res = await apiClient.get<SpaceMember[]>(`/spaces/${spaceId}/members/`);
      const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
      setMembers(list);
    } catch (err) {
      console.error('Failed to fetch members', err);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    if (selectedSpace) {
      fetchMembers(selectedSpace.id);
    }
  }, [selectedSpace]);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await apiClient.post('/spaces/', { name: newSpaceName, description: newSpaceDesc });
      setMsg({ type: 'success', text: `Space '${res.data.name}' created with PIN ${res.data.pin}` });
      setIsCreateSpaceOpen(false);
      setNewSpaceName('');
      setNewSpaceDesc('');
      fetchSpaces();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.[0] || err.response?.data?.detail || 'Failed to create space.' });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace) return;
    setMsg(null);
    try {
      await apiClient.post(`/spaces/${selectedSpace.id}/members/`, {
        name: memberName,
        phone_number: memberPhone,
        role: memberRole,
      });
      setMsg({ type: 'success', text: `Member added to ${selectedSpace.name}` });
      setIsAddMemberOpen(false);
      setMemberName('');
      setMemberPhone('');
      fetchMembers(selectedSpace.id);
      fetchSpaces();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.[0] || 'Failed to add member.' });
    }
  };

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace || !csvFile) return;
    setMsg(null);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await apiClient.post(`/spaces/${selectedSpace.id}/members/import-csv/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg({ type: 'success', text: res.data.message });
      setIsImportCsvOpen(false);
      setCsvFile(null);
      fetchMembers(selectedSpace.id);
      fetchSpaces();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to import CSV.' });
    }
  };

  const handleExportCsv = async () => {
    if (!selectedSpace) return;
    window.open(`/api/spaces/${selectedSpace.id}/members/export/`, '_blank');
  };

  const handleMergeSpaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace || !targetMergeSpaceId) return;
    setMsg(null);
    try {
      const res = await apiClient.post('/spaces/merge/', {
        source_space_id: selectedSpace.id,
        target_space_id: Number(targetMergeSpaceId),
      });
      setMsg({ type: 'success', text: res.data.message });
      setIsMergeOpen(false);
      fetchSpaces();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to merge spaces.' });
    }
  };

  const handleGoLive = async () => {
    if (!selectedSpace) return;
    setMsg(null);
    try {
      const res = await apiClient.post(`/spaces/${selectedSpace.id}/go-live/`);
      setMsg({ type: 'success', text: res.data.message });
      fetchSpaces();
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Failed to trigger voice call.' });
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!selectedSpace) return;
    try {
      await apiClient.delete(`/spaces/${selectedSpace.id}/members/${memberId}/`);
      fetchMembers(selectedSpace.id);
      fetchSpaces();
    } catch (err) {
      console.error(err);
    }
  };

  const safeSpaces = Array.isArray(spaces) ? spaces : [];
  const safeMembers = Array.isArray(members) ? members : [];

  const filteredMembers = safeMembers.filter((m) =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.phone_number || '').includes(search)
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Notifications */}
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
          msg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span className="font-medium">{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Spaces Selector & Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Community Spaces</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your organization's 2G voice spaces and member contact lists.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateSpaceOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Create Space
          </button>
          
          {selectedSpace && (
            <>
              <button
                onClick={handleGoLive}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" /> Go Live Call
              </button>
              <button
                onClick={() => setIsMergeOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-100 transition"
              >
                <GitMerge className="w-4 h-4 text-purple-700" /> Merge Space
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spaces List Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {safeSpaces.map((sp) => (
          <button
            key={sp.id}
            onClick={() => setSelectedSpace(sp)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2.5 ${
              selectedSpace?.id === sp.id
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{sp.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
              PIN: {sp.pin}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Space Content */}
      {selectedSpace ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{selectedSpace.name}</h3>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Voice PIN: {selectedSpace.pin}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedSpace.description || 'No description added.'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-blue-800 transition"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
              <button
                onClick={() => setIsImportCsvOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200/80 transition"
              >
                <Upload className="w-3.5 h-3.5 text-blue-700" /> Import CSV
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200/80 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" /> Export CSV
              </button>
            </div>
          </div>

          {/* Members Table Filter & Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Total: {filteredMembers.length} members</span>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No members in this space yet. Use "Add Member" or "Import CSV" to populate contacts.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.name || 'Unnamed'}</td>
                      <td className="py-3 px-4 font-mono text-blue-700 font-semibold">{m.phone_number}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          m.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          m.role === 'communications' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{new Date(m.joined_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-100">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Spaces Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any active spaces in your organization. Create a space to organize your members.
          </p>
          <button
            onClick={() => setIsCreateSpaceOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Your First Space
          </button>
        </div>
      )}

      {/* Create Space Modal */}
      {isCreateSpaceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Space</h3>
            <form onSubmit={handleCreateSpace} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Space Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Volunteers"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Brief description of the space..."
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateSpaceOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold">
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Member to {selectedSpace?.name}</h3>
            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+256700000000"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Member Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role</label>
                <select
                  value={memberRole}
                  onChange={(e: any) => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-xs"
                >
                  <option value="member">Member</option>
                  <option value="secretary">Secretary</option>
                  <option value="communications">Communications Officer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddMemberOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportCsvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Import Members CSV</h3>
            <p className="text-xs text-slate-500">
              CSV file must contain columns: <code className="text-blue-700 font-bold">name</code>, <code className="text-blue-700 font-bold">phone_number</code>, <code className="text-blue-700 font-bold">role</code>.
            </p>

            <form onSubmit={handleImportCsv} className="space-y-4 text-xs">
              <input
                type="file"
                accept=".csv"
                required
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsImportCsvOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Upload & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merge Space Modal */}
      {isMergeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Merge Space '{selectedSpace?.name}'</h3>
            <p className="text-xs text-slate-500">
              Combine members of '{selectedSpace?.name}' into another space. (Pro & Premium feature).
            </p>

            <form onSubmit={handleMergeSpaces} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Space *</label>
                <select
                  required
                  value={targetMergeSpaceId}
                  onChange={(e) => setTargetMergeSpaceId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="">Select Target Space...</option>
                  {safeSpaces.filter((s) => s.id !== selectedSpace?.id).map((s) => (
                    <option key={s.id} value={s.id}>{s.name} (PIN: {s.pin})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsMergeOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold">
                  Confirm Merge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
