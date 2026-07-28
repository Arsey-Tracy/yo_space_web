import React from 'react';
import { PhoneCall, MessageSquare, Radio, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-8">
            <Zap className="w-3.5 h-3.5" /> Empowering Uganda's Rural Communities via 2G Tech
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Connect Every Community Member instantly via <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Voice, SMS & USSD</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Yo-Spaces helps organizations create spaces to communicate simultaneously with rural communities across Uganda — even those on basic feature phones.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800 transition-all"
            >
              Sign In to Dashboard
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-3xl font-extrabold text-white">24.7M</p>
              <p className="text-xs text-slate-400 mt-1">Feature Phones Supported</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Offline Delivery Rate</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">2G First</p>
              <p className="text-xs text-slate-400 mt-1">Works without Internet</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">Mobile Money</p>
              <p className="text-xs text-slate-400 mt-1">Instant SMS Top-Up</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Built for Rural Communication Needs</h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">Pass information quickly, organize voice audio spaces, and pick up instant feedback from members.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bulk SMS Broadcasts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Broadcast instant SMS updates, vaccine drives, loan notices, and meeting alerts to thousands of members simultaneously.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Social Audio Spaces</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Host live voice conference calls accessible via simple 4-digit PINs. Members dial in from basic phones to participate.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive USSD Surveys</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conduct real-time surveys and polls via USSD menu (*256#). Collect responses, view percentage breakdowns, and export analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">How Yo-Spaces Works</h2>
            <p className="text-slate-400 mt-3 text-sm">3 simple steps to connect with rural communities across Uganda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-extrabold flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                1
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Create Your Space</h4>
              <p className="text-slate-400 text-sm">Set up your space, invite members, or bulk import existing contact lists via CSV/Excel.</p>
            </div>

            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-extrabold flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                2
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Broadcast or Go Live</h4>
              <p className="text-slate-400 text-sm">Send SMS updates or hit "Go Live" to trigger outbound calls for a live voice conference.</p>
            </div>

            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-extrabold flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
                3
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Collect Feedback & Top-Up</h4>
              <p className="text-slate-400 text-sm">Track USSD survey responses in real-time and purchase SMS credit bundles via Mobile Money whenever balance runs low.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Flexible Subscription Plans</h2>
            <p className="text-slate-400 mt-3 text-sm">Transparent pricing in UGX tailored to organizations of all sizes.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Standard */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Standard</h3>
                <p className="text-3xl font-extrabold text-teal-400 mt-3">UGX 200k<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 1 Space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 100 Members max</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 1,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Dashboard Access</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">
                Choose Standard
              </button>
            </div>

            {/* Pro */}
            <div className="glass-card p-6 rounded-2xl border-2 border-teal-500/50 relative flex flex-col justify-between shadow-xl shadow-teal-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pro</h3>
                <p className="text-3xl font-extrabold text-teal-400 mt-3">UGX 350k<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 3 Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 300 Members/space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 3,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Merge Spaces Feature</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Public & Private Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Analytics Dashboard</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors">
                Choose Pro
              </button>
            </div>

            {/* Premium */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Premium</h3>
                <p className="text-3xl font-extrabold text-teal-400 mt-3">UGX 500k<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 10 Spaces max</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 1,000 Members/space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 10,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Survey & Poll Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Report Generation</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">
                Choose Premium
              </button>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-2xl font-bold text-slate-200 mt-3">Custom</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Unlimited Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Unlimited Members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Custom SMS Bundles</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 Yo-Spaces Uganda. Empowering Rural Communities through Technology.</p>
      </footer>
    </div>
  );
};
