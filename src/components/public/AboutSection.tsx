import React from 'react';
import { ASSETS } from '../../data/initialData';
import { Award, BookOpen, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Our Heritage & Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Empowering Generations Through Craftsmanship & Education
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Established in 1994, the Taleem-o-Hunar Society (THS) has championed vocational education, literacy, and sustainable livelihood programs for marginalized women across three decades.
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img
                src={ASSETS.heritageBuilding}
                alt="Taleem-o-Hunar Society and THS Medical Center building"
                className="w-full h-[380px] object-cover object-[center_55%]"
              />
            </div>
            {/* Heritage Badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 max-w-xs">
              <div className="text-xs font-bold text-[#166534] uppercase tracking-wider">Since 1994</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">30+ Years of Unwavering Community Trust</div>
              <p className="text-xs text-slate-500 mt-1">
                Rooted in service, equipping women with dignity, skills, and self-reliance.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold font-serif text-[#0b1c30]">
                About Taleem-o-Hunar Society & The Stitching Center
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The THS Stitching Center was established to bridge the gap between basic handicraft and market-ready professional garment design. Our center operates state-of-the-art industrial cutting tables, motorized Juki sewing units, overlock machines, and drafting spaces.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike informal teaching, our standardized curriculum guides women from basic needlework and measurements to high-end bridal attire, tailored frocks, and customer order management.
              </p>
            </div>

            {/* Purpose & Approach 3-Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0 font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Standardized Step-by-Step Curriculum</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Modular 4-level pathway ensuring complete mastery of drafting, cutting, stitching, and finishing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hands-on Mentorship Model</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Experienced master tailors and craftswomen provide one-on-one guidance on every seam and design.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Economic Independence</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Students take real client stitching orders through our center and earn direct income while learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Banner with Link to Stories */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#166534] to-[#0f4021] text-white p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-300">
                Championing Women Empowerment
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                "When you train a woman, you empower an entire household."
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Over 85% of our graduates now run home-based tailoring studios or fulfill retail orders, bringing financial resilience, children’s education support, and pride to their families.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('stories')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#166534] bg-white hover:bg-emerald-50 rounded-xl transition shadow-sm"
                >
                  <span>Read Graduate Success Stories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src={ASSETS.womenEmpowerment}
                  alt="Women learning stitching together at the THS workshop"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
