import React, { useState } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { CurriculumSection } from './CurriculumSection';
import { LearningJourneySection } from './LearningJourneySection';
import { SuccessStoriesSection } from './SuccessStoriesSection';
import { GallerySection } from './GallerySection';
import { ImpactSection } from './ImpactSection';
import { ContactSection } from './ContactSection';
import { PublicFooter } from './PublicFooter';
import { JoinModal } from './JoinModal';
import { Toast, ToastMessage } from '../common/Toast';

interface PublicWebsiteProps {
  onGoToAdmin: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onGoToAdmin }) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeSection, setActiveSection] = useState('home');

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onCloseToast={removeToast} />

      {/* Navigation Bar */}
      <PublicNavbar
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenAdmin={onGoToAdmin}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
          onNavigate={handleNavigate}
        />

        <AboutSection onNavigate={handleNavigate} />

        <CurriculumSection onOpenJoinModal={() => setIsJoinModalOpen(true)} />

        <LearningJourneySection onOpenJoinModal={() => setIsJoinModalOpen(true)} />

        <SuccessStoriesSection />

        <GallerySection />

        <ImpactSection />

        <ContactSection />
      </main>

      {/* Footer */}
      <PublicFooter
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenAdmin={onGoToAdmin}
        onNavigate={handleNavigate}
      />

      {/* Admissions Registration Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccessToast={(msg) => addToast(msg, 'success')}
      />
    </div>
  );
};
