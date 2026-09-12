import React from 'react';
import { ASSETS } from '../../data/initialData';
import { ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenJoinModal: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigate,
  onOpenAdmin,
  onOpenJoinModal,
}) => {
  return (
    <footer className="relative bg-[#0b1c30] text-slate-300 pt-16 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={ASSETS.centerBuilding}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_70%] opacity-18"
        />
        <div className="absolute inset-0 bg-[#0b1c30]/88" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white overflow-hidden shrink-0">
                <img
                  src={ASSETS.logo}
                  alt="Taleem-o-Hunar Society logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-white tracking-tight">
                  THS Stitching Center
                </span>
                <span className="block text-xs text-emerald-400 font-medium">
                  Taleem-o-Hunar Society — Est. 1994
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering women through structured vocational cutting, tailoring, and couture garment construction. Building pathways toward self-reliance and dignity for 30+ years.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenJoinModal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-emerald-700 rounded-xl transition"
              >
                Apply for Next Batch
              </button>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {['home', 'about', 'curriculum', 'journey', 'stories', 'gallery', 'impact', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => onNavigate(id)}
                    className="hover:text-white capitalize transition text-slate-400"
                  >
                    {id === 'journey' ? 'Learning Journey' : id === 'stories' ? 'Success Stories' : id === 'about' ? 'About Us' : id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Timings & Sessions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Batch Schedules
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-white font-semibold">Morning Session</div>
                <div className="text-emerald-400">9:00 AM – 1:00 PM</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Monday through Thursday</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-white font-semibold">Evening Session</div>
                <div className="text-emerald-400">2:00 PM – 6:00 PM</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Monday through Thursday</div>
              </div>
            </div>
          </div>

          {/* Col 5: Contact & Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Administration
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+92 300 4521890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>info@taleem-o-hunar.org</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Shalimar Link Road, Lahore</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Staff & Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 1994 – {new Date().getFullYear()} Taleem-o-Hunar Society (THS). All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for Women Empowerment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
