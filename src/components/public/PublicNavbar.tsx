import React, { useEffect, useState } from 'react';
import { ASSETS } from '../../data/initialData';
import { Menu, X, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

interface PublicNavbarProps {
  onOpenJoinModal: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenJoinModal,
  onOpenAdmin,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'journey', label: 'Journey' },
    { id: 'stories', label: 'Stories' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'impact', label: 'Impact' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_12px_40px_rgba(11,28,48,0.10)]' : 'shadow-none'
      }`}
    >
      <div className="bg-[#166534] text-emerald-100 text-[11px] tracking-[0.16em] uppercase">
        <div className="max-w-[88rem] mx-auto px-6 lg:px-10 h-9 flex items-center justify-between gap-4">
          <p className="truncate font-medium">Taleem-o-Hunar Society · Est. 1994 · Lahore</p>
          <div className="hidden md:flex items-center gap-5 text-emerald-50 tracking-[0.08em] normal-case">
            <span>Morning 9:00–1:00</span>
            <span className="w-px h-3 bg-white/30" />
            <span>Evening 2:00–6:00</span>
            <span className="w-px h-3 bg-white/30" />
            <a href="tel:+923004521890" className="inline-flex items-center gap-1.5 text-white hover:text-emerald-100 transition">
              <PhoneCall className="w-3 h-3" />
              +92 300 4521890
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-emerald-100">
        <div className="max-w-[88rem] mx-auto px-6 lg:px-10 h-[4.75rem] flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="w-12 h-12 rounded-full bg-white overflow-hidden shrink-0">
              <img
                src={ASSETS.logo}
                alt="Taleem-o-Hunar Society logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <span className="block font-serif text-[1.15rem] font-semibold text-[#166534] leading-none tracking-tight">
                THS Stitching Center
              </span>
              <span className="block mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-700/80">
                Vocational Atelier
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3 py-2 text-[13px] tracking-wide transition-colors ${
                    active ? 'text-[#166534] font-semibold' : 'text-slate-500 hover:text-[#166534]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-px ${
                      active ? 'bg-[#166534]' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-[12px] font-semibold text-[#166534] border border-emerald-200 hover:bg-emerald-50 rounded-full transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
              Admin
            </button>
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="inline-flex items-center gap-2 h-10 px-5 text-[12px] font-semibold text-white bg-[#166534] hover:bg-[#14532d] rounded-full transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              Join Program
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full border border-emerald-200 text-[#166534]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-full border border-emerald-200 text-[#166534]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-white px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2.5 text-sm rounded-xl ${
                  activeSection === link.id
                    ? 'text-[#166534] bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full h-11 rounded-full bg-[#166534] text-white text-sm font-semibold"
            >
              Join Program
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full h-11 rounded-full border border-emerald-200 text-sm font-semibold text-[#166534]"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
