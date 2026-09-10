import React from 'react';
import { ASSETS } from '../../data/initialData';
import { Quote, Sparkles, TrendingUp, Heart, Star } from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  const stories = [
    {
      name: 'Saima Parveen',
      batch: 'Graduate — Batch 2023-B',
      course: 'Advanced Garment & Bridal Couture',
      avatar: ASSETS.smilingArtisan,
      quote: 'Before joining THS, I had never touched an industrial sewing machine. Today, I operate a bustling home boutique with over 30 regular neighborhood clients, earning PKR 45,000 each month to pay for my children’s private school fees.',
      earningIncrease: 'PKR 45,000 / Mo',
      outcome: 'Home Boutique Owner'
    },
    {
      name: 'Fatima Noor',
      batch: 'Active Trainee — Batch 2024-A',
      course: 'Advanced Garment Making',
      avatar: ASSETS.studentAvatar2,
      quote: 'The instructors at THS gave me the precision to handle heavy bridal velvets and organzas. Stitching client orders directly through the center helped me pay off my family’s medical debts while still completing my training diploma.',
      earningIncrease: 'PKR 28,000 / Mo',
      outcome: 'Bridal Specialist & Lead Trainee'
    },
    {
      name: 'Maryam Saddiq',
      batch: 'Active Trainee — Batch 2024-B',
      course: 'Cutting & Pattern Drafting',
      avatar: ASSETS.studentAvatar1,
      quote: 'Learning how to draft zero-waste paper patterns transformed my speed. What used to take me two days to cut by trial-and-error now takes 45 minutes with absolute symmetry. I feel respected and proud of my craft.',
      earningIncrease: 'PKR 20,000 / Mo',
      outcome: 'Pattern Master Trainee'
    }
  ];

  return (
    <section id="stories" className="py-20 bg-[#eff4ff]/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <Heart className="w-3.5 h-3.5" />
            <span>Transforming Lives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Voices of Resilience & Success
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Real stories of our women artisans who converted dedication and vocational training into thriving financial independence and dignity.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top quote icon & stars */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote text */}
                <p className="text-sm text-slate-700 italic leading-relaxed pt-2">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                {/* Metric chip */}
                <div className="flex items-center justify-between bg-emerald-50/80 px-3.5 py-2 rounded-xl border border-emerald-200/60">
                  <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#166534]" />
                    Earning Impact:
                  </span>
                  <span className="text-xs font-bold text-[#166534]">
                    {story.earningIncrease}
                  </span>
                </div>

                {/* User Bio */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600/30"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{story.name}</h4>
                    <p className="text-xs text-emerald-700 font-medium">{story.outcome}</p>
                    <p className="text-[11px] text-slate-400">{story.batch}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
