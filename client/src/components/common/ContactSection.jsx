import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    description: ''
  });

  const handleSubmit = (e) => {
    // Form action natively posts to getform.io or handles submission
    setSubmitted(true);
    toast.success('Your message has been submitted!');
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 text-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full shadow-sm">
            Contact Support & Enquiries
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-4">
            Connect With NEXUS 2026 Team
          </h2>
          <p className="text-slate-600 text-base">
            Have questions about paper submission, tracks, timeline, or participation? We're here to support you.
          </p>
        </div>

        {/* ── Two Column Layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* ── Left Column: Contact Links & Info ───────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Get in Touch</h3>
              <p className="text-sm text-slate-600 mb-8">Reach out directly to our organizing committee members and student coordinators.</p>

              <div className="space-y-6">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/hiet-techfusion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                    in
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-mono font-bold block">LinkedIn Page</span>
                    <span className="text-sm font-bold text-slate-900">hiet-techfusion</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:techfusion9560@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-mono font-bold block">Email Support</span>
                    <span className="text-sm font-bold text-slate-900">techfusion9560@gmail.com</span>
                  </div>
                </a>

                {/* Phone Coordinators */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs text-slate-500 uppercase font-mono font-bold block">Student Coordinators (Call / WhatsApp)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">Aman Gupta</p>
                      <p className="text-emerald-700 font-mono font-bold mt-0.5">+91 95603 89835</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">Anshu</p>
                      <p className="text-emerald-700 font-mono font-bold mt-0.5">+91 93106 43257</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>HIET Campus, Ghaziabad, Uttar Pradesh — 201015</span>
            </div>
          </div>

          {/* ── Right Column: Query Submission Form (Getform.io) ─────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Submit Your Query</h3>
              <p className="text-sm text-slate-600 mt-1">Fill out the form below. Your message will be sent directly to our support team.</p>
            </div>

            <form
              action="https://getform.io/f/bvnngjeb"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Query Subject / Reason *</label>
                <select
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="">Select Reason...</option>
                  <option value="Registration Issues">Registration Issues</option>
                  <option value="Paper Formatting Query">Paper Formatting Query</option>
                  <option value="Track Category Clarification">Track Category Clarification</option>
                  <option value="Schedule & Presentation">Schedule & Presentation</option>
                  <option value="Other Enquiries">Other Enquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your question or request in detail..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Query
              </button>
            </form>
          </div>

        </div>

        {/* ── Below Section: Interactive Google Map of HIET Ghaziabad ─────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">HIET Ghaziabad Campus Location Map</h3>
                <p className="text-xs text-slate-600">Offline Final Round Venue — 12th September 2026</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Hi-Tech+Institute+of+Engineering+and+Technology+Ghaziabad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Open in Google Maps App →
            </a>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200">
            <iframe
              title="HIET Ghaziabad Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4237190875416!2d77.49503457632612!3d28.676948982397123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2f70743f053%3A0xb366b6c0032a1062!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
};
