import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord, SessionType, AttendanceStatus } from '../../types';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Save, 
  Users, 
  CheckCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (record: AttendanceRecord) => void | Promise<void>;
  onSuccessToast: (msg: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendanceRecords,
  onSaveAttendance,
  onSuccessToast,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSession, setSelectedSession] = useState<SessionType>('Morning');

  // Filter students for the selected session and active status
  const sessionStudents = students.filter(
    (s) => s.session === selectedSession && s.status === 'Active'
  );

  // Local state for the current roll call entries
  const [entries, setEntries] = useState<Record<string, { status: AttendanceStatus; note?: string }>>({});

  // When date or session changes, load existing record or initialize all as Present
  useEffect(() => {
    const existing = attendanceRecords.find(
      (r) => r.date === selectedDate && r.session === selectedSession
    );

    const initialEntries: Record<string, { status: AttendanceStatus; note?: string }> = {};

    if (existing) {
      existing.entries.forEach((e) => {
        initialEntries[e.studentId] = {
          status: e.status,
          note: e.note || '',
        };
      });
    }

    // Ensure all active session students have an entry
    sessionStudents.forEach((student) => {
      if (!initialEntries[student.id]) {
        initialEntries[student.id] = {
          status: 'Present',
          note: '',
        };
      }
    });

    setEntries(initialEntries);
  }, [selectedDate, selectedSession, attendanceRecords, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note?: string }> = {};
    sessionStudents.forEach((s) => {
      updated[s.id] = { status: 'Present', note: '' };
    });
    setEntries(updated);
    onSuccessToast(`Marked all ${sessionStudents.length} trainees as Present.`);
  };

  const handleSaveAttendance = async () => {
    const entryList = sessionStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: entries[s.id]?.status || 'Present',
      note: entries[s.id]?.note || '',
    }));

    const record: AttendanceRecord = {
      id: `att_${selectedDate}_${selectedSession.toLowerCase()}`,
      date: selectedDate,
      session: selectedSession,
      entries: entryList,
      recordedBy: 'Administrator',
      recordedAt: new Date().toISOString(),
    };

    try {
      await onSaveAttendance(record);
      onSuccessToast(`Attendance saved for ${selectedSession} session (${selectedDate}).`);
    } catch {
      onSuccessToast('Could not save attendance to Firebase.');
    }
  };

  // Live session statistics
  const presentCount = sessionStudents.filter((s) => entries[s.id]?.status === 'Present').length;
  const absentCount = sessionStudents.filter((s) => entries[s.id]?.status === 'Absent').length;
  const lateCount = sessionStudents.filter((s) => entries[s.id]?.status === 'Late').length;
  const totalCount = sessionStudents.length;
  const percentage = totalCount > 0 ? Math.round(((presentCount + lateCount * 0.7) / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Control Bar: Date & Session Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Date Picker */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-sm focus:ring-2 focus:ring-[#166534] outline-none bg-white shadow-2xs"
              />
            </div>

            {/* Session Tabs */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedSession('Morning')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedSession === 'Morning'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Morning Batch (9 AM – 1 PM)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSession('Evening')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedSession === 'Evening'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Evening Batch (2 PM – 6 PM)
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
            >
              <CheckCheck className="w-4 h-4 text-[#166534]" />
              <span>Mark All Present</span>
            </button>

            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Register</span>
            </button>
          </div>
        </div>

        {/* Live Session Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[11px] font-semibold text-slate-500">Enrolled</div>
            <div className="text-xl font-bold text-slate-900">{totalCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[11px] font-semibold text-emerald-800">Present</div>
            <div className="text-xl font-bold text-emerald-700">{presentCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <div className="text-[11px] font-semibold text-rose-800">Absent</div>
            <div className="text-xl font-bold text-rose-700">{absentCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-[11px] font-semibold text-amber-800">Late</div>
            <div className="text-xl font-bold text-amber-700">{lateCount}</div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#eff4ff] border border-blue-200 text-center">
            <div className="text-[11px] font-semibold text-blue-800">Session Rate</div>
            <div className="text-xl font-bold text-[#166534]">{percentage}%</div>
          </div>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              {selectedSession} Session Roll Call — {selectedDate}
            </h3>
            <p className="text-xs text-slate-500">
              Toggle attendance status for each trainee and record punctuality remarks.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3.5 font-semibold">Trainee</th>
                <th className="pb-3.5 font-semibold">Course & Batch</th>
                <th className="pb-3.5 font-semibold">Mark Attendance Status</th>
                <th className="pb-3.5 font-semibold">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionStudents.map((student) => {
                const currentStatus = entries[student.id]?.status || 'Present';
                const currentNote = entries[student.id]?.note || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    {/* Trainee Avatar & ID */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-xs text-[#166534] font-medium">{student.studentId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 text-xs">
                      <div className="font-bold text-slate-800">{student.course}</div>
                      <div className="text-slate-500">{student.batch}</div>
                    </td>

                    {/* 3 Status Buttons Toggle */}
                    <td className="py-3.5">
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 gap-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            currentStatus === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3.5">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. 15m late, sick leave)..."
                        value={currentNote}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="w-full max-w-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#166534] outline-none bg-slate-50/50"
                      />
                    </td>
                  </tr>
                );
              })}

              {sessionStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 text-sm">
                    {students.filter((s) => s.status === 'Active').length === 0
                      ? 'No students registered yet.'
                      : `No active students enrolled in the ${selectedSession} session.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
