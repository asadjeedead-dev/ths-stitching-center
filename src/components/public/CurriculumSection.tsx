import React, { useState } from 'react';
import { Scissors, Clock, BookOpen, CheckCircle, Sparkles, Layers, ChevronRight } from 'lucide-react';

interface CurriculumSectionProps {
  onOpenJoinModal: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenJoinModal }) => {
  const [activeLevel, setActiveLevel] = useState<number>(1);

  const levels = [
    {
      level: 1,
      title: 'Level 1: Basic Tailoring & Machine Mastery',
      duration: '4 Weeks',
      badge: 'Beginner',
      tagline: 'From complete novice to confident machine operator.',
      description: 'Covers essential foundations of sewing, machine anatomy, tension calibration, and essential hand stitches.',
      modules: [
        'Anatomy of Single Needle Industrial Lockstitch & Domestic Machines',
        'Needle selection, bobbin winding, and upper/lower thread tension tuning',
        'Precision paper & fabric stitching exercises (straight lines, curves, corners)',
        'Basic hand stitches: Hemming (Turpai), Basting (Kacha), and Buttonhole fastening',
        'Preventative maintenance, routine oiling, and common troubleshooting'
      ],
      skillsLearned: ['Machine Safety', 'Straight Seaming', 'Turpai & Basting', 'Tension Tuning', 'Basic Maintenance'],
      practicalProject: 'Produce 2 sample sampler cloths and complete a basic piped cushion cover.'
    },
    {
      level: 2,
      levelNum: 2,
      title: 'Level 2: Cutting & Pattern Drafting',
      duration: '6 Weeks',
      badge: 'Intermediate',
      tagline: 'Mastering the art of perfect fit, proportions, and fabric economics.',
      description: 'Deep dive into accurate human body measurements, drafting paper master patterns, and faultless fabric cutting.',
      modules: [
        'Standard human anatomy measurement protocols (Bust, Waist, Hip, Armhole, Inseam)',
        'Drafting proportional master flat patterns on craft paper using L-squares & curves',
        'Fabric grainline identification (warp, weft, bias) and shrinkage treatment',
        'Zero-waste marker layout, motif matching for printed and embroidered silks',
        'Shear handling and precision cutting without fabric distortion'
      ],
      skillsLearned: ['Body Measurements', 'Paper Pattern Drafting', 'Fabric Layouts', 'Motif Matching', 'Precision Cutting'],
      practicalProject: 'Draft and cut personalized patterns for standard Shalwar, Kurti, and Straight Trouser.'
    },
    {
      level: 3,
      levelNum: 3,
      title: 'Level 3: Intermediate Stitching & Everyday Wear',
      duration: '8 Weeks',
      badge: 'Proficient',
      tagline: 'Assembling complete market-standard traditional and modern attire.',
      description: 'Focuses on structured garment assembly, neckline styling, sleeve attachment, and edge finishes.',
      modules: [
        'Classic Kameez construction with side slits (chaak) and clean French seams',
        'Neckline variations: Ban collar, Mandarin collar, Round neck, V-placket with lace',
        'Trouser varieties: Straight cigarette pants, Tulip shalwar, and Elasticated waistbands',
        'Concealed and standard zipper insertion, hook-and-eye closures, and fabric loop buttons',
        'Interfacing application (fuse buckram) for crisp collars, cuffs, and button stands'
      ],
      skillsLearned: ['Kameez Construction', 'Collar & Neckline Design', 'Pants Assembly', 'Zipper & Placket', 'Finishing & Pressing'],
      practicalProject: 'Stitch 3 full sets of stitched 2-piece and 3-piece casual/semi-formal suits.'
    },
    {
      level: 4,
      levelNum: 4,
      title: 'Level 4: Advanced Garment Making, Bridal & Frocks',
      duration: '12 Weeks',
      badge: 'Advanced Couture',
      tagline: 'High-end occasion wear, bridal silhouettes, and boutique-grade finishes.',
      description: 'Specialized training for premium bespoke orders, wedding wear, tiered frocks, and commercial studio execution.',
      modules: [
        'Multi-kali Anarkali, Umbrella Flare gowns, and pleated modern Maxis',
        'Bridal Lehnga construction, can-can net stiffening, and heavy border application',
        'Padded choli & blouse drafting with princess seams and deep back support',
        'Handling delicate bridal fabrics: Velvet, Organza, Net, Pure Chiffon, and Brocade',
        'Boutique client consultation, fitting adjustment, alterations, and cost estimation'
      ],
      skillsLearned: ['Bridal Lehnga & Choli', 'Can-Can Skirts', 'Multi-Kali Frocks', 'Delicate Fabrics', 'Costing & Pricing'],
      practicalProject: 'Design and craft 1 complete bridal/formal outfit ready for exhibition or commercial sale.'
    }
  ];

  const currentLevelData = levels.find((l) => l.level === activeLevel) || levels[0];

  return (
    <section id="curriculum" className="py-20 bg-[#f8f9ff] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#166534] text-xs font-bold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured Training Program</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0b1c30] tracking-tight">
            Comprehensive 4-Stage Vocational Curriculum
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our progressively tiered courses ensure every trainee develops both technical precision and creative confidence, preparing them for independent professional practice.
          </p>
        </div>

        {/* Level Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {levels.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => setActiveLevel(lvl.level)}
              className={`text-left p-4 rounded-2xl transition-all border ${
                activeLevel === lvl.level
                  ? 'bg-[#166534] text-white border-[#166534] shadow-lg shadow-emerald-950/10'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${activeLevel === lvl.level ? 'text-emerald-200' : 'text-emerald-700'}`}>
                  Stage {lvl.level}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  activeLevel === lvl.level ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {lvl.duration}
                </span>
              </div>
              <div className="text-sm font-bold mt-2 truncate">
                {lvl.title.split(':')[1] || lvl.title}
              </div>
            </button>
          ))}
        </div>

        {/* Level Detailed Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200 text-xs font-bold">
                  {currentLevelData.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  Duration: {currentLevelData.duration}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b1c30]">
                  {currentLevelData.title}
                </h3>
                <p className="text-base text-emerald-800 font-medium mt-1">
                  {currentLevelData.tagline}
                </p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentLevelData.description}
                </p>
              </div>

              {/* Modules List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#166534]" />
                  Key Modules & Hands-on Practicals
                </h4>
                <div className="space-y-2.5">
                  {currentLevelData.modules.map((mod, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card / Practical Project & Skills */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
                  Core Competencies Mastered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentLevelData.skillsLearned.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <div className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-1">
                  Capstone Practical Project
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentLevelData.practicalProject}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenJoinModal}
                  className="w-full py-3.5 text-center text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Apply for This Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
