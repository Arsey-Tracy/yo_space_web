import React, { useState } from 'react';
import { PhoneCall, MessageSquare, Radio, Zap, ArrowRight, CheckCircle2, Globe, Building2, Calculator, Wallet, Coins } from 'lucide-react';
import { PayAsYouGoModal } from './PayAsYouGoModal';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigate }) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "linear-gradient(120deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.75) 45%, rgba(2, 6, 23, 0.92) 100%), url('/hero_graphic.png')" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_42%)]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-semibold mb-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Enterprise-Grade 2G Voice, SMS & USSD Platform for Organizations
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
            Connect Every Member & Community Instantly via <span className="text-blue-400">Voice, SMS & USSD</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-blue-50/95 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
            Yo-Spaces enables B2B organizations, NGOs, cooperatives, and enterprise teams to broadcast simultaneously across Africa — seamlessly delivering messages even to basic 2G feature phones.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base transition-all backdrop-blur-sm"
            >
              Sign In to Organization Dashboard
            </button>
          </div>

          {/* Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-blue-800/60">
            <div>
              <p className="text-3xl font-extrabold text-white">24.7M</p>
              <p className="text-xs text-blue-200 mt-1 font-medium">Feature Phones Reached</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-400">100%</p>
              <p className="text-xs text-blue-200 mt-1 font-medium">Offline Delivery Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">2G & 3G/4G</p>
              <p className="text-xs text-blue-200 mt-1 font-medium">Cross-Network Coverage</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">Mobile Money</p>
              <p className="text-xs text-blue-200 mt-1 font-medium">Instant Pay & Top-Up</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Purpose-Built Communication Solutions</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm sm:text-base">Pass information quickly, organize audio spaces, and run African language surveys effortlessly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900/70 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bulk SMS Broadcasts</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Broadcast instant SMS updates, agricultural notices, meeting alerts, and announcements to thousands of recipients simultaneously with custom Organization headers.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/70 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Voice Conference Spaces</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Host live voice audio conference calls accessible via simple 4-digit PINs. Members dial in from basic phones or receive automated outbound calls to join.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/70 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">USSD Surveys & Analytics</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Conduct real-time surveys and polls via USSD menu (*256#). Collect responses, view percentage breakdowns, and auto-translate into local African languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pay-As-You-Go Pricing Section */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
              <Coins className="w-3.5 h-3.5 text-emerald-400" /> Pure Pay-As-You-Go Model
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Transparent Network Pricing</h2>
            <p className="text-slate-300 mt-4 text-base leading-relaxed">
              No monthly fees, hidden charges, or expiring credits. Deposit funds into your organization’s prepaid wallet and pay strictly per SMS sent.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold">
              <Globe className="w-4 h-4 text-blue-400" />
              Broadcast to MTN, Airtel & all other networks in a single campaign
            </div>
          </div>

          {/* Network Rate Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-12">

            {/* MTN Rate */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 hover:border-amber-400/50 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">MTN Local Traffic</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">MTN Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-amber-400 font-mono">UGX 40</span>
                  <span className="text-xs text-slate-400 ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-700/60 pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Fixed Markup: +13 UGX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Instant Local Delivery Rate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Automatic Recipient Deduplication</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8 w-full py-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold text-xs transition border border-amber-400/30 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Estimate MTN Cost
              </button>
            </div>

            {/* Airtel Rate */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                Most Popular Network
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-xs">Airtel Local Traffic</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Airtel Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-blue-400 font-mono">UGX 40</span>
                  <span className="text-xs text-slate-400 ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-700/60 pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Fixed Markup: +15 UGX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>High-Speed Nationwide Delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Real-Time Wallet Deduction</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Estimate Airtel Cost
              </button>
            </div>

            {/* Other Telcos Rate */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 hover:border-purple-400/50 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs">Other Operators</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Lyca & Others</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-purple-400 font-mono">UGX 50</span>
                  <span className="text-xs text-slate-400 ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-700/60 pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Fixed Markup: +15 UGX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Fallback Carrier Routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Immutable Audit Log</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8 w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs transition border border-purple-400/30 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Estimate Other Telcos
              </button>
            </div>

          </div>

          {/* Calculator Callout Banner */}
          <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-800 p-8 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Want to calculate campaign costs in real time?</h4>
                <p className="text-slate-300 text-sm mt-1">
                  Use our interactive Pay-As-You-Go calculator to preview costs for mixed telecom contact lists.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Calculator className="w-4 h-4" /> Open Campaign Calculator
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Fund Wallet Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* PayAsYouGo Calculator Modal */}
      <PayAsYouGoModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onGetStarted={() => onOpenAuth('register')}
      />

      {/* Footer */}
      <footer className="mt-auto py-10 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-lg mb-2">
              <Building2 className="w-5 h-5 text-blue-400" /> Yo-Spaces B2B
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Connecting organizations and rural communities across Africa via 2G SMS, Voice, and USSD telephony infrastructure.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenAuth('register')} className="hover:text-white transition">Register Organization</button></li>
              <li><button onClick={() => onOpenAuth('login')} className="hover:text-white transition">Sign In</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Company & Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-white transition">Contact Us</button></li>
              <li><button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-white transition">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-white transition">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Support Line</h4>
            <p className="text-slate-300 font-semibold mb-1">+256 323 200 925</p>
            <p className="text-slate-400">Kampala, Uganda</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center">
          <p>© 2026 Yo-Spaces Technology Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};