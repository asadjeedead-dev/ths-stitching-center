import React from 'react';
import { Student, StitchingOrder, AttendanceRecord, PublicApplication, ActivityEvent, ContactInquiry } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  Scissors, 
  CalendarCheck, 
  GraduationCap, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  CheckCircle2,
  UserPlus,
  Clock,
  Package,
  MessageSquare
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  orders: StitchingOrder[];
  attendance: AttendanceRecord[];
  applications: PublicApplication[];
  inquiries: ContactInquiry[];
  activities: ActivityEvent[];
  onNavigateTab: (tab: string) => void;
  onOpenAddStudent: () => void;
  onOpenAddOrder: () => void;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function parseDate(value: string): Date {
  return startOfDay(new Date(`${value}T00:00:00`));
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  orders,
  attendance,
  applications,
  inquiries,
  activities,
  onNavigateTab,
  onOpenAddStudent,
  onOpenAddOrder,
}) => {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const completedStudents = students.filter((s) => s.status === 'Graduated' || s.status === 'Completed');
  const morningStudents = students.filter((s) => s.session === 'Morning').length;
  const eveningStudents = students.filter((s) => s.session === 'Evening').length;

  const pendingOrders = orders.filter((o) => o.status !== 'Delivered');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const lateOrders = orders.filter((o) => o.status === 'Late' || o.isLate);
  const pendingApps = applications.filter((a) => a.status === 'New' || a.status === 'Pending' || a.status === 'Reviewed');
  const newInquiries = inquiries.filter((item) => item.status === 'New');

  let totalClassDays = 0;
  let totalPresentCount = 0;
  students.forEach((s) => {
    if (s.attendanceStats) {
      totalClassDays += s.attendanceStats.totalClasses;
      totalPresentCount += s.attendanceStats.present + s.attendanceStats.late * 0.7;
    }
  });
  const overallAttendanceRate = totalClassDays > 0
    ? Math.round((totalPresentCount / totalClassDays) * 100)
    : 0;

  const today = startOfDay(new Date());
  const inTwoDays = new Date(today);
  inTwoDays.setDate(inTwoDays.getDate() + 2);

  const upcomingDeliveries = orders.filter((order) => {
    if (order.status === 'Delivered') return false;
    const expected = parseDate(order.expectedDeliveryDate);
    return expected.getTime() >= today.getTime() && expected.getTime() <= inTwoDays.getTime();
  });

  const overdueOrders = orders.filter((order) => {
    if (order.status === 'Delivered') return false;
    return parseDate(order.expectedDeliveryDate).getTime() < today.getTime();
  });

  const recentOrders = [...orders].slice(0, 5);
  const recentActivities = [...activities].slice(0, 8);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-emerald-50 text-[#166534]', tab: 'students' },
    { label: 'Active Students', value: activeStudents.length, icon: Users, color: 'bg-emerald-50 text-[#166534]', tab: 'students' },
    { label: 'Morning Students', value: morningStudents, icon: Clock, color: 'bg-amber-50 text-amber-700', tab: 'students' },
    { label: 'Evening Students', value: eveningStudents, icon: Clock, color: 'bg-blue-50 text-blue-700', tab: 'students' },
    { label: 'Completed Students', value: completedStudents.length, icon: GraduationCap, color: 'bg-amber-50 text-amber-700', tab: 'students' },
    { label: 'Total Stitching Orders', value: orders.length, icon: Scissors, color: 'bg-blue-50 text-blue-700', tab: 'orders' },
    { label: 'Pending Orders', value: pendingOrders.length, icon: Package, color: 'bg-slate-100 text-slate-700', tab: 'orders' },
    { label: 'Delivered Orders', value: deliveredOrders.length, icon: CheckCircle2, color: 'bg-emerald-50 text-[#166534]', tab: 'orders' },
    { label: 'Late Orders', value: lateOrders.length, icon: AlertTriangle, color: 'bg-rose-50 text-rose-700', tab: 'orders' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => onNavigateTab(stat.tab)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-105 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold font-serif text-[#0b1c30]">
                {stat.value}
              </div>
            </div>
          );
        })}

        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg. Attendance Rate
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-[#166534]">
            {overallAttendanceRate}%
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            {totalClassDays > 0 ? `From ${attendance.length} saved roll call(s)` : 'No attendance records yet'}
          </div>
        </div>
      </div>

      {(lateOrders.length > 0 || pendingApps.length > 0 || newInquiries.length > 0 || upcomingDeliveries.length > 0 || overdueOrders.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {overdueOrders.length > 0 && (
            <div className="bg-rose-50/90 rounded-3xl p-6 border border-rose-200 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-900">
                    {overdueOrders.length} Overdue Order{overdueOrders.length === 1 ? '' : 's'}
                  </h3>
                  <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                    Expected delivery dates have passed and these garments are not marked delivered.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-900 hover:text-rose-950 underline self-end"
              >
                <span>Resolve in Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-amber-50/90 rounded-3xl p-6 border border-amber-200 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  {upcomingDeliveries.length} order{upcomingDeliveries.length === 1 ? '' : 's'} due within the next 2 days.
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {upcomingDeliveries.length > 0
                    ? upcomingDeliveries.map((o) => `${o.orderNumber} (${o.customerName})`).join(' · ')
                    : 'No stitching orders are scheduled in the next two days.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline self-end"
            >
              <span>Open Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingApps.length > 0 && (
            <div className="bg-emerald-50/90 rounded-3xl p-6 border border-emerald-200 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-[#166534] shrink-0">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#166534]">
                    {pendingApps.length} Pending Public Admission Application(s)
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Latest: {pendingApps[0].fullName} ({pendingApps[0].sessionPreference})
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('applications')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:text-emerald-950 underline self-end"
              >
                <span>Review Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {newInquiries.length > 0 && (
            <div className="bg-sky-50/90 rounded-3xl p-6 border border-sky-200 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-700 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-sky-900">
                    {newInquiries.length} New Contact Message{newInquiries.length === 1 ? '' : 's'}
                  </h3>
                  <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                    Latest: {newInquiries[0].name} ({newInquiries[0].phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('inquiries')}
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-900 hover:text-sky-950 underline self-end"
              >
                <span>Read Messages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-serif text-slate-900">
            Center Management Shortcuts
          </h3>
          <p className="text-xs text-slate-500">
            Quickly execute common daily administrative tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onOpenAddOrder}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
          >
            <Plus className="w-4 h-4 text-[#166534]" />
            <span>New Stitching Order</span>
          </button>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
          >
            <CalendarCheck className="w-4 h-4 text-[#166534]" />
            <span>Take Today's Attendance</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500">Live actions saved in this browser session and earlier visits.</p>
          </div>
          {recentActivities.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No activity yet. Register a student, create an order, or mark attendance to see updates here.
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivities.map((event) => (
                <li key={event.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                    {event.type === 'student' && <Users className="w-4 h-4" />}
                    {event.type === 'order' && <Scissors className="w-4 h-4" />}
                    {event.type === 'delivery' && <CheckCircle2 className="w-4 h-4" />}
                    {event.type === 'attendance' && <CalendarCheck className="w-4 h-4" />}
                    {event.type === 'application' && <UserPlus className="w-4 h-4" />}
                    {event.type === 'inquiry' && <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{event.message}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Recent Stitching Orders Queue
              </h3>
              <p className="text-xs text-slate-500">
                Latest client garments currently being cut, stitched, or finished.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:underline"
            >
              <span>View All Orders ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-slate-500">No stitching orders found.</p>
              <button
                onClick={onOpenAddOrder}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Create New Order
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer Name</th>
                    <th className="pb-3 font-semibold">Garment Type</th>
                    <th className="pb-3 font-semibold">Expected Due</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 font-bold text-[#166534]">{order.orderNumber}</td>
                      <td className="py-3.5 font-medium text-slate-900">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 text-slate-700 font-medium">{order.garmentType}</td>
                      <td className="py-3.5 text-xs text-slate-600">{order.expectedDeliveryDate}</td>
                      <td className="py-3.5">
                        <StatusBadge status={order.status} size="sm" lateDays={order.lateDays} isLate={order.isLate} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
