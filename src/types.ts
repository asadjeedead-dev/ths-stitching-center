export type SessionType = 'Morning' | 'Evening';

export type StudentStatus = 'Active' | 'Completed' | 'Graduated' | 'On Leave' | 'Dropped';

export type SkillLevel = 'Not Started' | 'In Progress' | 'Mastered';

export type SkillKey = 
  | 'basic_stitching' 
  | 'cutting_pattern' 
  | 'frock_making' 
  | 'maxi_design' 
  | 'advanced_garments' 
  | 'bridal_wear' 
  | 'hand_embroidery' 
  | 'machine_maintenance';

export interface SkillDetail {
  level: SkillLevel;
  completedDate?: string;
  notes?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "THS-2024-001"
  applicationId?: string;
  name: string;
  fatherOrHusbandName: string;
  phone: string;
  cnicOrBForm?: string;
  age: number;
  address: string;
  session: SessionType;
  batch: string; // e.g. "Batch 2024-A"
  course: string; // e.g. "Basic Stitching", "Advanced Garment Making"
  currentLevel?: string; // e.g. "Beginner", "Intermediate", "Advanced", "Bridal"
  previousExperience?: string;
  enrollmentDate: string;
  status: StudentStatus;
  avatarUrl: string;
  notes?: string;
  skills: Record<SkillKey, SkillDetail>;
  attendanceStats?: {
    totalClasses: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceStudentEntry {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  session: SessionType;
  entries: AttendanceStudentEntry[];
  recordedBy?: string;
  recordedAt?: string;
}

export type OrderStatus = 'Received' | 'In Progress' | 'Ready' | 'Ready for Pickup' | 'Delivered' | 'Late';

export type LateReason = 
  | 'Customer Requested Design Change'
  | 'Fabric Issue'
  | 'Fabric/Material Delay'
  | 'Embroidery Delay'
  | 'Complex Hand Embroidery'
  | 'Heavy Workload'
  | 'Heavy Order Queue'
  | 'Machine Issue'
  | 'Machine Maintenance'
  | 'Worker Unavailable'
  | 'Worker/Student Unavailable'
  | 'Fitting Adjustment'
  | 'Other';

export interface StitchingOrder {
  id: string;
  orderNumber: string; // e.g. "#ORD-2094"
  customerName: string;
  customerPhone: string;
  garmentType: string; // e.g. "Bridal Lehnga", "Party Frock", "Shalwar Kameez", "Maxi Dress"
  quantity: number;
  receivedDate: string; // YYYY-MM-DD
  expectedDeliveryDate: string; // YYYY-MM-DD
  actualDeliveryDate?: string; // YYYY-MM-DD
  status: OrderStatus;
  stitchingCharges: number; // in PKR
  advancePaid: number;
  balanceDue: number;
  assignedStudentId?: string;
  assignedStudentName?: string;
  specialInstructions?: string;
  lateDeliveryReason?: string;
  customLateReason?: string;
  isLate?: boolean;
  lateDays?: number;
  measurements?: {
    chest?: string;
    waist?: string;
    hip?: string;
    length?: string;
    shoulder?: string;
    sleeves?: string;
    trouserLength?: string;
    notes?: string;
  };
}

export interface PublicApplication {
  id: string;
  fullName: string;
  phone: string;
  age: number;
  address: string;
  sessionPreference: SessionType;
  previousExperience: 'None (Beginner)' | 'Basic Hand Stitching' | 'Machine Experience' | 'Intermediate';
  interestedProgram: string;
  message?: string;
  submittedAt: string;
  status: ApplicationStatus;
}

export type ApplicationStatus = 'New' | 'Reviewed' | 'Accepted' | 'Rejected' | 'Pending' | 'Approved';

export type InquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  area: string;
  message: string;
  submittedAt: string;
  status: InquiryStatus;
}

export interface ActivityEvent {
  id: string;
  type: 'student' | 'order' | 'attendance' | 'application' | 'delivery' | 'inquiry';
  message: string;
  timestamp: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  avatarUrl: string;
  title: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
