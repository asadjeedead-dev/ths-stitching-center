import React, { useState } from 'react';
import { AdminUser } from '../../types';
import { clearAllData } from '../../services/storage';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Settings, 
  RotateCcw, 
  Database, 
  Building2, 
  User, 
  ShieldCheck, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface SettingsViewProps {
  adminUser: AdminUser;
  studentsCount: number;
  ordersCount: number;
  attendanceCount: number;
  applicationsCount: number;
  inquiriesCount: number;
  onDataReset: () => void;
  onSuccessToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  adminUser,
  studentsCount,
  ordersCount,
  attendanceCount,
  applicationsCount,
  inquiriesCount,
  onDataReset,
  onSuccessToast,
}) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmReset = async () => {
    try {
      await clearAllData();
      setIsResetModalOpen(false);
      onDataReset();
      onSuccessToast('All Firebase records were cleared. The dashboard now shows live empty collections.');
    } catch {
      setIsResetModalOpen(false);
      onSuccessToast('Could not clear Firebase records. Check Firestore rules and try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Center Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900">
              Center Profile & Operational Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Taleem-o-Hunar Society Vocational Stitching Facility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
            <span className="font-bold text-slate-700 block">Facility Location</span>
            <p className="text-slate-600">Main Campus, Shalimar Link Road, Mughalpura, Lahore, Pakistan</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
            <span className="font-bold text-slate-700 block">Operating Hours</span>
            <p className="text-slate-600">Morning Session: 09:00 AM – 01:00 PM<br />Evening Session: 02:00 PM – 06:00 PM</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900">
              Active Administrator Session
            </h3>
            <p className="text-xs text-slate-500">
              Signed in as Center Administrator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
          <img
            src={adminUser.avatarUrl}
            alt={adminUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="text-xs space-y-1">
            <div className="text-base font-bold text-slate-900">{adminUser.name}</div>
            <div className="text-slate-500">{adminUser.email}</div>
            <div className="inline-flex items-center gap-1 font-bold text-[#166534] bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              <span>{adminUser.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Data Storage & Seed Reset */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900">
                Data Persistence & System Reset
              </h3>
              <p className="text-xs text-slate-500">
                Manage browser LocalStorage state and reset test scenarios.
              </p>
            </div>
          </div>
        </div>

        {/* Counts summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center">
            <div className="text-slate-500 font-semibold">Trainee Records</div>
            <div className="text-lg font-bold text-slate-900">{studentsCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center">
            <div className="text-slate-500 font-semibold">Stitching Orders</div>
            <div className="text-lg font-bold text-slate-900">{ordersCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center">
            <div className="text-slate-500 font-semibold">Attendance Logs</div>
            <div className="text-lg font-bold text-slate-900">{attendanceCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center">
            <div className="text-slate-500 font-semibold">Applications</div>
            <div className="text-lg font-bold text-slate-900">{applicationsCount}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center">
            <div className="text-slate-500 font-semibold">Contact Messages</div>
            <div className="text-lg font-bold text-slate-900">{inquiriesCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-rose-900">
            <span className="font-bold block text-rose-950">Clear live Firebase records:</span>
            Permanently deletes students, orders, attendance, applications, contact messages, and activity stored in Firestore. This does not restore dummy data.
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition inline-flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Firebase Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Clear Firebase Data"
        message="This permanently deletes live Firestore records for students, orders, attendance, applications, contact messages, and activity. Dummy seed data will not be restored."
        confirmLabel="Clear Everything"
        isDestructive
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
