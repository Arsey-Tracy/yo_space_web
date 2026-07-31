import React from 'react';
import { PhoneCall, MessageSquare, Radio, Zap, ArrowRight, CheckCircle2, ShieldCheck, Globe, Building2, Phone } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 bg-gradient-to-b from-blue-900 via-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-8">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Enterprise-Grade 2G Voice, SMS & USSD Platform for Organizations
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Connect Every Member & Community Instantly via <span className="text-blue-400">Voice, SMS & USSD</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed font-normal">
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
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base transition-all"
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
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Purpose-Built Communication Solutions</h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">Pass information quickly, organize audio spaces, and run African language surveys effortlessly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bulk SMS Broadcasts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Broadcast instant SMS updates, agricultural notices, meeting alerts, and announcements to thousands of recipients simultaneously with custom Organization headers.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Voice Conference Spaces</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Host live voice audio conference calls accessible via simple 4-digit PINs. Members dial in from basic phones or receive automated outbound calls to join.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">USSD Surveys & Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Conduct real-time surveys and polls via USSD menu (*256#). Collect responses, view percentage breakdowns, and auto-translate into local African languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Flexible Subscription Plans</h2>
            <p className="text-slate-600 mt-3 text-sm">Transparent pricing in UGX tailored to organizations and cooperatives of all sizes.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Standard */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Standard</h3>
                <p className="text-3xl font-extrabold text-blue-700 mt-3">UGX 200k<span className="text-xs text-slate-500 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 1 Active Space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 100 Members max</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 1,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Dashboard Access</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition">
                Choose Standard
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 relative flex flex-col justify-between shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider">
                Recommended
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                <p className="text-3xl font-extrabold text-blue-700 mt-3">UGX 350k<span className="text-xs text-slate-500 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 3 Active Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 300 Members/space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 3,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Merge Spaces Feature</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> African Language API</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition shadow-sm">
                Choose Pro
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Premium</h3>
                <p className="text-3xl font-extrabold text-blue-700 mt-3">UGX 500k<span className="text-xs text-slate-500 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 10 Active Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 1,000 Members/space</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 10,000 Bulk SMS/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> USSD Survey Builder</li>
                </ul>
              </div>
              <button onClick={() => onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition">
                Choose Premium
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                <p className="text-2xl font-bold text-slate-800 mt-3">Custom</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Spaces</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Dedicated Account Desk</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Custom Sender ID (v2)</li>
                </ul>
              </div>
              <button onClick={() => onNavigate ? onNavigate('contact') : onOpenAuth('register')} className="mt-8 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

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
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition">Contact Us</button></li>
              <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate?.('terms')} className="hover:text-white transition">Terms of Service</button></li>
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
