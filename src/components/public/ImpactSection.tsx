import React from 'react';
import { TrendingUp, Users, DollarSign, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  return (
    <section id="impact" className="py-20 bg-[#eff4ff]/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Measurable Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Community Transformation in Numbers
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our mission goes beyond teaching stitches; we measure success by generational empowerment, enhanced livelihoods, and female leadership.
          </p>
        </div>

        {/* 4 Large Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold font-serif text-[#166534]">5,000+</div>
            <div className="text-sm font-bold text-slate-900">Women Trained</div>
            <p className="text-xs text-slate-500">
              Vocational certificates awarded across 30 continuous years of community service.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold font-serif text-blue-700">85%</div>
            <div className="text-sm font-bold text-slate-900">Earning Rate</div>
            <p className="text-xs text-slate-500">
              Graduates generating active monthly income through boutiques or home tailoring.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold font-serif text-amber-700">+60%</div>
            <div className="text-sm font-bold text-slate-900">Income Uplift</div>
            <p className="text-xs text-slate-500">
              Average increase in monthly household income for families of trained artisans.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold font-serif text-purple-700">120+</div>
            <div className="text-sm font-bold text-slate-900">Studios Launched</div>
            <p className="text-xs text-slate-500">
              Independent home-based tailoring enterprises registered by our alumnae.
            </p>
          </div>
        </div>

        {/* Holistic Empowerment Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm">
          <h3 className="text-xl font-bold font-serif text-[#0b1c30] mb-6 text-center">
            How Vocational Skill Building Creates Lasting Change
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#166534] shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Children's Schooling & Health</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Direct artisan income is consistently reinvested into school fees, uniform purchases, and family nutritional security.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#166534] shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Financial Independence</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Trainees build independent bank accounts, save for emergencies, and reduce dependence on informal debt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#166534] shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Social Dignity & Leadership</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Women gain respect in their households and neighborhoods as skilled, income-earning master craftswomen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
