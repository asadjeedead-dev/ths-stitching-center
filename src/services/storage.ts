import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import {
  Student,
  StitchingOrder,
  AttendanceRecord,
  PublicApplication,
  ApplicationStatus,
  ActivityEvent,
  ContactInquiry,
  InquiryStatus,
} from '../types';
import { ASSETS } from '../data/initialData';
import { COLLECTIONS, db } from './firebase';

const DEFAULT_SKILLS: Student['skills'] = {
  basic_stitching: { level: 'In Progress' },
  cutting_pattern: { level: 'Not Started' },
  frock_making: { level: 'Not Started' },
  maxi_design: { level: 'Not Started' },
  advanced_garments: { level: 'Not Started' },
  bridal_wear: { level: 'Not Started' },
  hand_embroidery: { level: 'Not Started' },
  machine_maintenance: { level: 'Not Started' },
};

function migrateApplicationStatus(status: string): ApplicationStatus {
  if (status === 'Pending') return 'New';
  if (status === 'Approved') return 'Accepted';
  return status as ApplicationStatus;
}

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseYmd(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function calculateLateStatus(order: StitchingOrder): { isLate: boolean; lateDays: number } {
  if (!order.expectedDeliveryDate) return { isLate: false, lateDays: 0 };

  const expectedDate = parseYmd(order.expectedDeliveryDate);

  if (order.status === 'Delivered' && order.actualDeliveryDate) {
    const deliveredDate = parseYmd(order.actualDeliveryDate);
    const diffDays = Math.round((deliveredDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      isLate: diffDays > 0,
      lateDays: Math.max(0, diffDays),
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && order.status !== 'Delivered') {
    return {
      isLate: true,
      lateDays: diffDays,
    };
  }

  return { isLate: false, lateDays: 0 };
}

function withLateStatus(order: StitchingOrder): StitchingOrder {
  const { isLate, lateDays } = calculateLateStatus(order);
  return {
    ...order,
    isLate: order.status === 'Late' || isLate,
    lateDays: lateDays > 0 ? lateDays : order.lateDays || 0,
    status:
      isLate && order.status !== 'Delivered' && order.status !== 'Ready for Pickup' && order.status !== 'Ready'
        ? 'Late'
        : order.status,
  };
}

async function collectionDocs<T>(name: string): Promise<Array<T & { id: string }>> {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((item) => ({ ...(item.data() as T), id: item.id }));
}

export function subscribeCollection<T>(
  name: string,
  onData: (rows: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, name),
    (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ ...(item.data() as object), id: item.id })) as T[];
      onData(rows);
    },
    (error) => {
      onError?.(error);
    }
  );
}

export function subscribeStudents(onData: (rows: Student[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<Student>(COLLECTIONS.STUDENTS, onData, onError);
}

export function subscribeOrders(onData: (rows: StitchingOrder[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<StitchingOrder>(
    COLLECTIONS.ORDERS,
    (rows) => onData(rows.map(withLateStatus)),
    onError
  );
}

export function subscribeAttendance(onData: (rows: AttendanceRecord[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<AttendanceRecord>(COLLECTIONS.ATTENDANCE, onData, onError);
}

function isContactInquiryRecord(row: { id?: string; recordType?: string }): boolean {
  return row.recordType === 'contact_inquiry' || (typeof row.id === 'string' && row.id.startsWith('inq_'));
}

function toContactInquiry(row: ContactInquiry & { fullName?: string; address?: string }): ContactInquiry {
  const status: InquiryStatus =
    row.status === 'Contacted' || row.status === 'Closed' ? row.status : 'New';
  return {
    id: row.id,
    name: (row.name || row.fullName || '').trim(),
    phone: row.phone || '',
    area: (row.area || row.address || '').trim(),
    message: row.message || '',
    submittedAt: row.submittedAt || '',
    status,
    recordType: 'contact_inquiry',
  };
}

export function subscribeApplications(onData: (rows: PublicApplication[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<PublicApplication & { recordType?: string }>(
    COLLECTIONS.APPLICATIONS,
    (rows) =>
      onData(
        rows
          .filter((app) => !isContactInquiryRecord(app))
          .map((app) => ({ ...app, status: migrateApplicationStatus(app.status) }))
          .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''))
      ),
    onError
  );
}

export function subscribeInquiries(onData: (rows: ContactInquiry[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<ContactInquiry & { fullName?: string; address?: string }>(
    COLLECTIONS.APPLICATIONS,
    (rows) =>
      onData(
        rows
          .filter((row) => isContactInquiryRecord(row))
          .map(toContactInquiry)
          .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''))
      ),
    onError
  );
}

export function subscribeActivities(onData: (rows: ActivityEvent[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return subscribeCollection<ActivityEvent>(
    COLLECTIONS.ACTIVITY,
    (rows) =>
      onData(
        [...rows]
          .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
          .slice(0, 80)
      ),
    onError
  );
}

export async function getStudents(): Promise<Student[]> {
  return collectionDocs<Student>(COLLECTIONS.STUDENTS);
}

export async function getOrders(): Promise<StitchingOrder[]> {
  const orders = await collectionDocs<StitchingOrder>(COLLECTIONS.ORDERS);
  return orders.map(withLateStatus);
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  return collectionDocs<AttendanceRecord>(COLLECTIONS.ATTENDANCE);
}

export const getAttendanceRecords = getAttendance;

export async function getApplications(): Promise<PublicApplication[]> {
  const apps = await collectionDocs<PublicApplication & { recordType?: string }>(COLLECTIONS.APPLICATIONS);
  return apps
    .filter((app) => !isContactInquiryRecord(app))
    .map((app) => ({ ...app, status: migrateApplicationStatus(app.status) }))
    .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
}

export async function getActivities(): Promise<ActivityEvent[]> {
  const events = await collectionDocs<ActivityEvent>(COLLECTIONS.ACTIVITY);
  return events.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')).slice(0, 80);
}

export async function logActivity(type: ActivityEvent['type'], message: string): Promise<ActivityEvent> {
  const event: ActivityEvent = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    timestamp: new Date().toISOString(),
  };
  await setDoc(doc(db, COLLECTIONS.ACTIVITY, event.id), clean(event));
  return event;
}

function nextStudentId(students: Student[]): string {
  const year = new Date().getFullYear();
  const numbers = students.map((student) => {
    const match = student.studentId?.match(/THS-\d+-(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `THS-${year}-${String(next).padStart(3, '0')}`;
}

function nextOrderNumber(orders: StitchingOrder[]): string {
  const numbers = orders.map((order) => {
    const match = order.orderNumber?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `#ORD-${next}`;
}

export async function studentIdExists(studentId: string, excludeInternalId?: string): Promise<boolean> {
  const normalized = studentId.trim().toLowerCase();
  if (!normalized) return false;
  const students = await getStudents();
  return students.some(
    (student) => student.studentId?.trim().toLowerCase() === normalized && student.id !== excludeInternalId
  );
}

export async function orderNumberExists(orderNumber: string, excludeInternalId?: string): Promise<boolean> {
  const normalized = orderNumber.trim().toLowerCase();
  if (!normalized) return false;
  const orders = await getOrders();
  return orders.some(
    (order) => order.orderNumber?.trim().toLowerCase() === normalized && order.id !== excludeInternalId
  );
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.STUDENTS, id));
  if (snapshot.exists()) {
    return { ...(snapshot.data() as Student), id: snapshot.id };
  }
  const students = await getStudents();
  return students.find((student) => student.studentId === id);
}

export async function saveStudent(studentData: Omit<Student, 'id'> & { id?: string }): Promise<Student> {
  const students = await getStudents();
  let updatedStudent: Student;

  if (studentData.id) {
    const existing = students.find((student) => student.id === studentData.id);
    updatedStudent = { ...(existing || {}), ...studentData, id: studentData.id } as Student;
    await setDoc(doc(db, COLLECTIONS.STUDENTS, updatedStudent.id), clean(updatedStudent));
    await logActivity('student', `Student record updated: ${updatedStudent.name} (${updatedStudent.studentId})`);
  } else {
    const id = `std_${Date.now()}`;
    updatedStudent = {
      ...studentData,
      id,
      studentId: studentData.studentId?.trim() || nextStudentId(students),
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      skills: studentData.skills || DEFAULT_SKILLS,
      attendanceStats: studentData.attendanceStats || {
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        percentage: 0,
      },
    };
    await setDoc(doc(db, COLLECTIONS.STUDENTS, id), clean(updatedStudent));
    await logActivity('student', `New student registered: ${updatedStudent.name} (${updatedStudent.studentId})`);
  }

  return updatedStudent;
}

export async function deleteStudent(id: string): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.STUDENTS, id));
  await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
  if (snapshot.exists()) {
    const removed = snapshot.data() as Student;
    await logActivity('student', `Student record deleted: ${removed.name} (${removed.studentId})`);
  }
}

export async function getOrderById(id: string): Promise<StitchingOrder | undefined> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
  if (snapshot.exists()) {
    return withLateStatus({ ...(snapshot.data() as StitchingOrder), id: snapshot.id });
  }
  const orders = await getOrders();
  return orders.find((order) => order.orderNumber === id);
}

export async function saveOrder(orderData: Omit<StitchingOrder, 'id'> & { id?: string }): Promise<StitchingOrder> {
  const { isLate, lateDays } = calculateLateStatus(orderData as StitchingOrder);
  let savedOrder: StitchingOrder;

  if (orderData.id) {
    const existingSnap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderData.id));
    const existing = existingSnap.exists() ? (existingSnap.data() as StitchingOrder) : {};
    savedOrder = withLateStatus({
      ...existing,
      ...orderData,
      id: orderData.id,
      isLate: isLate || orderData.status === 'Late',
      lateDays: lateDays > 0 ? lateDays : orderData.lateDays || 0,
    } as StitchingOrder);
    await setDoc(doc(db, COLLECTIONS.ORDERS, savedOrder.id), clean(savedOrder));

    if (savedOrder.status === 'Delivered' && orderData.actualDeliveryDate) {
      const lateLabel = savedOrder.isLate || (savedOrder.lateDays || 0) > 0;
      await logActivity(
        'delivery',
        lateLabel
          ? `Order delivered late: ${savedOrder.orderNumber} (late by ${savedOrder.lateDays || 0} day${(savedOrder.lateDays || 0) === 1 ? '' : 's'})`
          : `Order delivered: ${savedOrder.orderNumber}`
      );
    } else {
      await logActivity('order', `Stitching order updated: ${savedOrder.orderNumber}`);
    }
  } else {
    const orders = await getOrders();
    const id = `ord_${Date.now()}`;
    savedOrder = withLateStatus({
      ...orderData,
      id,
      orderNumber: orderData.orderNumber?.trim() || nextOrderNumber(orders),
      receivedDate: orderData.receivedDate || new Date().toISOString().split('T')[0],
      isLate,
      lateDays,
      balanceDue: (orderData.stitchingCharges || 0) - (orderData.advancePaid || 0),
    });
    await setDoc(doc(db, COLLECTIONS.ORDERS, id), clean(savedOrder));
    await logActivity('order', `New stitching order created: ${savedOrder.orderNumber} for ${savedOrder.customerName}`);
  }

  return savedOrder;
}

export async function deleteOrder(id: string): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
  await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
  if (snapshot.exists()) {
    const removed = snapshot.data() as StitchingOrder;
    await logActivity('order', `Stitching order deleted: ${removed.orderNumber}`);
  }
}

export async function saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
  const id = record.id || `att_${record.date}_${record.session.toLowerCase()}`;
  const saved = { ...record, id };
  await setDoc(doc(db, COLLECTIONS.ATTENDANCE, id), clean(saved));
  await recalculateAllStudentAttendance();
  await logActivity('attendance', `Attendance updated for ${record.session} session (${record.date})`);
}

async function recalculateAllStudentAttendance(): Promise<void> {
  const [students, allRecords] = await Promise.all([getStudents(), getAttendance()]);
  const studentMap: Record<string, { total: number; present: number; absent: number; late: number }> = {};

  students.forEach((student) => {
    studentMap[student.id] = { total: 0, present: 0, absent: 0, late: 0 };
  });

  allRecords.forEach((record) => {
    record.entries?.forEach((entry) => {
      if (!studentMap[entry.studentId]) return;
      studentMap[entry.studentId].total += 1;
      if (entry.status === 'Present') studentMap[entry.studentId].present += 1;
      if (entry.status === 'Absent') studentMap[entry.studentId].absent += 1;
      if (entry.status === 'Late') studentMap[entry.studentId].late += 1;
    });
  });

  const batch = writeBatch(db);
  students.forEach((student) => {
    const stats = studentMap[student.id];
    if (!stats) return;
    const percentage =
      stats.total === 0 ? 0 : Math.round(((stats.present + stats.late * 0.7) / stats.total) * 100);
    const updated: Student = {
      ...student,
      attendanceStats: {
        totalClasses: stats.total,
        present: stats.present,
        absent: stats.absent,
        late: stats.late,
        percentage: Math.min(100, Math.max(0, percentage)),
      },
    };
    batch.set(doc(db, COLLECTIONS.STUDENTS, student.id), clean(updated));
  });
  await batch.commit();
}

export async function submitApplication(
  app: Omit<PublicApplication, 'id' | 'submittedAt' | 'status'>
): Promise<PublicApplication> {
  const newApp: PublicApplication = {
    ...app,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'New',
  };
  await setDoc(doc(db, COLLECTIONS.APPLICATIONS, newApp.id), clean(newApp));
  try {
    await logActivity('application', `New application received from ${newApp.fullName}`);
  } catch {
    // Application is already saved; activity is optional and must not fail the form.
  }
  return newApp;
}

function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

const enrollInFlight = new Map<string, Promise<Student>>();

function currentBatchLabel(): string {
  const year = new Date().getFullYear();
  return `Batch ${year}-A`;
}

function studentFromApplication(app: PublicApplication): Omit<Student, 'id'> {
  return {
    applicationId: app.id,
    name: app.fullName.trim(),
    fatherOrHusbandName: 'Not provided',
    phone: app.phone.trim(),
    age: Number(app.age) || 18,
    address: app.address.trim(),
    session: app.sessionPreference,
    batch: currentBatchLabel(),
    course: app.interestedProgram || 'Basic Tailoring & Pattern Cutting',
    currentLevel: 'Beginner',
    previousExperience: app.previousExperience,
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    avatarUrl: ASSETS.studentAvatar1,
    notes: app.message
      ? `Enrolled from admissions application. Motivation: ${app.message}`
      : 'Enrolled from admissions application.',
    skills: DEFAULT_SKILLS,
    attendanceStats: {
      totalClasses: 0,
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0,
    },
  };
}

function findStudentForApplication(students: Student[], app: PublicApplication): Student | undefined {
  const phone = normalizePhone(app.phone);
  return students.find((student) => {
    if (student.applicationId && student.applicationId === app.id) return true;
    return phone.length >= 7 && normalizePhone(student.phone) === phone;
  });
}

async function enrollApplicantAsStudentInner(app: PublicApplication): Promise<Student> {
  const students = await getStudents();
  const existing = findStudentForApplication(students, app);
  if (existing) {
    if (migrateApplicationStatus(app.status) !== 'Accepted') {
      const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, app.id));
      if (snapshot.exists()) {
        const target = { ...(snapshot.data() as PublicApplication), id: snapshot.id, status: 'Accepted' as const };
        await setDoc(doc(db, COLLECTIONS.APPLICATIONS, app.id), clean(target));
      }
    }
    return existing;
  }

  const saved = await saveStudent(studentFromApplication(app));
  const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, app.id));
  if (snapshot.exists()) {
    const target = { ...(snapshot.data() as PublicApplication), id: snapshot.id, status: 'Accepted' as const };
    await setDoc(doc(db, COLLECTIONS.APPLICATIONS, app.id), clean(target));
    try {
      await logActivity('application', `Application for ${target.fullName} accepted and enrolled as ${saved.studentId}`);
    } catch {
      // Student is already saved.
    }
  }
  return saved;
}

export function enrollApplicantAsStudent(app: PublicApplication): Promise<Student> {
  const pending = enrollInFlight.get(app.id);
  if (pending) return pending;
  const promise = enrollApplicantAsStudentInner(app).finally(() => {
    enrollInFlight.delete(app.id);
  });
  enrollInFlight.set(app.id, promise);
  return promise;
}

export async function syncAcceptedApplicationsToStudents(applications: PublicApplication[]): Promise<void> {
  const accepted = applications.filter((app) => {
    const status = migrateApplicationStatus(app.status);
    return status === 'Accepted';
  });
  for (const app of accepted) {
    await enrollApplicantAsStudent(app);
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  if (!snapshot.exists()) return;
  const target = { ...(snapshot.data() as PublicApplication), id: snapshot.id };
  const nextStatus = migrateApplicationStatus(status);
  target.status = nextStatus;

  if (nextStatus === 'Accepted') {
    await enrollApplicantAsStudent(target);
    return;
  }

  await setDoc(doc(db, COLLECTIONS.APPLICATIONS, id), clean(target));
  await logActivity('application', `Application for ${target.fullName} marked ${target.status}`);
}

export async function deleteApplication(id: string): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  await deleteDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  if (snapshot.exists()) {
    const removed = snapshot.data() as PublicApplication;
    await logActivity('application', `Application deleted: ${removed.fullName}`);
  }
}

export async function submitInquiry(
  inquiry: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status' | 'recordType'>
): Promise<ContactInquiry> {
  const newInquiry: ContactInquiry = {
    ...inquiry,
    id: `inq_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'New',
    recordType: 'contact_inquiry',
  };
  // Use the already-published `applications` collection so public visitors can save
  // without a separate Firestore rules publish for `inquiries`.
  await setDoc(doc(db, COLLECTIONS.APPLICATIONS, newInquiry.id), clean(newInquiry));
  try {
    await logActivity('inquiry', `New contact message from ${newInquiry.name}`);
  } catch {
    // Inquiry is already saved; activity is optional and must not fail the form.
  }
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  if (!snapshot.exists()) return;
  const current = toContactInquiry({ ...(snapshot.data() as ContactInquiry), id });
  const target: ContactInquiry = { ...current, status, recordType: 'contact_inquiry' };
  await setDoc(doc(db, COLLECTIONS.APPLICATIONS, id), clean(target));
  await logActivity('inquiry', `Inquiry from ${target.name} marked ${status}`);
}

export async function deleteInquiry(id: string): Promise<void> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  await deleteDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
  if (snapshot.exists()) {
    const removed = toContactInquiry({ ...(snapshot.data() as ContactInquiry), id });
    await logActivity('inquiry', `Inquiry deleted: ${removed.name}`);
  }
}

export async function clearAllData(): Promise<void> {
  const names = [
    COLLECTIONS.STUDENTS,
    COLLECTIONS.ORDERS,
    COLLECTIONS.ATTENDANCE,
    COLLECTIONS.APPLICATIONS,
    COLLECTIONS.ACTIVITY,
  ];
  for (const name of names) {
    const snapshot = await getDocs(collection(db, name));
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(db);
      docs.slice(i, i + 400).forEach((item) => batch.delete(item.ref));
      await batch.commit();
    }
  }
}

export const resetAllData = clearAllData;
export const resetToInitialData = clearAllData;
export function initializeStorage(): void {
  // Firebase/Firestore is initialized in firebase.ts. No dummy seed data is written.
}
