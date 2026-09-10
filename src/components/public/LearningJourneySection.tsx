import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Award, DollarSign, BookOpen, Scissors, Check } from 'lucide-react';

interface LearningJourneyProps {
  onOpenJoinModal: () => void;
}

export const LearningJourneySection: React.FC<LearningJourneyProps> = ({ onOpenJoinModal }) => {
  const steps = [
    {
      step: '01',
      title: 'Enrollment & Skill Assessment',
      icon: BookOpen,
      time: 'Day 1 - Week 1',
      description: 'Orientation on workshop safety, tool kit allocation, machine ergonomic setup, and morning/evening batch assignment.',
      highlights: ['Free Starter Toolkit', 'Industrial Machine Orientation', 'Batch Schedule Assignment'],
    },
    {
      step: '02',
      title: 'Precision Drafting & Cutting',
      icon: Scissors,
      time: 'Weeks 2 - 6',
      description: 'Taking measurements, geometry of body curves, master paper patterns, and flawless fabric scissor cutting.',
      highlights: ['Master Pattern Drafting', 'Zero-Waste Cutting', 'Motif & Stripe Alignment'],
    },
    {
      step: '03',
      title: 'Structured Garment Assembly',
      icon: CheckCircle2,
      time: 'Weeks 7 - 14',
      description: 'Sewing complete Shalwar Kameez suits, necklines, ban collars, piping, invisible zippers, and elasticated trousers.',
      highlights: ['Flawless Seams & Piping', 'Collar & Placket Mastery', 'Trouser & Sleeve Fitting'],
    },
    {
      step: '04',
      title: 'Bridal, Maxis & Couture Frocks',
      icon: Sparkles,
      time: 'Weeks 15 - 24',
      description: 'Advanced couture construction for multi-kali frocks, party maxis, padded cholis, and heavy bridal Lehngas.',
      highlights: ['Can-Can Flare Structuring', 'Bridal Fabric Handling', 'Custom Fit Alterations'],
    },
    {
      step: '05',
      title: 'Live Client Orders & Earning',
      icon: DollarSign,
      time: 'Ongoing & Graduation',
      description: 'Trainees take real customer orders through the THS Stitching Center, earn direct stitching fees, and prepare for boutique launch.',
      highlights: ['Direct Stitching Income', 'THS Certified Diploma', 'Independent Business Mentorship'],
    },
  ];

  return (
    <section id="journey" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Path to Independence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            The Trainee Learning Journey
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            From first threading a needle to executing bespoke bridal orders, our clear 5-step milestone pathway guarantees tangible skill progression and sustainable earning potential.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          {/* Vertical connecting line on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-emerald-100 transform -translate-x-1/2"></div>

          <div className="space-y-12 relative">
            {steps.map((item, index) => {
              const isEven = index % 2 === 1;
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Box */}
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-[#f8f9ff] p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
                      <div className={`flex items-center gap-2.5 mb-2 ${isEven ? 'lg:justify-end' : ''}`}>
                        <span className="text-xs font-bold text-[#166534] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Milestone {item.step}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {item.time}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif text-[#0b1c30] mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className={`flex flex-wrap gap-2 ${isEven ? 'lg:justify-end' : ''}`}>
                        {item.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs"
                          >
                            <Check className="w-3 h-3 text-[#166534]" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle Milestone Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-[#166534] text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/20 border-4 border-white z-10">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Empty Spacer on large screens to balance grid */}
                  <div className="hidden lg:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-emerald-50 p-6 rounded-3xl border border-emerald-200 max-w-2xl mx-auto">
            <div className="text-left flex-1">
              <h4 className="text-base font-bold text-[#166534]">Ready to Begin Your Journey?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                New batches begin at the start of every month. Limited seats per morning/evening session.
              </p>
            </div>
            <button
              onClick={onOpenJoinModal}
              className="px-6 py-3 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition shrink-0 inline-flex items-center gap-2"
            >
              <span>Apply Online Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
