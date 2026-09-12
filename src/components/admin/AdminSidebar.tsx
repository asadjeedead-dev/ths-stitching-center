import React from 'react';
import { ASSETS } from '../../data/initialData';
import { AdminUser } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Scissors, 
  FileText, 
  MessageSquare,
  BarChart3, 
  Settings, 
  Globe, 
  LogOut, 
  X
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onBackToPublic: () => void;
  adminUser: AdminUser;
  lateOrdersCount: number;
  pendingAppsCount: number;
  pendingInquiriesCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onAddStudent: () => void;
  onAddOrder: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onBackToPublic,
  adminUser,
  lateOrdersCount,
  pendingAppsCount,
  pendingInquiriesCount,
  mobileOpen,
  onCloseMobile,
  onAddStudent,
  onAddOrder,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
    { 
      id: 'orders', 
      label: 'Stitching Orders', 
      icon: Scissors, 
      badge: lateOrdersCount > 0 ? `${lateOrdersCount} Late` : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    { 
      id: 'applications', 
      label: 'Public Applications', 
      icon: FileText, 
      badge: pendingAppsCount > 0 ? `${pendingAppsCount} New` : undefined,
      badgeColor: 'bg-emerald-600 text-white font-semibold'
    },
    {
      id: 'inquiries',
      label: 'Contact Messages',
      icon: MessageSquare,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} New` : undefined,
      badgeColor: 'bg-sky-600 text-white font-semibold'
    },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0b1c30] text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden shrink-0 shadow-xs">
            <img
              src={ASSETS.logo}
              alt="Taleem-o-Hunar Society logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="block text-sm font-bold font-serif text-white tracking-tight leading-tight">
              THS Center
            </span>
            <span className="block text-[11px] font-medium text-emerald-400">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#166534] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>

              {item.id === 'students' && isActive && (
                <div className="ml-8 space-y-0.5">
                  <button
                    onClick={() => handleSelect('students')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70"
                  >
                    All Students
                  </button>
                  <button
                    onClick={() => {
                      onAddStudent();
                      onCloseMobile();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70"
                  >
                    Add Student
                  </button>
                </div>
              )}

              {item.id === 'orders' && isActive && (
                <div className="ml-8 space-y-0.5">
                  <button
                    onClick={() => handleSelect('orders')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70"
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => {
                      onAddOrder();
                      onCloseMobile();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/70"
                  >
                    New Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* Switch to Public Site */}
        <button
          onClick={onBackToPublic}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition border border-slate-800"
        >
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">View Public Website</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={adminUser.avatarUrl || ASSETS.adminAvatar}
              alt={adminUser.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/50 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{adminUser.name}</div>
              <div className="text-[10px] text-emerald-400 truncate">{adminUser.role}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
          ></div>
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
