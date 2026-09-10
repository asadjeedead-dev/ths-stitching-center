import React, { useState } from 'react';
import { Student, SessionType, StudentStatus, SkillKey, SkillLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  UserCheck, 
  Calendar, 
  Phone, 
  MapPin, 
  X, 
  CheckCircle, 
  Clock, 
  Award,
  BookOpen
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onSaveStudent: (student: Omit<Student, 'id'> & { id?: string }) => void | Promise<void>;
  onDeleteStudent: (id: string) => void | Promise<void>;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [formError, setFormError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Form inputs state
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    fatherOrHusbandName: '',
    phone: '',
    cnicOrBForm: '',
    age: 20,
    address: '',
    session: 'Morning',
    batch: 'Batch 2024-A',
    course: 'Basic Stitching',
    currentLevel: 'Beginner',
    previousExperience: 'None (Beginner)',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSiTTJldSmVmjDFPO5E9LFtc2qDmptHKTNeGUHhp3EkzO1h3VXZHSFguzl-lajif4BmTpPAXF2pKKe_LvlKkD3nMU74k6iHD4Pbofq-tecj3-hDGroJk23oFEv-mdwy-O1S12zFEDjMxzXw7UE2Hz2PZzNRyknRVO700NHgA2boMsjrOA1REf1Yb4TF716be4SY2JQGmqjOBMPPE36LOCuUTNnFG6j3mG596syohCUlP59d6PJ3CiATg',
    notes: '',
  });

  React.useEffect(() => {
    if (isAddModalOpen) {
      handleOpenCreate();
    }
  }, [isAddModalOpen]);

  React.useEffect(() => {
    if (!viewingStudent) return;
    const latest = students.find((student) => student.id === viewingStudent.id);
    if (latest) setViewingStudent(latest);
  }, [students]);

  const batches = Array.from(new Set(students.map((s) => s.batch).filter(Boolean)));
  const courses = Array.from(new Set(students.map((s) => s.course).filter(Boolean)));
  const levels = Array.from(new Set(students.map((s) => s.currentLevel).filter(Boolean))) as string[];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSession = sessionFilter === 'all' || student.session === sessionFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      student.status === statusFilter ||
      (statusFilter === 'Completed' && (student.status === 'Completed' || student.status === 'Graduated'));
    const matchesBatch = batchFilter === 'all' || student.batch === batchFilter;
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesLevel = levelFilter === 'all' || student.currentLevel === levelFilter;

    return matchesSearch && matchesSession && matchesStatus && matchesBatch && matchesCourse && matchesLevel;
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      fatherOrHusbandName: '',
      phone: '',
      cnicOrBForm: '',
      age: 22,
      address: '',
      session: 'Morning',
      batch: 'Batch 2024-A',
      course: 'Basic Stitching',
      currentLevel: 'Beginner',
      previousExperience: 'None (Beginner)',
      enrollmentDate: new Date().toISOString().split('T')[0],
      studentId: '',
      status: 'Active',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSiTTJldSmVmjDFPO5E9LFtc2qDmptHKTNeGUHhp3EkzO1h3VXZHSFguzl-lajif4BmTpPAXF2pKKe_LvlKkD3nMU74k6iHD4Pbofq-tecj3-hDGroJk23oFEv-mdwy-O1S12zFEDjMxzXw7UE2Hz2PZzNRyknRVO700NHgA2boMsjrOA1REf1Yb4TF716be4SY2JQGmqjOBMPPE36LOCuUTNnFG6j3mG596syohCUlP59d6PJ3CiATg',
      notes: '',
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name?.trim() || !formData.fatherOrHusbandName?.trim() || !formData.phone?.trim() || !formData.address?.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const duplicateId = formData.studentId?.trim()
      && students.some(
        (student) =>
          student.studentId.trim().toLowerCase() === formData.studentId!.trim().toLowerCase() &&
          student.id !== editingStudent?.id
      );
    if (duplicateId) {
      setFormError('Duplicate Student ID. Please use a unique ID.');
      return;
    }

    try {
      await onSaveStudent({
      ...(editingStudent ? { id: editingStudent.id } : {}),
      name: formData.name || '',
      studentId: formData.studentId || (editingStudent ? editingStudent.studentId : ''),
      fatherOrHusbandName: formData.fatherOrHusbandName || '',
      phone: formData.phone || '',
      cnicOrBForm: formData.cnicOrBForm || '',
      age: Number(formData.age) || 20,
      address: formData.address || '',
      session: (formData.session as SessionType) || 'Morning',
      batch: formData.batch || 'Batch 2024-A',
      course: formData.course || 'Basic Stitching',
      currentLevel: formData.currentLevel || 'Beginner',
      previousExperience: formData.previousExperience || 'None (Beginner)',
      enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
      status: (formData.status as StudentStatus) || 'Active',
      avatarUrl: formData.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSiTTJldSmVmjDFPO5E9LFtc2qDmptHKTNeGUHhp3EkzO1h3VXZHSFguzl-lajif4BmTpPAXF2pKKe_LvlKkD3nMU74k6iHD4Pbofq-tecj3-hDGroJk23oFEv-mdwy-O1S12zFEDjMxzXw7UE2Hz2PZzNRyknRVO700NHgA2boMsjrOA1REf1Yb4TF716be4SY2JQGmqjOBMPPE36LOCuUTNnFG6j3mG596syohCUlP59d6PJ3CiATg',
      notes: formData.notes || '',
      skills: editingStudent ? editingStudent.skills : (formData.skills as any),
      attendanceStats: editingStudent ? editingStudent.attendanceStats : (formData.attendanceStats as any),
      });
      handleCloseForm();
    } catch {
      setFormError('Could not save this student to Firebase. Please try again.');
    }
  };

  // Skill update in profile modal
  const handleUpdateSkill = (skillKey: SkillKey, newLevel: SkillLevel) => {
    if (!viewingStudent) return;
    const updatedSkills = {
      ...viewingStudent.skills,
      [skillKey]: {
        ...viewingStudent.skills[skillKey],
        level: newLevel,
        completedDate: newLevel === 'Mastered' ? new Date().toISOString().split('T')[0] : undefined,
      },
    };

    const updated = {
      ...viewingStudent,
      skills: updatedSkills,
    };

    setViewingStudent(updated);
    onSaveStudent(updated);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Father/Husband', 'Phone', 'Session', 'Batch', 'Course', 'Status', 'Attendance %'];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      `"${s.name}"`,
      `"${s.fatherOrHusbandName}"`,
      `"${s.phone}"`,
      s.session,
      s.batch,
      `"${s.course}"`,
      s.status,
      `${s.attendanceStats?.percentage || 100}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `THS_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const skillLabels: Record<SkillKey, string> = {
    basic_stitching: '1. Basic Machine Operation & Straight Seams',
    cutting_pattern: '2. Anthropometric Measurements & Pattern Drafting',
    frock_making: '3. Frock Styling & Flare Assembly',
    maxi_design: '4. Maxi Dress Design & Pleating',
    advanced_garments: '5. Advanced Occasion Garments & Finishing',
    bridal_wear: '6. Bridal Lehnga, Choli & Can-Can Mounting',
    hand_embroidery: '7. Hand Embroidery, Zardozi & Hemming',
    machine_maintenance: '8. Industrial Machine Maintenance & Oiling',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Control Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID (#THS-2024-001), phone, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] focus:border-transparent outline-none bg-slate-50/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Filters:
          </span>

          {/* Session filter */}
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="all">All Sessions (Morning & Evening)</option>
            <option value="Morning">Morning Batch (9 AM - 1 PM)</option>
            <option value="Evening">Evening Batch (2 PM - 6 PM)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Graduated">Graduated</option>
            <option value="On Leave">On Leave</option>
            <option value="Dropped">Dropped</option>
          </select>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          {/* Level filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Bridal">Bridal</option>
            {levels.filter((level) => !['Beginner', 'Intermediate', 'Advanced', 'Bridal'].includes(level)).map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Batch filter */}
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <span className="ml-auto text-slate-500 text-xs font-semibold">
            Showing {filteredStudents.length} of {students.length} trainees
          </span>
        </div>
      </div>

      {/* Students Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3.5 font-semibold">Student ID & Trainee</th>
                <th className="pb-3.5 font-semibold">Contact & Family</th>
                <th className="pb-3.5 font-semibold">Course & Batch</th>
                <th className="pb-3.5 font-semibold">Session</th>
                <th className="pb-3.5 font-semibold">Attendance</th>
                <th className="pb-3.5 font-semibold">Status</th>
                <th className="pb-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition">
                  {/* Avatar & Name */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs font-semibold text-[#166534]">{student.studentId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Phone & Father */}
                  <td className="py-4 text-xs">
                    <div className="font-medium text-slate-800">{student.phone}</div>
                    <div className="text-slate-500">Guardian: {student.fatherOrHusbandName}</div>
                  </td>

                  {/* Course & Batch */}
                  <td className="py-4 text-xs">
                    <div className="font-bold text-slate-800">{student.course}</div>
                    <div className="text-slate-500">{student.batch}</div>
                  </td>

                  {/* Session */}
                  <td className="py-4 text-xs">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      student.session === 'Morning'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {student.session}
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#166534] h-2 rounded-full"
                          style={{ width: `${student.attendanceStats?.percentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-700">
                        {student.attendanceStats?.percentage ?? 0}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {student.attendanceStats?.present || 0} / {student.attendanceStats?.totalClasses || 0} days
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4">
                    <StatusBadge status={student.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingStudent(student)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#166534] hover:bg-emerald-50 transition"
                        title="View Full Profile & Skill Matrix"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Student Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingStudentId(student.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    {students.length === 0 ? (
                      <div className="space-y-3">
                        <p className="text-slate-500 text-sm">No students registered yet.</p>
                        <button
                          onClick={handleOpenCreate}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
                        >
                          Add Student
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No student records found matching your filters.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95">
            <button
              onClick={handleCloseForm}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#0b1c30]">
                  {editingStudent ? `Edit Student: ${editingStudent.name}` : 'Register New Student'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter student biographical details, course tier, and session schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId || ''}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="Auto-generated if left blank (e.g. THS-2026-007)"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Registration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.enrollmentDate || ''}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Parveen Begum"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Father / Husband Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherOrHusbandName}
                    onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                    placeholder="e.g. Muhammad Rafiq"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    CNIC / B-Form #
                  </label>
                  <input
                    type="text"
                    value={formData.cnicOrBForm}
                    onChange={(e) => setFormData({ ...formData, cnicOrBForm: e.target.value })}
                    placeholder="35201-1234567-1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={14}
                    max={65}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Session *
                  </label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value as SessionType })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="Morning">Morning (9 AM - 1 PM)</option>
                    <option value="Evening">Evening (2 PM - 6 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Batch
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="Batch 2024-A"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Completed">Completed</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Enrolled Course / Level
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                >
                  <option value="Basic Stitching">Level 1: Basic Stitching & Machine Operation</option>
                  <option value="Cutting & Construction">Level 2: Cutting & Pattern Drafting</option>
                  <option value="Frock Making">Frock Making</option>
                  <option value="Maxi Design">Maxi Design</option>
                  <option value="Intermediate Stitching">Level 3: Intermediate Stitching & Everyday Wear</option>
                  <option value="Advanced Garment Making">Level 4: Advanced Garment Making & Bridal</option>
                  <option value="Bridal Wear">Bridal Wear</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Level
                  </label>
                  <select
                    value={formData.currentLevel || 'Beginner'}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Bridal">Bridal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Previous Experience
                  </label>
                  <select
                    value={formData.previousExperience || 'None (Beginner)'}
                    onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                  >
                    <option value="None (Beginner)">None (Beginner)</option>
                    <option value="Basic Hand Stitching">Basic Hand Stitching</option>
                    <option value="Machine Experience">Machine Experience</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Residential Address *
                </label>
                  <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House 4, Street 2, Shalimar Town, Lahore"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instructor Notes / Observations
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Excellent seam straightness. Shows interest in bridal embroidery..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#166534] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs transition"
                >
                  {editingStudent ? 'Save Changes' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile & Skill Progression Matrix Drawer */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
              <img
                src={viewingStudent.avatarUrl}
                alt={viewingStudent.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#166534] shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-bold font-serif text-slate-900">
                    {viewingStudent.name}
                  </h3>
                  <StatusBadge status={viewingStudent.status} size="sm" />
                  <span className="text-xs font-bold text-[#166534] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {viewingStudent.studentId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                  <div><strong>Guardian:</strong> {viewingStudent.fatherOrHusbandName}</div>
                  <div><strong>Phone:</strong> {viewingStudent.phone}</div>
                  <div><strong>Session:</strong> {viewingStudent.session} ({viewingStudent.batch})</div>
                  <div><strong>Course:</strong> {viewingStudent.course}</div>
                  <div><strong>Level:</strong> {viewingStudent.currentLevel || '—'}</div>
                  <div><strong>Registered:</strong> {viewingStudent.enrollmentDate}</div>
                </div>
              </div>
            </div>

            {/* Attendance & Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-xs font-semibold text-emerald-800">Attendance Rate</div>
                <div className="text-xl font-bold text-[#166534]">
                  {viewingStudent.attendanceStats?.percentage ?? 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-semibold text-slate-600">Total Classes</div>
                <div className="text-xl font-bold text-slate-800">
                  {viewingStudent.attendanceStats?.totalClasses ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-semibold text-slate-600">Present</div>
                <div className="text-xl font-bold text-emerald-700">
                  {viewingStudent.attendanceStats?.present ?? 0}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs font-semibold text-slate-600">Absent / Late</div>
                <div className="text-xl font-bold text-rose-700">
                  {viewingStudent.attendanceStats?.absent ?? 0} / {viewingStudent.attendanceStats?.late ?? 0}
                </div>
              </div>
            </div>

            {/* Interactive Vocational Skill Progression Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#166534]" />
                    <span>Vocational Skill Progression Matrix</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click any skill badge to toggle mastery status (Not Started → In Progress → Mastered).
                  </p>
                </div>
              </div>

              {(() => {
                const skillKeys = Object.keys(skillLabels) as SkillKey[];
                const completedSkills = skillKeys.filter((key) => viewingStudent.skills?.[key]?.level === 'Mastered');
                const remainingSkills = skillKeys.filter((key) => viewingStudent.skills?.[key]?.level !== 'Mastered');
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="font-bold text-[#166534] mb-1">Completed Skills ({completedSkills.length})</div>
                      <div className="text-emerald-800">{completedSkills.length ? completedSkills.map((key) => skillLabels[key]).join(', ') : 'None mastered yet'}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-700 mb-1">Remaining Skills ({remainingSkills.length})</div>
                      <div className="text-slate-600">{remainingSkills.length ? remainingSkills.map((key) => skillLabels[key]).join(', ') : 'All skills mastered'}</div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {(Object.keys(skillLabels) as SkillKey[]).map((key) => {
                  const skill = viewingStudent.skills?.[key] || { level: 'Not Started' };
                  const nextLevel: Record<SkillLevel, SkillLevel> = {
                    'Not Started': 'In Progress',
                    'In Progress': 'Mastered',
                    'Mastered': 'Not Started',
                  };

                  return (
                    <div
                      key={key}
                      onClick={() => handleUpdateSkill(key, nextLevel[skill.level])}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/70 cursor-pointer transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {skillLabels[key]}
                        </div>
                        {skill.completedDate && (
                          <div className="text-[10px] text-emerald-700">
                            Completed: {skill.completedDate}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={skill.level} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>

            {viewingStudent.notes && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Instructor Observation Notes:</span>
                {viewingStudent.notes}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingStudentId)}
        title="Delete Student Record"
        message="Are you sure you want to permanently remove this student record from the system? This action cannot be undone."
        confirmLabel="Delete Student"
        isDestructive
        onConfirm={() => {
          if (deletingStudentId) {
            onDeleteStudent(deletingStudentId);
            setDeletingStudentId(null);
          }
        }}
        onCancel={() => setDeletingStudentId(null)}
      />
    </div>
  );
};
