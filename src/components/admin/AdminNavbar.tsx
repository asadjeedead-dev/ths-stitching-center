import React, { useState } from 'react';
import { AdminUser, StitchingOrder, PublicApplication } from '../../types';
import { 
  Menu, 
  Bell, 
  Search, 
  Calendar, 
  AlertTriangle, 
  UserPlus, 
  Scissors, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AdminNavbarProps {
  adminUser: AdminUser;
  activeTab: string;
  onOpenMobileSidebar: () => void;
  lateOrders: StitchingOrder[];
  pendingApplications: PublicApplication[];
  onNavigateTab: (tab: string) => void;
  onBackToPublic: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  adminUser,
  activeTab,
  onOpenMobileSidebar,
  lateOrders,
  pendingApplications,
  onNavigateTab,
  onBackToPublic,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Live operational metrics, order status, and student attendance' },
    students: { title: 'Student Management & Progress', subtitle: 'Student directory, vocational skill matrices, and profiles' },
    attendance: { title: 'Daily Attendance Register', subtitle: 'Morning & Evening session roll call and percentage tracking' },
    orders: { title: 'Stitching Orders & Delivery Tracking', subtitle: 'Order queue, late delivery calculations, and reason logs' },
    applications: { title: 'Public Admissions & Inquiries', subtitle: 'Review and approve public student registration requests' },
    reports: { title: 'Reports & Analytics', subtitle: 'Performance charts, on-time delivery rates, and student growth' },
    settings: { title: 'Center Settings & Data Tools', subtitle: 'Session preferences, admin profile, and data reset' },
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Management System', subtitle: 'THS Stitching Center' };
  const totalAlerts = lateOrders.length + pendingApplications.length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold font-serif text-[#0b1c30] leading-tight">
            {currentTabInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date, Notifications, Public Link, Avatar */}
      <div className="flex items-center gap-3">
        {/* Date chip */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-[#166534]" />
          <span>{todayFormatted}</span>
        </div>

        {/* Public Website Shortcut */}
        <button
          onClick={onBackToPublic}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#166534] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border border-emerald-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Center Action Alerts</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {totalAlerts} Active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Dismiss
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {/* Late Orders Alert List */}
                {lateOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('orders');
                    }}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 cursor-pointer transition"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900">{order.orderNumber}</span>
                        <span className="text-[10px] text-rose-700 font-bold bg-rose-200/70 px-1.5 py-0.5 rounded">
                          Late by {order.lateDays || 1}d
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 truncate">{order.customerName} — {order.garmentType}</p>
                      {order.lateDeliveryReason && (
                        <p className="text-[11px] text-rose-800 italic truncate mt-0.5">
                          Reason: {order.lateDeliveryReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pending Applications List */}
                {pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('applications');
                    }}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 cursor-pointer transition"
                  >
                    <UserPlus className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#166534]">New Applicant</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded">
                          {app.sessionPreference}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 truncate">{app.fullName} ({app.phone})</p>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    All operational items are currently on schedule.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={adminUser.avatarUrl}
            alt={adminUser.name}
            className="w-8 h-8 rounded-full object-cover border border-emerald-600/30"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">{adminUser.name}</div>
            <div className="text-[10px] text-slate-500">{adminUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
