import React, { useState } from 'react';
import { PhoneCall, MessageSquare, Radio, Zap, ArrowRight, CheckCircle2, Globe, Building2, Calculator, Wallet, Coins } from 'lucide-react';
import { PayAsYouGoModal } from './PayAsYouGoModal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigate }) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 bg-ink text-paper overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-paper/10 border border-line/20 text-primary text-xs font-semibold mb-8">
            <Zap className="w-3.5 h-3.5 text-primary" /> Enterprise-Grade 2G Voice, SMS & USSD Platform for Organizations
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-card max-w-4xl mx-auto leading-tight">
            Connect Every Member & Community Instantly via <span className="text-primary">Voice, SMS & USSD</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-paper/90 max-w-3xl mx-auto leading-relaxed font-normal">
            Yo-Spaces enables B2B organizations, NGOs, cooperatives, and enterprise teams to broadcast simultaneously across Africa — seamlessly delivering messages even to basic 2G feature phones.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto text-base"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto text-base text-paper border-paper/30 hover:bg-paper/10"
            >
              Sign In to Organization Dashboard
            </Button>
          </div>

          {/* Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-line/20 font-mono">
            <div>
              <p className="text-3xl font-display font-extrabold text-card">24.7M</p>
              <p className="text-xs text-muted mt-1 font-sans font-medium">Feature Phones Reached</p>
            </div>
            <div>
              <p className="text-3xl font-display font-extrabold text-primary">100%</p>
              <p className="text-xs text-muted mt-1 font-sans font-medium">Offline Delivery Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-display font-extrabold text-card">2G & 3G/4G</p>
              <p className="text-xs text-muted mt-1 font-sans font-medium">Cross-Network Coverage</p>
            </div>
            <div>
              <p className="text-3xl font-display font-extrabold text-success">Mobile Money</p>
              <p className="text-xs text-muted mt-1 font-sans font-medium">Instant Pay & Top-Up</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-extrabold text-ink">Purpose-Built Communication Solutions</h2>
            <p className="text-muted mt-3 text-sm sm:text-base">Pass information quickly, organize audio spaces, and run African language surveys effortlessly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 rounded-[10px] border-line hover:border-primary transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-6 border border-line">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-2">Bulk SMS Broadcasts</h3>
              <p className="text-muted text-sm leading-relaxed">
                Broadcast instant SMS updates, agricultural notices, meeting alerts, and announcements to thousands of recipients simultaneously with custom Organization headers.
              </p>
            </Card>

            <Card className="p-8 rounded-[10px] border-line hover:border-primary transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-6 border border-line">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-2">Voice Conference Spaces</h3>
              <p className="text-muted text-sm leading-relaxed">
                Host live voice audio conference calls accessible via simple 4-digit PINs. Members dial in from basic phones or receive automated outbound calls to join.
              </p>
            </Card>

            <Card className="p-8 rounded-[10px] border-line hover:border-primary transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-6 border border-line">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-2">USSD Surveys & Analytics</h3>
              <p className="text-muted text-sm leading-relaxed">
                Conduct real-time surveys and polls via USSD menu (*256#). Collect responses, view percentage breakdowns, and auto-translate into local African languages.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pay-As-You-Go Pricing Section */}
      <section className="py-20 bg-ink text-paper border-b border-line/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-paper/10 border border-line/20 text-success text-xs font-semibold mb-4">
              <Coins className="w-3.5 h-3.5 text-success" /> Pure Pay-As-You-Go Model
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-card">Transparent Network Pricing</h2>
            <p className="text-paper/80 mt-4 text-base leading-relaxed">
              No monthly fees, hidden charges, or expiring credits. Deposit funds into your organization’s prepaid wallet and pay strictly per SMS sent.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-paper/10 border border-line/20 text-card text-sm font-semibold">
              <Globe className="w-4 h-4 text-primary" />
              Broadcast to MTN, Airtel & all other networks in a single campaign
            </div>
          </div>

          {/* Network Rate Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-12">

            {/* MTN Rate */}
            <Card className="bg-card p-8 rounded-[10px] border-line hover:border-primary transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-[10px] bg-paper text-primary font-bold text-xs border border-line">MTN Local Traffic</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-ink mb-2">MTN Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-display font-extrabold text-primary font-mono">UGX 40</span>
                  <span className="text-xs text-muted ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-muted border-t border-line pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Instant Local Delivery Rate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Automatic Recipient Deduplication</span>
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8"
              >
                <Calculator className="w-4 h-4" /> Estimate MTN Cost
              </Button>
            </Card>

            {/* Airtel Rate */}
            <Card className="bg-card p-8 rounded-[10px] border-2 border-primary relative flex flex-col justify-between shadow-md">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-[10px] bg-primary text-ink font-bold text-[10px] uppercase tracking-wider">
                Most Popular Network
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-[10px] bg-paper text-alert font-bold text-xs border border-line">Airtel Local Traffic</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-ink mb-2">Airtel Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-display font-extrabold text-primary font-mono">UGX 40</span>
                  <span className="text-xs text-muted ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-muted border-t border-line pt-6">
                   <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>High-Speed Nationwide Delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Real-Time Wallet Deduction</span>
                  </li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8"
              >
                <Calculator className="w-4 h-4" /> Estimate Airtel Cost
              </Button>
            </Card>

            {/* Other Telcos Rate */}
            <Card className="bg-card p-8 rounded-[10px] border-line hover:border-primary transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-[10px] bg-paper text-muted font-bold text-xs border border-line">Other Operators</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-ink mb-2">Lyca & Others</h3>
                <div className="my-6">
                  <span className="text-4xl font-display font-extrabold text-primary font-mono">UGX 50</span>
                  <span className="text-xs text-muted ml-2">/ unique SMS</span>
                </div>
                <ul className="space-y-3 text-xs text-muted border-t border-line pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Fallback Carrier Routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Immutable Audit Log</span>
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCalculatorOpen(true)}
                className="mt-8"
              >
                <Calculator className="w-4 h-4" /> Estimate Other Telcos
              </Button>
            </Card>

          </div>

          {/* Calculator Callout Banner */}
          <Card className="bg-card p-8 rounded-[10px] border-line flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[10px] bg-paper text-primary border border-line flex items-center justify-center shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-ink">Want to calculate campaign costs in real time?</h4>
                <p className="text-muted text-sm mt-1">
                  Use our interactive Pay-As-You-Go calculator to preview costs for mixed telecom contact lists.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCalculatorOpen(true)}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                <Calculator className="w-4 h-4" /> Open Campaign Calculator
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Fund Wallet Now <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

        </div>
      </section>

      {/* PayAsYouGo Calculator Modal */}
      <PayAsYouGoModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onGetStarted={() => onOpenAuth('register')}
      />

      {/* Footer */}
      <footer className="mt-auto py-10 bg-ink text-paper text-xs border-t border-line/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-card font-display font-extrabold text-lg mb-2">
              <Building2 className="w-5 h-5 text-primary" /> Yo-Spaces B2B
            </div>
            <p className="text-paper/70 leading-relaxed text-xs">
              Connecting organizations and rural communities across Africa via 2G SMS, Voice, and USSD telephony infrastructure.
            </p>
          </div>

          <div>
            <h4 className="text-card font-display font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenAuth('register')} className="hover:text-primary transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Register Organization</button></li>
              <li><button onClick={() => onOpenAuth('login')} className="hover:text-primary transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Sign In</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-card font-display font-bold mb-3 uppercase tracking-wider text-[11px]">Company & Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-primary transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Contact Us</button></li>
              <li><button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-primary transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-primary transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-card font-display font-bold mb-3 uppercase tracking-wider text-[11px]">Support Line</h4>
            <p className="text-paper font-mono font-semibold mb-1">0394549920</p>
            <p className="text-paper/70">Kampala, Uganda</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-line/20 text-center text-paper/60">
          <p>© 2026 Yo-Spaces Technology Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};