import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, User, Phone, MapPin, Calendar, BookOpen, Send } from 'lucide-react';
import { submitApplication } from '../../services/storage';
import { FIRESTORE_RULES_CONSOLE_URL, FIRESTORE_DATA_CONSOLE_URL, firebaseErrorMessage } from '../../services/firebase';
import { SessionType } from '../../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: 22,
    address: '',
    sessionPreference: 'Morning' as SessionType,
    previousExperience: 'None (Beginner)' as const,
    interestedProgram: 'Basic Tailoring & Pattern Cutting',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) return;

    setLoading(true);
    setFormError('');
    try {
      await submitApplication({
        fullName: formData.fullName,
        phone: formData.phone,
        age: Number(formData.age),
        address: formData.address,
        sessionPreference: formData.sessionPreference,
        previousExperience: formData.previousExperience,
        interestedProgram: formData.interestedProgram,
        message: formData.message,
      });
      setSubmitted(true);
      onSuccessToast(`Registration application submitted for ${formData.fullName}! Our coordinator will reach out.`);
    } catch (error) {
      setFormError(
        firebaseErrorMessage(error, 'Could not save your application to Firebase. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      age: 22,
      address: '',
      sessionPreference: 'Morning',
      previousExperience: 'None (Beginner)',
      interestedProgram: 'Basic Tailoring & Pattern Cutting',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900">Application Received!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.fullName}</strong>. Your application for the <strong>{formData.sessionPreference} Session</strong> has been recorded in the THS admissions system.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left max-w-md mx-auto space-y-1">
              <div className="font-bold">Next Steps:</div>
              <div>• Our admissions coordinator will verify seat availability.</div>
              <div>• You will receive a confirmation call on {formData.phone}.</div>
              <div>• Orientation & tool kit collection begins prior to batch commencement.</div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions Form</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#0b1c30]">
                Join the THS Stitching Program
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please complete your details below to apply for subsidized vocational training.
              </p>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parveen Bibi"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min={14}
                  max={65}
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preferred Session *
                </label>
                <select
                  value={formData.sessionPreference}
                  onChange={(e) => setFormData({ ...formData, sessionPreference: e.target.value as SessionType })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                >
                  <option value="Morning">Morning (9:00 AM – 1:00 PM)</option>
                  <option value="Evening">Evening (2:00 PM – 6:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Residential Address & Area *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Street 3, Mughalpura, Lahore"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Prior Stitching Experience
                </label>
                <select
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                >
                  <option value="None (Beginner)">None (Complete Beginner)</option>
                  <option value="Basic Hand Stitching">Basic Hand Stitching</option>
                  <option value="Machine Experience">Basic Machine Operation</option>
                  <option value="Intermediate">Intermediate Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Training Program
                </label>
                <select
                  value={formData.interestedProgram}
                  onChange={(e) => setFormData({ ...formData, interestedProgram: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none"
                >
                  <option value="Basic Tailoring & Pattern Cutting">Basic Tailoring & Pattern Cutting</option>
                  <option value="Intermediate Stitching">Intermediate Stitching & Everyday Wear</option>
                  <option value="Advanced Garments & Bridal Wear">Advanced Garments, Frocks & Bridal</option>
                  <option value="Hand Embroidery & Finishing">Hand Embroidery & Finishing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Motivation / Why do you want to learn?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. I want to earn an independent income to support my children's education..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-center text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Application...' : 'Submit Application Now'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
