import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Space, Survey } from '../types';
import { Plus, CheckCircle2, AlertCircle, X, ListPlus, Send, Radio } from 'lucide-react';

export const SurveyBuilder: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  // Form states
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | ''>('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDesc, setSurveyDesc] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'text' | 'rating'>('multiple_choice');
  const [optionsString, setOptionsString] = useState('Yes, No, Undecided');

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

  const fetchSurveys = async () => {
    try {
      const res = await apiClient.get<Survey[]>('/surveys/');
      const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
      setSurveys(list);
      if (list.length > 0 && !selectedSurvey) {
        setSelectedSurvey(list[0]);
      }
    } catch (err) {
      console.error(err);
      setSurveys([]);
    }
  };

  const fetchAnalytics = async (surveyId: number) => {
    try {
      const res = await apiClient.get(`/surveys/${surveyId}/analytics/`);
      setAnalyticsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSpaces();
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchAnalytics(selectedSurvey.id);
    }
  }, [selectedSurvey]);

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpaceId || !surveyTitle.trim()) return;
    setMsg(null);

    try {
      const res = await apiClient.post<Survey>('/surveys/', {
        space: Number(selectedSpaceId),
        title: surveyTitle,
        description: surveyDesc,
      });

      setMsg({ type: 'success', text: `Survey '${res.data.title}' created.` });
      setIsCreateSurveyOpen(false);
      setSurveyTitle('');
      setSurveyDesc('');
      fetchSurveys();
    } catch (err: any) {
      setMsg({ type: 'error', text: 'Failed to create survey.' });
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey || !questionText.trim()) return;
    setMsg(null);

    const options = questionType === 'multiple_choice'
      ? optionsString.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      await apiClient.post(`/surveys/${selectedSurvey.id}/add-question/`, {
        question_text: questionText,
        question_type: questionType,
        options,
      });

      setMsg({ type: 'success', text: 'Question added to survey.' });
      setIsAddQuestionOpen(false);
      setQuestionText('');
      fetchSurveys();
      fetchAnalytics(selectedSurvey.id);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to add question.' });
    }
  };

  const handleSendSurveySMS = async () => {
    if (!selectedSurvey) return;
    setMsg(null);
    try {
      const res = await apiClient.post(`/surveys/${selectedSurvey.id}/send-sms/`);
      setMsg({ type: 'success', text: res.data.message });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to trigger survey SMS broadcast.' });
    }
  };

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

      {/* Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Surveys & USSD Analytics</h2>
          <p className="text-xs text-slate-500">Build interactive USSD & Web polls to collect community feedback in real-time.</p>
        </div>

        <button
          onClick={() => setIsCreateSurveyOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create Survey
        </button>
      </div>

      {/* Survey List & Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Survey Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Surveys</h3>

          {!(Array.isArray(surveys) && surveys.length > 0) ? (
            <div className="bg-white p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-200 shadow-xs">
              No surveys created yet. Click "Create Survey" to get started.
            </div>
          ) : (
            (Array.isArray(surveys) ? surveys : []).map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSurvey(s)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedSurvey?.id === s.id
                    ? 'bg-white border-2 border-blue-600 shadow-md'
                    : 'bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{s.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    {s.questions?.length || 0} Qs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{s.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Space: {s.space_name}</span>
                  <span className="font-bold text-blue-700">{s.total_responses} Responses</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Analytics Breakdown */}
        {selectedSurvey && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedSurvey.title}</h3>
                <p className="text-xs text-slate-500">Space: {selectedSurvey.space_name} • Total Responses: {selectedSurvey.total_responses}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendSurveySMS}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition"
                >
                  <Send className="w-3.5 h-3.5 text-blue-700" /> Dispatch SMS Prompt
                </button>
                <button
                  onClick={() => setIsAddQuestionOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-blue-800 transition"
                >
                  <ListPlus className="w-4 h-4" /> Add Question
                </button>
              </div>
            </div>

            {!analyticsData?.questions_analytics || analyticsData.questions_analytics.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No questions added to this survey yet. Click "Add Question" to build your poll.
              </div>
            ) : (
              <div className="space-y-6">
                {analyticsData.questions_analytics.map((q: any) => (
                  <div key={q.question_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{q.question_text}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{q.total_responses} answers</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {Object.entries(q.breakdown || {}).map(([choice, count]: [string, any]) => {
                        const pct = q.percentages?.[choice] || 0;
                        return (
                          <div key={choice} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-700 font-semibold">{choice}</span>
                              <span className="text-blue-800 font-bold">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                              <div
                                className="bg-blue-700 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Create Survey Modal */}
      {isCreateSurveyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Survey</h3>
            <form onSubmit={handleCreateSurvey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Space *</label>
                <select
                  required
                  value={selectedSpaceId}
                  onChange={(e) => setSelectedSpaceId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {(Array.isArray(spaces) ? spaces : []).map((sp) => (
                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Survey Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maize Crop Health Poll"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Purpose of this poll..."
                  value={surveyDesc}
                  onChange={(e) => setSurveyDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateSurveyOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold">
                  Create Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isAddQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Text *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Have you received fertilizer distribution?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e: any) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text">Free Text</option>
                  <option value="rating">Rating (1 to 5)</option>
                </select>
              </div>

              {questionType === 'multiple_choice' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Choices (Comma Separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Yes, No, Partially"
                    value={optionsString}
                    onChange={(e) => setOptionsString(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddQuestionOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
