import React from 'react';
import { ASSETS } from '../../data/initialData';
import { Sparkles, ArrowRight, Award, Users, Clock, Scissors, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenJoinModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoinModal, onNavigate }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-blue-100/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/50 text-[#166534] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vocational Training & Earning Center</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#0b1c30] tracking-tight leading-[1.15]">
              Empowering Women Through{' '}
              <span className="text-[#166534] italic font-medium">Skills & Opportunity</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Taleem-o-Hunar Society provides comprehensive hands-on training in professional tailoring, pattern drafting, frock styling, and bridal garment construction—turning everyday craft into lifelong financial independence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl transition shadow-lg shadow-emerald-900/10 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Join the Program</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate('curriculum')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-xs hover:border-slate-300"
              >
                <Scissors className="w-4 h-4 text-[#166534]" />
                <span>Explore Curriculum</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                <span>100% Free / Subsidized</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                <span>Certified Instructors</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                <span>Live Order Earnings</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Glow frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(22,101,52,0.16)] border-[3px] border-white ring-1 ring-emerald-200/80 bg-slate-900">
                <img
                  src={ASSETS.heroBanner}
                  alt="Women training on sewing machines at the THS Stitching Center"
                  className="w-full h-[440px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Workshop Class
                  </div>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Real Classroom Training at Taleem-o-Hunar Society
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    Trainees practising stitching, machine handling, and finishing in the THS vocational workshop.
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="absolute -top-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">50+ Trainees</div>
                  <div className="text-[11px] text-slate-500">Active in Current Batches</div>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-5 -right-5 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">30+ Years</div>
                  <div className="text-[11px] text-slate-500">Community Heritage (1994)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Card Bento Stats Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">50+ Trainees</div>
            <p className="text-xs text-slate-500 mt-1">
              Active vocational learners enrolled across morning & evening batches.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">2 Daily Sessions</div>
            <p className="text-xs text-slate-500 mt-1">
              Morning (9 AM - 1 PM) and Evening (2 PM - 6 PM) for flexible learning.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">100% Comprehensive</div>
            <p className="text-xs text-slate-500 mt-1">
              From basic machine threading to bridal couture and boutique order fulfillment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">Direct Income</div>
            <p className="text-xs text-slate-500 mt-1">
              Students earn stipends and customer stitching fees during advanced training.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
