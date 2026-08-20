import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PhoneCall,
  MessageSquare,
  Radio,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Building2,
  Calculator,
  Wallet,
  Coins,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { PayAsYouGoModal } from './PayAsYouGoModal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth = () => {}, onNavigate = () => {} }) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans ys-glow">
      <motion.section
        className="relative pt-16 pb-20 overflow-hidden"
        initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-7 border border-line">
                <Zap className="w-3.5 h-3.5" /> Built for Uganda · SMS, Voice & USSD
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-ink max-w-3xl leading-[1.05]">
                Reach every phone.
                <span className="block text-primary mt-2">Even the ones without internet.</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
                YoSpaces helps organizations send SMS, host voice spaces, and run USSD surveys —
                including basic 2G phones. Pay only for what you send from a prepaid wallet.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button variant="primary" size="lg" onClick={() => onOpenAuth('register')} className="text-base">
                  Create a free organization <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => onOpenAuth('login')} className="text-base">
                  Sign in to dashboard
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> No monthly plan</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="w-4 h-4 text-primary" /> Top up when you need it</span>
                <span className="inline-flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-primary" /> Works on feature phones</span>
              </div>
            </div>

            <Card className="p-6 sm:p-8 bg-card/90">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-4">How it works</p>
              <ol className="space-y-5">
                {[
                  { step: '01', title: 'Register your organization', body: 'One workspace for your team, members, and broadcasts.' },
                  { step: '02', title: 'Fund the prepaid wallet', body: 'Pay with PesaPal — Mobile Money or card — then credits appear.' },
                  { step: '03', title: 'Broadcast to every member', body: 'SMS, live voice PIN spaces, and USSD surveys in one dashboard.' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="font-display font-bold text-primary w-8 shrink-0">{item.step}</span>
                    <div>
                      <p className="font-display font-bold text-ink">{item.title}</p>
                      <p className="text-sm text-muted mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '2G ready', label: 'Feature phones included' },
              { value: 'UGX 40', label: 'Typical SMS on MTN / Airtel' },
              { value: 'Pay as you go', label: 'Credits never expire' },
              { value: 'One dashboard', label: 'SMS, voice, and USSD' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-3xl bg-card border border-line px-5 py-5">
                <p className="text-xl font-display font-extrabold text-ink">{metric.value}</p>
                <p className="text-xs text-muted mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="py-20 bg-card border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">The platform</p>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink">Three ways to talk to your community</h2>
            <p className="text-muted mt-3 text-base">Clear tools. No jargon. Built for cooperatives, NGOs, churches, and field teams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'Bulk SMS',
                body: 'Send the same update to every member at once — meetings, alerts, and notices with your organization name on the message.',
              },
              {
                icon: PhoneCall,
                title: 'Voice spaces',
                body: 'Host a live call that people join with a short PIN from any phone. Outbound calls can bring members in automatically.',
              },
              {
                icon: Radio,
                title: 'USSD surveys',
                body: 'Ask questions on a simple menu. Collect answers even when data is off, then see results in the dashboard.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="p-8 hover:border-primary/70 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-ink mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 ys-orange-wash border-b border-line relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-line text-primary text-xs font-semibold mb-4">
              <Coins className="w-3.5 h-3.5" /> Simple prepaid pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink">You only pay for messages you send</h2>
            <p className="text-muted mt-4 text-base leading-relaxed">
              No subscription. Load the wallet, send SMS, and the cost comes off your credits. Same campaign can mix MTN, Airtel, and other networks.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-line text-ink text-sm font-semibold">
              <Globe className="w-4 h-4 text-primary" />
              One list. Every network.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch mb-10">
            <Card className="p-8 flex flex-col justify-between hover:border-primary/70">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary-soft text-primary font-bold text-xs">MTN</span>
                <h3 className="text-2xl font-display font-bold text-ink mt-4">MTN Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-primary">UGX 40</span>
                  <span className="text-xs text-muted ml-2">per SMS</span>
                </div>
                <ul className="space-y-3 text-sm text-muted border-t border-line pt-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Fast local delivery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Duplicate numbers removed</li>
                </ul>
              </div>
              <Button variant="outline" size="md" onClick={() => setIsCalculatorOpen(true)} className="mt-8">
                <Calculator className="w-4 h-4" /> Estimate MTN cost
              </Button>
            </Card>

            <Card className="p-8 relative flex flex-col justify-between border-2 border-primary shadow-[0_20px_50px_-28px_rgba(240,122,26,0.65)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-wider">
                Most used
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-primary-soft text-primary font-bold text-xs">Airtel</span>
                <h3 className="text-2xl font-display font-bold text-ink mt-4">Airtel Uganda</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-primary">UGX 40</span>
                  <span className="text-xs text-muted ml-2">per SMS</span>
                </div>
                <ul className="space-y-3 text-sm text-muted border-t border-line pt-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Nationwide coverage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Wallet deducts in real time</li>
                </ul>
              </div>
              <Button variant="primary" size="md" onClick={() => setIsCalculatorOpen(true)} className="mt-8">
                <Calculator className="w-4 h-4" /> Estimate Airtel cost
              </Button>
            </Card>

            <Card className="p-8 flex flex-col justify-between hover:border-primary/70">
              <div>
                <span className="px-3 py-1 rounded-full bg-paper text-muted font-bold text-xs border border-line">Other networks</span>
                <h3 className="text-2xl font-display font-bold text-ink mt-4">Lyca & others</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-primary">UGX 50</span>
                  <span className="text-xs text-muted ml-2">per SMS</span>
                </div>
                <ul className="space-y-3 text-sm text-muted border-t border-line pt-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Routed automatically</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Full send history</li>
                </ul>
              </div>
              <Button variant="outline" size="md" onClick={() => setIsCalculatorOpen(true)} className="mt-8">
                <Calculator className="w-4 h-4" /> Estimate other networks
              </Button>
            </Card>
          </div>

          <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-ink text-card border-ink">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white">See what a campaign will cost</h4>
                <p className="text-white/70 text-sm mt-1">
                  Mix networks in the calculator, then open an account and top up when you are ready.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button variant="outline" size="md" onClick={() => setIsCalculatorOpen(true)} className="w-full sm:w-auto bg-transparent text-white border-white/20 hover:bg-white/10">
                <Calculator className="w-4 h-4" /> Open calculator
              </Button>
              <Button variant="primary" size="md" onClick={() => onOpenAuth('register')} className="w-full sm:w-auto">
                Get started <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <PayAsYouGoModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onGetStarted={() => onOpenAuth('register')}
      />

      <footer className="mt-auto py-12 bg-card text-ink text-sm border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-ink font-display font-extrabold text-lg mb-2">
              <Building2 className="w-5 h-5 text-primary" /> YoSpaces
            </div>
            <p className="text-muted leading-relaxed text-sm">
              Community messaging for organizations across Uganda — SMS, voice, and USSD that still work on 2G.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 uppercase tracking-wider text-[11px] text-muted">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenAuth('register')} className="hover:text-primary transition">Register organization</button></li>
              <li><button onClick={() => onOpenAuth('login')} className="hover:text-primary transition">Sign in</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 uppercase tracking-wider text-[11px] text-muted">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-primary transition">Contact</button></li>
              <li><button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-primary transition">Privacy</button></li>
              <li><button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-primary transition">Terms</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 uppercase tracking-wider text-[11px] text-muted">Support</h4>
            <p className="font-mono font-semibold mb-1">0394549920</p>
            <p className="text-muted">Kampala, Uganda</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-line text-center text-muted text-xs">
          <p>© 2026 YoSpaces. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
