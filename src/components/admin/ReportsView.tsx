import React from 'react';
import { Student, StitchingOrder, AttendanceRecord } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  PieChart, 
  Scissors,
  Award
} from 'lucide-react';

interface ReportsViewProps {
  students: Student[];
  orders: StitchingOrder[];
  attendance: AttendanceRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  orders,
  attendance,
}) => {
  // Calculations
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const lateOrders = orders.filter((o) => o.status === 'Late' || o.isLate);
  const onTimeOrdersCount = totalOrders - lateOrders.length;
  const onTimeRate = totalOrders > 0 ? Math.round((onTimeOrdersCount / totalOrders) * 100) : 100;

  // Late reasons breakdown
  const lateReasonCounts: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.lateDeliveryReason) {
      lateReasonCounts[o.lateDeliveryReason] = (lateReasonCounts[o.lateDeliveryReason] || 0) + 1;
    }
  });

  // Students by course
  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    courseCounts[s.course] = (courseCounts[s.course] || 0) + 1;
  });

  // Financials
  const totalRevenue = orders.reduce((sum, o) => sum + (o.stitchingCharges || 0), 0);
  const totalAdvance = orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
  const totalBalanceDue = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

  // Overall attendance rate
  let totalClassDays = 0;
  let totalPresentCount = 0;
  students.forEach((s) => {
    if (s.attendanceStats) {
      totalClassDays += s.attendanceStats.totalClasses;
      totalPresentCount += s.attendanceStats.present + s.attendanceStats.late * 0.7;
    }
  });
  const attendanceRate = totalClassDays > 0 ? Math.round((totalPresentCount / totalClassDays) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 3 Top Summary Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: On-Time Delivery Performance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              On-Time Delivery Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-[#166534]">
            {onTimeRate}%
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {onTimeOrdersCount} On-Time vs <span className="text-rose-600 font-bold">{lateOrders.length} Late/Overdue</span>
          </div>
        </div>

        {/* Card 2: Attendance Discipline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Student Attendance Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-slate-900">
            {attendanceRate}%
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Across {students.length} enrolled vocational trainees
          </div>
        </div>

        {/* Card 3: Commercial Revenue & Cashflow */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Stitching Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Advance: PKR {totalAdvance.toLocaleString()} | Due: PKR {totalBalanceDue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Delivery Root Cause Analysis */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Late Delivery Reason Analysis</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of factors contributing to client delivery delays.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(lateReasonCounts).length > 0 ? (
              Object.entries(lateReasonCounts).map(([reason, count]) => {
                const percent = Math.round((count / lateOrders.length) * 100);
                return (
                  <div key={reason} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{reason}</span>
                      <span className="text-rose-600 font-bold">{count} order(s) ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No late delivery incidents logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Student Enrollment Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#166534]" />
              <span>Vocational Course Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active student enrollment across skill modules.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(courseCounts).map(([course, count]) => {
              const percent = Math.round((count / students.length) * 100);
              return (
                <div key={course} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{course}</span>
                    <span className="text-[#166534] font-bold">{count} trainees ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#166534] h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
