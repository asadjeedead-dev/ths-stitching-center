/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdminUser } from './types';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { logoutAdmin, subscribeToAuth } from './services/auth';
import './services/firebase';

function readAdminHash(): boolean {
  return window.location.hash.replace('#', '') === 'admin';
}

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => (
    readAdminHash() ? 'admin' : 'public'
  ));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubAuth = subscribeToAuth((user) => {
      setAdminUser(user);
      setAuthReady(true);
    });

    const onHashChange = () => {
      setCurrentView(readAdminHash() ? 'admin' : 'public');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      unsubAuth();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const handleGoToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setAdminUser(null);
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleBackToPublic = () => {
    window.location.hash = '';
    setCurrentView('public');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {currentView === 'public' && (
        <PublicWebsite onGoToAdmin={handleGoToAdmin} />
      )}

      {currentView === 'admin' && (
        !authReady ? (
          <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] text-sm text-slate-500">
            Connecting to Firebase...
          </div>
        ) : adminUser ? (
          <AdminLayout
            adminUser={adminUser}
            onLogout={handleLogout}
            onBackToPublic={handleBackToPublic}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToPublic={handleBackToPublic}
          />
        )
      )}
    </div>
  );
}
