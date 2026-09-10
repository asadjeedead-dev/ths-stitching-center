import React, { useState } from 'react';
import { PublicApplication, ApplicationStatus, Student } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Search, 
  Phone, 
  MapPin, 
  Calendar, 
  UserCheck, 
  UserX, 
  Eye, 
  X, 
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ApplicationsViewProps {
  applications: PublicApplication[];
  students: Student[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
  onEnrollApplicantAsStudent: (app: PublicApplication) => void;
  onSuccessToast: (msg: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  students,
  onUpdateStatus,
  onDeleteApplication,
  onEnrollApplicantAsStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingApp, setViewingApp] = useState<PublicApplication | null>(null);
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      app.status === statusFilter ||
      (statusFilter === 'New' && (app.status === 'New' || app.status === 'Pending')) ||
      (statusFilter === 'Accepted' && (app.status === 'Accepted' || app.status === 'Approved'));
    return matchesSearch && matchesStatus;
  });

  const isEnrolled = (app: PublicApplication) => {
    const phone = (app.phone || '').replace(/\D/g, '');
    return students.some((student) => {
      if (student.applicationId && student.applicationId === app.id) return true;
      return phone.length >= 7 && (student.phone || '').replace(/\D/g, '') === phone;
    });
  };

  const handleApproveAndEnroll = (app: PublicApplication) => {
    onEnrollApplicantAsStudent(app);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant name, phone, or neighborhood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'New', 'Reviewed', 'Accepted', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === status
                    ? 'bg-[#166534] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All Applications' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3.5 font-semibold">Applicant Name</th>
                <th className="pb-3.5 font-semibold">Contact & Age</th>
                <th className="pb-3.5 font-semibold">Preferred Session</th>
                <th className="pb-3.5 font-semibold">Desired Program</th>
                <th className="pb-3.5 font-semibold">Prior Experience</th>
                <th className="pb-3.5 font-semibold">Status</th>
                <th className="pb-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4">
                    <div className="font-bold text-slate-900">{app.fullName}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{app.address}</div>
                  </td>

                  <td className="py-4 text-xs">
                    <div className="font-bold text-slate-800">{app.phone}</div>
                    <div className="text-slate-500">Age: {app.age} yrs</div>
                  </td>

                  <td className="py-4 text-xs">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold ${
                      app.sessionPreference === 'Morning'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {app.sessionPreference}
                    </span>
                  </td>

                  <td className="py-4 text-xs font-medium text-slate-800">
                    {app.interestedProgram}
                  </td>

                  <td className="py-4 text-xs text-slate-600">
                    {app.previousExperience}
                  </td>

                  <td className="py-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>

                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingApp(app)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-emerald-50 transition"
                        title="View Full Application"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {app.status === 'New' || app.status === 'Pending' || app.status === 'Reviewed' ? (
                        <>
                          <button
                            onClick={() => onUpdateStatus(app.id, 'Reviewed')}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200"
                          >
                            Reviewed
                          </button>
                          <button
                            onClick={() => handleApproveAndEnroll(app)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-2xs transition"
                            title="Approve & Enroll"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Enroll</span>
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, 'Rejected')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Decline Application"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (app.status === 'Accepted' || app.status === 'Approved') && !isEnrolled(app) ? (
                        <button
                          onClick={() => handleApproveAndEnroll(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] shadow-2xs transition"
                          title="Create student record"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Enroll</span>
                        </button>
                      ) : null}
                      <button
                        onClick={() => setDeletingAppId(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    {applications.length === 0 ? 'No applications found.' : 'No admission applications found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingApp(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#166534]">Admission Inquiry</span>
                  <h3 className="text-xl font-bold font-serif text-slate-900">{viewingApp.fullName}</h3>
                </div>
                <StatusBadge status={viewingApp.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium">Contact Phone:</div>
                  <div className="font-bold text-slate-900">{viewingApp.phone}</div>
                  <div className="text-slate-600">Age: {viewingApp.age} years</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400 font-medium">Preferred Session:</div>
                  <div className="font-bold text-[#166534]">{viewingApp.sessionPreference}</div>
                  <div className="text-slate-600">Applied: {viewingApp.submittedAt.split('T')[0]}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-xs">
                <div className="text-slate-400 font-medium">Residential Address:</div>
                <div className="font-medium text-slate-800">{viewingApp.address}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-xs">
                <div className="text-slate-400 font-medium">Prior Experience & Goal:</div>
                <div className="font-medium text-slate-800">{viewingApp.previousExperience} — {viewingApp.interestedProgram}</div>
              </div>

              {viewingApp.message && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                  <span className="font-bold block mb-0.5">Applicant Motivation:</span>
                  "{viewingApp.message}"
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setViewingApp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                {(viewingApp.status === 'Pending' ||
                  viewingApp.status === 'New' ||
                  viewingApp.status === 'Reviewed' ||
                  ((viewingApp.status === 'Accepted' || viewingApp.status === 'Approved') && !isEnrolled(viewingApp))) && (
                  <button
                    onClick={() => {
                      setViewingApp(null);
                      handleApproveAndEnroll(viewingApp);
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs"
                  >
                    Enroll as Student
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingAppId)}
        title="Delete Application"
        message="Are you sure you want to remove this application? This cannot be undone."
        confirmLabel="Delete Application"
        isDestructive
        onConfirm={() => {
          if (deletingAppId) {
            onDeleteApplication(deletingAppId);
            setDeletingAppId(null);
          }
        }}
        onCancel={() => setDeletingAppId(null)}
      />
    </div>
  );
};
