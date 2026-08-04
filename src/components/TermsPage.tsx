import React from 'react';
import { FileText, Shield, CreditCard, Radio, AlertTriangle } from 'lucide-react';

interface TermsPageProps {
}

export const TermsPage: React.FC<TermsPageProps> = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" /> Legal Terms & Platform Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl mx-auto">
            Effective Date: July 31, 2026. General terms governing organization accounts, SMS credit balances, payment access verification, and 2G voice communications.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> 1. Platform & Account Services
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Yo-Spaces provides a multi-channel communication engine operating across Web, SMS, Voice, and USSD protocols. Organizations registering on Yo-Spaces agree to provide accurate registration details and maintain account security.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> 2. Payment Verification & Access Control
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Access to protected dashboard workspaces, member management, and broadcast dispatch requires a confirmed subscription or active credit payment:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li><strong className="text-slate-800">Payment Confirmation:</strong> Features are unlocked only after successful Mobile Money or card payment verification.</li>
              <li><strong className="text-slate-800">SMS Credit Top-Ups:</strong> SMS broadcast credits purchased via top-up bundles do not expire as long as the organization account remains active.</li>
              <li><strong className="text-slate-800">Tier Quotas:</strong> Standard, Pro, and Premium tiers define maximum spaces and member limits per space.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" /> 3. Broadcast Formatting & Organization Sender Identification
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              To ensure transparency and regulatory compliance across African telecom networks:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>Organizations operating on default tiers automatically broadcast with their Organization Name prefix (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">[OrgName]</code>).</li>
              <li>Custom Sender IDs (e.g., custom 11-character alphanumeric sender headers) are available under Tier v2 upgrades subject to telecom approval.</li>
              <li>Spam, fraudulent messages, or unauthorized promotional broadcasts are strictly prohibited and subject to immediate account termination.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 4. Service Availability & Telephony SLA
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              While Yo-Spaces targets 99.9% uptime, broadcast SMS delivery rates and voice call connections depend on regional cellular carrier infrastructure. Yo-Spaces is not liable for telecom network downtime beyond our API boundary.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
