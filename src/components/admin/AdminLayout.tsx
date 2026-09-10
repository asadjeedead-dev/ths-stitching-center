import React, { useState, useEffect } from 'react';
import { 
  AdminUser, 
  Student, 
  StitchingOrder, 
  AttendanceRecord, 
  PublicApplication,
  ApplicationStatus,
  ActivityEvent,
  ContactInquiry,
  InquiryStatus,
} from '../../types';
import { 
  saveStudent, 
  deleteStudent,
  saveOrder, 
  deleteOrder,
  saveAttendanceRecord,
  updateApplicationStatus,
  enrollApplicantAsStudent,
  syncAcceptedApplicationsToStudents,
  deleteApplication,
  subscribeStudents,
  subscribeOrders,
  subscribeAttendance,
  subscribeApplications,
  subscribeInquiries,
  subscribeActivities,
  updateInquiryStatus,
  deleteInquiry,
} from '../../services/storage';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { DashboardView } from './DashboardView';
import { StudentsView } from './StudentsView';
import { AttendanceView } from './AttendanceView';
import { OrdersView } from './OrdersView';
import { ApplicationsView } from './ApplicationsView';
import { InquiriesView } from './InquiriesView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { Toast, ToastMessage } from '../common/Toast';

interface AdminLayoutProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onBackToPublic: () => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Firebase request failed. Create a Firestore database for this project if it does not exist yet.';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  adminUser,
  onLogout,
  onBackToPublic,
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [orders, setOrders] = useState<StitchingOrder[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [applications, setApplications] = useState<PublicApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleError = (error: Error) => {
      setIsLoading(false);
      setLoadError(errorMessage(error));
    };

    const unsubscribers = [
      subscribeStudents((rows) => {
        setStudents(rows);
        setIsLoading(false);
        setLoadError('');
      }, handleError),
      subscribeOrders((rows) => {
        setOrders(rows);
        setIsLoading(false);
      }, handleError),
      subscribeAttendance(setAttendance, handleError),
      subscribeApplications(setApplications, handleError),
      subscribeInquiries(setInquiries, handleError),
      subscribeActivities(setActivities, handleError),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  useEffect(() => {
    const missing = applications.filter((app) => {
      if (app.status !== 'Accepted' && app.status !== 'Approved') return false;
      const phone = (app.phone || '').replace(/\D/g, '');
      return !students.some(
        (student) =>
          student.applicationId === app.id ||
          (phone.length >= 7 && (student.phone || '').replace(/\D/g, '') === phone)
      );
    });
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        if (!cancelled) await syncAcceptedApplicationsToStudents(missing);
      } catch (error) {
        if (!cancelled) addToast(errorMessage(error), 'error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applications, students]);

  const handleSaveStudent = async (studentData: Omit<Student, 'id'> & { id?: string }) => {
    try {
      const saved = await saveStudent(studentData);
      addToast(`Student record for "${saved.name}" saved to Firebase.`);
    } catch (error) {
      addToast(errorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      addToast('Student record deleted from Firebase.', 'info');
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleSaveOrder = async (orderData: Omit<StitchingOrder, 'id'> & { id?: string }) => {
    try {
      const saved = await saveOrder(orderData);
      addToast(`Stitching order "${saved.orderNumber}" saved to Firebase.`);
    } catch (error) {
      addToast(errorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      addToast('Stitching order removed from Firebase.', 'info');
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleSaveAttendance = async (record: AttendanceRecord) => {
    try {
      await saveAttendanceRecord(record);
    } catch (error) {
      addToast(errorMessage(error), 'error');
      throw error;
    }
  };

  const handleUpdateAppStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status);
      if (status === 'Accepted' || status === 'Approved') {
        addToast('Application accepted. Student record added to the dashboard.');
      } else {
        addToast(`Application status updated to ${status}.`);
      }
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      addToast('Application removed from Firebase.', 'info');
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleEnrollApplicant = async (app: PublicApplication) => {
    try {
      const student = await enrollApplicantAsStudent(app);
      addToast(`${student.name} enrolled as ${student.studentId}. Dashboard counts are updated.`);
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, status);
      addToast(`Message marked as ${status}.`);
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteInquiry(id);
      addToast('Contact message removed from Firebase.', 'info');
    } catch (error) {
      addToast(errorMessage(error), 'error');
    }
  };

  const lateOrders = orders.filter((o) => o.status === 'Late' || o.isLate);
  const pendingApps = applications.filter((a) => a.status === 'New' || a.status === 'Pending' || a.status === 'Reviewed');
  const pendingInquiries = inquiries.filter((item) => item.status === 'New');

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex text-slate-800">
      <Toast toasts={toasts} onCloseToast={removeToast} />

      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={onLogout}
        onBackToPublic={onBackToPublic}
        adminUser={adminUser}
        lateOrdersCount={lateOrders.length}
        pendingAppsCount={pendingApps.length}
        pendingInquiriesCount={pendingInquiries.length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onAddStudent={() => {
          setActiveTab('students');
          setIsAddStudentModalOpen(true);
        }}
        onAddOrder={() => {
          setActiveTab('orders');
          setIsAddOrderModalOpen(true);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <AdminNavbar
          adminUser={adminUser}
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          lateOrders={lateOrders}
          pendingApplications={pendingApps}
          pendingInquiries={pendingInquiries}
          onNavigateTab={setActiveTab}
          onBackToPublic={onBackToPublic}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {isLoading && (
            <div className="mb-6 rounded-3xl bg-white border border-slate-200 p-6 text-sm text-slate-600">
              Loading live records from Firebase...
            </div>
          )}

          {loadError && (
            <div className="mb-6 rounded-3xl bg-rose-50 border border-rose-200 p-6 text-sm text-rose-800 space-y-2">
              <p className="font-bold">Firebase is not returning data yet.</p>
              <p>{loadError}</p>
              <p className="text-xs text-rose-700">
                In Firebase Console, create a Firestore database for project <strong>ths-stitching-center</strong> and
                enable Email/Password authentication. Then add or enroll real students, orders, and applications here.
              </p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              orders={orders}
              attendance={attendance}
              applications={applications}
              inquiries={inquiries}
              activities={activities}
              onNavigateTab={setActiveTab}
              onOpenAddStudent={() => {
                setActiveTab('students');
                setIsAddStudentModalOpen(true);
              }}
              onOpenAddOrder={() => {
                setActiveTab('orders');
                setIsAddOrderModalOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              onSaveStudent={handleSaveStudent}
              onDeleteStudent={handleDeleteStudent}
              isAddModalOpen={isAddStudentModalOpen}
              onCloseAddModal={() => setIsAddStudentModalOpen(false)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              attendanceRecords={attendance}
              onSaveAttendance={handleSaveAttendance}
              onSuccessToast={addToast}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              students={students}
              onSaveOrder={handleSaveOrder}
              onDeleteOrder={handleDeleteOrder}
              isAddModalOpen={isAddOrderModalOpen}
              onCloseAddModal={() => setIsAddOrderModalOpen(false)}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              students={students}
              onUpdateStatus={handleUpdateAppStatus}
              onDeleteApplication={handleDeleteApplication}
              onEnrollApplicantAsStudent={handleEnrollApplicant}
              onSuccessToast={addToast}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesView
              inquiries={inquiries}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              students={students}
              orders={orders}
              attendance={attendance}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              adminUser={adminUser}
              studentsCount={students.length}
              ordersCount={orders.length}
              attendanceCount={attendance.length}
              applicationsCount={applications.length}
              inquiriesCount={inquiries.length}
              onDataReset={() => undefined}
              onSuccessToast={addToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
