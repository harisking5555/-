export type AppView = 'website' | 'login' | 'admin';

export type PublicSection =
  | 'home'
  | 'classes'
  | 'darulifta'
  | 'results'
  | 'program'
  | 'gallery'
  | 'admissions'
  | 'donations';

export type AdminRoute =
  | 'dashboard'
  | 'students'
  | 'admissions'
  | 'teachers'
  | 'attendance'
  | 'fees'
  | 'results'
  | 'darulifta'
  | 'website'
  | 'settings';

export interface JamiaStudent {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  darja: string;
  phone: string;
  city: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  feeStatus: 'Paid' | 'Pending';
  attendanceRate: number;
}

export interface JamiaAdmission {
  id: string;
  studentName: string;
  fatherName: string;
  darja: string;
  phone: string;
  city: string;
  appliedDate: string;
  type: 'Residential' | 'Day Scholar' | 'Online';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface JamiaStaff {
  id: string;
  code: string;
  name: string;
  type: 'Teacher' | 'Staff';
  designation: string;
  darjaOrDept: string;
  phone: string;
  salary: number;
  salaryStatus: 'Paid' | 'Pending';
}

export interface JamiaFeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  darja: string;
  month: string;
  amount: number;
  category: 'Monthly Fee' | 'Donation / Sadaqat' | 'Admission Fee';
  paymentMethod: 'MCB Bank' | 'EasyPaisa' | 'JazzCash' | 'Cash Office';
  date: string;
  status: 'Paid' | 'Pending';
}

export interface JamiaResult {
  id: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  darja: string;
  examTitle: string;
  year: string;
  subjects: { name: string; nameUr?: string; max: number; obtained: number }[];
  totalObtained: number;
  totalMax: number;
  position: string;
  grade: 'Distinction (Mumtaz)' | 'First Class (Jayyid Jiddan)' | 'Second Class (Jayyid)';
}

export interface FiqhQuestion {
  id: string;
  questioner: string;
  city: string;
  category: string;
  question: string;
  answer: string;
  date: string;
  status: 'Published' | 'Pending';
}

export interface OnlineCourse {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  durationEn: string;
  timing: string;
  timingEn: string;
  teacher: string;
  teacherEn: string;
  seats: string;
  seatsEn: string;
  description: string;
  descriptionEn: string;
}

export interface LeadershipProfile {
  id: string;
  order: number;
  badge: string;
  badgeEn: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  image: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  titleEn: string;
  src: string;
}

export interface JamiaSiteConfig {
  name: string;
  subtitle: string;
  websiteDomain: string;
  address: string;
  phone: string;
  email: string;
  whatsappChannel: string;
  facebookUrl: string;
  tiktokUrl: string;
  heroNotice: string;
  annualProgramTitle: string;
  annualProgramDate: string;
  annualProgramVenue: string;
  annualProgramDetails: string;
  bankName: string;
  branchName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  walletOwnerName: string;
  walletNumber: string;
}
