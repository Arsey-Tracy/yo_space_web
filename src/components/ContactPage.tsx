import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
}

import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ContactPageProps {
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
    inquiryType: 'general',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      {/* Hero Header */}
      <section className="bg-ink text-paper py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-paper/10 border border-line/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> 24/7 Enterprise Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-card mb-4">
            Get in Touch with <span className="text-primary">Yo-Spaces</span>
          </h1>
          <p className="text-paper/90 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Have questions about enterprise deployments, custom SMS sender IDs, or integrating 2G Voice & USSD into your organization? We’re here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="space-y-6">
            <Card className="p-6 shadow-xs border-line hover:border-primary transition">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-4 border border-line">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-ink mb-1">Phone & Toll-Free</h3>
              <p className="text-sm text-muted mb-3">Reach our regional communications desk directly.</p>
              <a href="tel:0394549920" className="text-primary font-mono font-semibold text-sm hover:underline block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                0394549920(Voice Line)
              </a>
              <span className="text-xs text-muted block mt-1">Mon–Fri: 8:00 AM – 6:00 PM EAT</span>
            </Card>

            <Card className="p-6 shadow-xs border-line hover:border-primary transition">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-4 border border-line">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-ink mb-1">Email Support</h3>
              <p className="text-sm text-muted mb-3">Send us an email for general or technical inquiries.</p>
              <a href="mailto:support@yospaces.org" className="text-primary font-semibold text-sm hover:underline block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                support@yospaces.com
              </a>
              <a href="mailto:sales@yospaces.org" className="text-primary font-semibold text-sm hover:underline block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                sales@yospaces.com
              </a>
            </Card>

            <Card className="p-6 shadow-xs border-line hover:border-primary transition">
              <div className="w-12 h-12 rounded-[10px] bg-paper text-primary flex items-center justify-center mb-4 border border-line">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-ink mb-1">Headquarters</h3>
              <p className="text-sm text-muted leading-relaxed">
                Yo-Spaces Technology Hub<br />
                National ICT Innovation Hub<br />
                Kampala, Uganda. Nakawa
              </p>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <Card className="lg:col-span-2 p-6 sm:p-8 shadow-xs border-line">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-[10px] bg-paper text-success border border-line flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-bold text-ink">Message Received!</h3>
                <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for reaching out to Yo-Spaces. Our team will review your inquiry and get back to you within 24 hours.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', organization: '', message: '', inquiryType: 'general' });
                  }}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-display font-bold text-ink mb-1">Send Us a Message</h2>
                  <p className="text-muted text-sm">Fill in the form below and our regional team will respond promptly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Namubiru"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@organization.org"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+256 700 000 000"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Organization Name
                    </label>
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Farmers Cooperative"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-line bg-paper text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Wallet Billing</option>
                    <option value="sender_id">Custom Sender ID Purchase (v2)</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can assist your organization..."
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-line text-sm bg-paper text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>

        </div>
      </section>
    </div>
  );
};
