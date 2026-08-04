import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database, Check } from 'lucide-react';

interface PrivacyPageProps {
}

export const PrivacyPage: React.FC<PrivacyPageProps> = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Data Protection & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Privacy Policy & Data Security
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl mx-auto">
            Last Updated: July 31, 2026. How Yo-Spaces safeguards organization data, SMS recipient lists, voice records, and mobile interactions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> 1. Information We Collect
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Yo-Spaces collects information necessary to provide 2G SMS, Voice Conference, and USSD services to organizations and community members across Africa:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li><strong className="text-slate-800">Organization Data:</strong> Organization name, administrator email, primary contact phone number, and subscription billing details.</li>
              <li><strong className="text-slate-800">Member & Recipient Lists:</strong> Phone numbers, display names, and roles uploaded by organizations for broadcast communication.</li>
              <li><strong className="text-slate-800">Telephony & Interaction Logs:</strong> Call session IDs, USSD session state, SMS delivery statuses, and survey responses.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> 2. How We Use Data & Organization Sender IDs
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Data collected is strictly used to facilitate broadcast delivery, voice audio routing, and survey aggregation:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Broadcast Transparency:</strong> All outgoing SMS messages automatically include your Organization Name prefix (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">[OrgName]</code>) to identify sender origin.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Data Monetization:</strong> We do NOT sell, rent, or trade phone numbers or recipient data to third parties or advertising networks.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Telephony Routing:</strong> Communication metrics are securely transmitted via Africa's Talking API infrastructure for mobile network delivery.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" /> 3. Data Storage & Security
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We employ standard encryption in transit (TLS 1.3 / HTTPS) and at rest. Authentication tokens use JWT with automatic rotation. Database credentials and API keys are stored in secure environment vaults.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 4. Contact Our Data Protection Officer
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              For questions regarding compliance, data deletion requests, or regional privacy regulations across African telecom jurisdictions, contact <a href="mailto:privacy@yospaces.org" className="text-blue-600 font-semibold hover:underline">privacy@yospaces.org</a>.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
