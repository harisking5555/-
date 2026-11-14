export type AppView = 'website' | 'login' | 'admin';

export type PublicSection =
  | 'home'
  | 'classes'
  | 'darulifta'
  | 'results'
  | 'program'
  | 'gallery'
  | 'admissions';

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
  status: 'فعال' | 'غیر فعال' | 'فارغ التحصیل';
  feeStatus: 'ادا شدہ' | 'باقی';
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
  type: 'رہائشی' | 'غیر رہائشی' | 'آن لائن';
  status: 'زیر غور' | 'منظور' | 'مسترد';
}

export interface JamiaStaff {
  id: string;
  code: string;
  name: string;
  type: 'معلمہ / استاد' | 'عملہ';
  designation: string;
  darjaOrDept: string;
  phone: string;
  salary: number;
  salaryStatus: 'ادا شدہ' | 'باقی';
}

export interface JamiaFeeRecord {
  id: string;
  receiptNo: string;
  studentName: string;
  darja: string;
  month: string;
  amount: number;
  category: 'ماہانہ فیس' | 'تعاون / عطیہ' | 'داخلہ فیس';
  date: string;
  status: 'ادا شدہ' | 'باقی';
}

export interface JamiaResult {
  id: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  darja: string;
  examTitle: string;
  year: string;
  subjects: { name: string; max: number; obtained: number }[];
  totalObtained: number;
  totalMax: number;
  position: string;
  grade: 'ممتاز' | 'جید جداً' | 'جید' | 'مقبول';
}

export interface FiqhQuestion {
  id: string;
  questioner: string;
  city: string;
  category: string;
  question: string;
  answer: string;
  date: string;
  status: 'جواب جاری' | 'زیر غور';
}

export interface OnlineCourse {
  id: string;
  title: string;
  duration: string;
  timing: string;
  teacher: string;
  seats: string;
  description: string;
}

export interface JamiaSiteConfig {
  name: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  whatsappChannel: string;
  tiktokUrl: string;
  heroNotice: string;
  annualProgramTitle: string;
  annualProgramDate: string;
  annualProgramVenue: string;
  annualProgramDetails: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  easypaisa: string;
}
