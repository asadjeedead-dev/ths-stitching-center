import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { ASSETS } from '../../data/initialData';
import { submitInquiry } from '../../services/storage';
import { FIRESTORE_RULES_CONSOLE_URL, FIRESTORE_DATA_CONSOLE_URL, firebaseErrorMessage } from '../../services/firebase';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setLoading(true);
    setFormError('');
    try {
      await submitInquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        area: formData.area.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      setFormError(
        firebaseErrorMessage(error, 'Could not save your message. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Visit Our Center or Send an Inquiry
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Have questions about admissions, batch availability, order placement, or vocational sponsorship? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={ASSETS.centerBuilding}
                alt="Taleem-o-Hunar Society building"
                className="w-full h-52 object-cover object-[center_55%]"
              />
              <div className="px-4 py-3 bg-[#f8f9ff] border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Visit the THS Vocational Complex</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Taleem-o-Hunar Society & THS Medical Center</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8f9ff] border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Center Address</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Taleem-o-Hunar Society (THS) Main Vocational Complex, Near Shalimar Gardens / GT Road, Lahore, Pakistan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8f9ff] border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Helpline & Admissions</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Mobile / WhatsApp: <a href="tel:+923004521890" className="font-semibold text-[#166534] hover:underline">+92 300 4521890</a>
                </p>
                <p className="text-xs text-slate-600">
                  Landline: +92 42 36812345
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8f9ff] border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Official Email</h4>
                <p className="text-xs text-slate-600 mt-1">
                  General: <a href="mailto:info@taleem-o-hunar.org" className="font-semibold text-[#166534] hover:underline">info@taleem-o-hunar.org</a>
                </p>
                <p className="text-xs text-slate-600">
                  Admissions: admissions@ths-stitching.org
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8f9ff] border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Training Session Timings</h4>
                <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">Morning Batch: 9:00 AM – 1:00 PM (Mon - Thu)</div>
                  <div className="font-medium text-slate-800">Evening Batch: 2:00 PM – 6:00 PM (Mon - Thu)</div>
                  <div>Friday: 9:00 AM – 12:30 PM (Review & Maintenance)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-[#f8f9ff] p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">Thank You for Your Message!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been received. Our coordinator will contact you at <strong>{formData.phone}</strong> during center operating hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormError('');
                    setFormData({ name: '', phone: '', area: '', message: '' });
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold font-serif text-[#0b1c30]">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-slate-500">
                  Fill out the form below and we will get back to you within 24 hours.
                </p>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 space-y-1">
                    <div>{formError}</div>
                    {/Firestore rules/i.test(formError) && (
                      <div className="space-x-3">
                        <a
                          href={FIRESTORE_RULES_CONSOLE_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block underline underline-offset-2"
                        >
                          Open Firestore Rules and Publish
                        </a>
                        <a
                          href={FIRESTORE_DATA_CONSOLE_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block underline underline-offset-2"
                        >
                          Open Firestore Data
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Tariq"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Residential Area / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mughalpura, Lahore"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Message or Question
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your questions regarding admissions, batch start dates, or order inquiries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-center text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
