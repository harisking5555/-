import { FormEvent, useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Briefcase,
  CreditCard,
  Scale,
  Award,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Save,
  BookOpen,
  Trash2,
  Upload,
  Database,
  Image as ImageIcon,
} from 'lucide-react';
import {
  AdminRoute,
  FiqhQuestion,
  GalleryPhoto,
  JamiaAdmission,
  JamiaFeeRecord,
  JamiaResult,
  JamiaSiteConfig,
  JamiaStaff,
  JamiaStudent,
  LeadershipProfile,
  OnlineCourse,
} from '../types/jamia';
import { StatCard } from '../components/ui/StatCard';
import { StatusText } from '../components/ui/StatusText';
import { Modal } from '../components/ui/Modal';
import { uploadImageToImgBB } from '../lib/imgbb';

interface AdminPortalPagesProps {
  route: AdminRoute;
  onNavigate: (r: AdminRoute) => void;
  students: JamiaStudent[];
  onAddStudent: (s: JamiaStudent) => void;
  admissions: JamiaAdmission[];
  onUpdateAdmissionStatus: (id: string, status: JamiaAdmission['status']) => void;
  staff: JamiaStaff[];
  onAddStaff: (m: JamiaStaff) => void;
  onToggleSalary: (id: string) => void;
  onSaveAttendance: (date: string, marks: Record<string, 'Present' | 'Absent' | 'Leave'>) => void;
  fees: JamiaFeeRecord[];
  onAddFee: (f: JamiaFeeRecord) => void;
  onMarkFeePaid: (id: string) => void;
  results: JamiaResult[];
  onAddResult: (r: JamiaResult) => void;
  onDeleteResult: (id: string) => void;
  questions: FiqhQuestion[];
  onAnswerQuestion: (id: string, answer: string) => void;
  courses: OnlineCourse[];
  onAddCourse: (c: OnlineCourse) => void;
  onDeleteCourse: (id: string) => void;
  leadership: LeadershipProfile[];
  onUpdateLeadership: (leader: LeadershipProfile) => void;
  gallery: GalleryPhoto[];
  onAddGalleryPhoto: (photo: GalleryPhoto) => void;
  onDeleteGalleryPhoto: (id: string) => void;
  siteConfig: JamiaSiteConfig;
  onUpdateSiteConfig: (cfg: JamiaSiteConfig) => void;
  onSeedDatabase: () => Promise<void>;
  adminEmail: string;
  onViewWebsite: () => void;
  onLogout: () => void;
  onNotify: (msg: string) => void;
}

export function AdminPortalPages({
  route,
  onNavigate,
  students,
  onAddStudent,
  admissions,
  onUpdateAdmissionStatus,
  staff,
  onAddStaff,
  onToggleSalary,
  onSaveAttendance,
  fees,
  onAddFee,
  onMarkFeePaid,
  results,
  onAddResult,
  onDeleteResult,
  questions,
  onAnswerQuestion,
  courses,
  onAddCourse,
  onDeleteCourse,
  leadership,
  onUpdateLeadership,
  gallery,
  onAddGalleryPhoto,
  onDeleteGalleryPhoto,
  siteConfig,
  onUpdateSiteConfig,
  onSeedDatabase,
  adminEmail,
  onViewWebsite,
  onLogout,
  onNotify,
}: AdminPortalPagesProps) {
  // Students search & modal
  const [stuSearch, setStuSearch] = useState('');
  const [addStuOpen, setAddStuOpen] = useState(false);
  const [sName, setSName] = useState('');
  const [sFather, setSFather] = useState('');
  const [sDarja, setSDarja] = useState('Darja Khamisa (Alimah)');
  const [sPhone, setSPhone] = useState('');
  const [sCity, setSCity] = useState('Kasur');
  const [selectedStudentCard, setSelectedStudentCard] = useState<JamiaStudent | null>(null);

  // Admissions filter
  const [admTab, setAdmTab] = useState<'All' | JamiaAdmission['status']>('All');

  // Staff modal
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [stName, setStName] = useState('');
  const [stType, setStType] = useState<JamiaStaff['type']>('Teacher');
  const [stDesig, setStDesig] = useState('');
  const [stPhone, setStPhone] = useState('');
  const [stSalary, setStSalary] = useState('30000');

  // Attendance state
  const [attDate, setAttDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attMarks, setAttMarks] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({});

  // Fees modal & filter
  const [feeFilter, setFeeFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [addFeeOpen, setAddFeeOpen] = useState(false);
  const [fStudent, setFStudent] = useState('');
  const [fAmount, setFAmount] = useState('2500');
  const [fCat, setFCat] = useState<JamiaFeeRecord['category']>('Monthly Fee');
  const [fMethod, setFMethod] = useState<JamiaFeeRecord['paymentMethod']>('MCB Bank');
  const [printReceipt, setPrintReceipt] = useState<JamiaFeeRecord | null>(null);

  // Results modal
  const [addResOpen, setAddResOpen] = useState(false);
  const [rRoll, setRRoll] = useState('');
  const [rName, setRName] = useState('');
  const [rFather, setRFather] = useState('');
  const [rDarja, setRDarja] = useState('Darja Rabia');
  const [rTotal, setRTotal] = useState('345');

  // Darul Ifta answer modal
  const [ansTarget, setAnsTarget] = useState<FiqhQuestion | null>(null);
  const [ansText, setAnsText] = useState('');

  // Online Course modal
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [cTitleUr, setCTitleUr] = useState('');
  const [cTitleEn, setCTitleEn] = useState('');
  const [cDuration, setCDuration] = useState('1-Year Certificate Course');
  const [cTiming, setCTiming] = useState('Morning 9:00 AM – 11:00 AM');
  const [cTeacher, setCTeacher] = useState('Qualified Alimahs & Muftis');
  const [cDesc, setCDesc] = useState('');

  // Website CMS local draft & ImgBB upload states
  const [cmsDraft, setCmsDraft] = useState<JamiaSiteConfig>(siteConfig);
  const [uploadingLeaderId, setUploadingLeaderId] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryTitleEn, setNewGalleryTitleEn] = useState('');
  const [newGalleryTitleUr, setNewGalleryTitleUr] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setCmsDraft(siteConfig);
  }, [siteConfig]);

  const collectedFees = fees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending').length;
  const pendingQuestions = questions.filter((q) => q.status === 'Pending').length;

  // 1. DASHBOARD
  if (route === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Active Students"
            value={String(students.length)}
            delta="On-Campus & Online Programs"
            deltaTone="positive"
            icon={Users}
            onClick={() => onNavigate('students')}
          />
          <StatCard
            label="Pending Admissions"
            value={String(pendingAdmissions)}
            delta="Submitted via Public Website"
            icon={UserPlus}
            onClick={() => onNavigate('admissions')}
          />
          <StatCard
            label="Collected Fees & Donations"
            value={`PKR ${collectedFees.toLocaleString()}`}
            delta="November 2026 Ledger"
            deltaTone="positive"
            icon={CreditCard}
            onClick={() => onNavigate('fees')}
          />
          <StatCard
            label="Pending Darul Ifta Questions"
            value={String(pendingQuestions)}
            delta="Awaiting Scholar Review"
            icon={Scale}
            onClick={() => onNavigate('darulifta')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Admissions */}
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-[#0F294A]">Recent Online Admissions</h2>
              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="cursor-pointer text-xs font-bold text-[#2563EB] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {admissions.slice(0, 4).map((adm) => (
                <div key={adm.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="font-bold text-slate-900">{adm.studentName}</p>
                    <p className="text-slate-500">
                      {adm.darja} · {adm.type}
                    </p>
                  </div>
                  <StatusText status={adm.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Darul Ifta Questions */}
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-[#0F294A]">Recent Darul Ifta Questions</h2>
              <button
                type="button"
                onClick={() => onNavigate('darulifta')}
                className="cursor-pointer text-xs font-bold text-[#2563EB] hover:underline"
              >
                Answer Now
              </button>
            </div>
            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {questions.slice(0, 4).map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{q.question}</p>
                    <p className="text-slate-500">
                      Asked by: {q.questioner} ({q.city})
                    </p>
                  </div>
                  <StatusText status={q.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. STUDENTS
  if (route === 'students') {
    const q = stuSearch.trim().toLowerCase();
    const filtered = students.filter(
      (s) =>
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.darja.toLowerCase().includes(q)
    );

    const handleCreateStudent = (e: FormEvent) => {
      e.preventDefault();
      if (!sName.trim()) return;
      const item: JamiaStudent = {
        id: `ST-${Date.now()}`,
        rollNo: `JB-2026-${String(students.length + 1).padStart(2, '0')}`,
        name: sName.trim(),
        fatherName: sFather.trim() || '—',
        darja: sDarja,
        phone: sPhone.trim() || '0300-0000000',
        city: sCity.trim() || 'Kasur',
        admissionDate: new Date().toISOString().slice(0, 10),
        status: 'Active',
        feeStatus: 'Paid',
        attendanceRate: 100,
      };
      onAddStudent(item);
      onNotify(`Student ${item.name} added to directory.`);
      setAddStuOpen(false);
      setSName('');
      setSFather('');
      setSPhone('');
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={stuSearch}
              onChange={(e) => setStuSearch(e.target.value)}
              placeholder="Search name, roll no, or darja..."
              className="h-9 w-full border border-slate-300 bg-slate-50 pr-3 pl-9 text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => setAddStuOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Student</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student & Father Name</th>
                <th className="px-4 py-3">Class / Darja</th>
                <th className="px-4 py-3">Phone & City</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Fee Status</th>
                <th className="px-4 py-3">ID Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{s.rollNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">D/O {s.fatherName}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.darja}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono-num text-slate-800">{s.phone}</p>
                    <p className="text-[11px] text-slate-500">{s.city}</p>
                  </td>
                  <td className="px-4 py-3 font-mono-num font-bold text-emerald-700">
                    {s.attendanceRate}%
                  </td>
                  <td className="px-4 py-3">
                    <StatusText status={s.feeStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentCard(s)}
                      className="cursor-pointer border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-[#0F294A] hover:bg-slate-50"
                    >
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addStuOpen} onClose={() => setAddStuOpen(false)} title="Register New Student" size="sm">
          <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">Student Name *</label>
              <input
                required
                type="text"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Father Name</label>
              <input
                type="text"
                value={sFather}
                onChange={(e) => setSFather(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Class / Darja</label>
              <input
                type="text"
                value={sDarja}
                onChange={(e) => setSDarja(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">Phone</label>
                <input
                  type="text"
                  value={sPhone}
                  onChange={(e) => setSPhone(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">City</label>
                <input
                  type="text"
                  value={sCity}
                  onChange={(e) => setSCity(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddStuOpen(false)}
                className="cursor-pointer border border-slate-300 px-4 py-2 font-bold text-slate-700"
              >
                Cancel
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                Save Student
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={Boolean(selectedStudentCard)}
          onClose={() => setSelectedStudentCard(null)}
          title="Student Identity Card"
          size="sm"
        >
          {selectedStudentCard && (
            <div className="space-y-4 text-xs">
              <div className="border-2 border-[#0F294A] bg-white p-4">
                <p className="border-b border-slate-200 pb-2 text-center font-extrabold text-[#0F294A]">
                  Markazi Jamia tul Banat Kasur
                </p>
                <div className="mt-3 space-y-1.5">
                  <p>Student Name: <strong>{selectedStudentCard.name}</strong></p>
                  <p>Father Name: <strong>{selectedStudentCard.fatherName}</strong></p>
                  <p>Roll No: <strong className="font-mono-num">{selectedStudentCard.rollNo}</strong></p>
                  <p>Class / Darja: <strong>{selectedStudentCard.darja}</strong></p>
                  <p>Phone: <strong className="font-mono-num">{selectedStudentCard.phone}</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 bg-[#0F294A] py-2 font-bold text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print ID Card</span>
              </button>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // 3. ADMISSIONS
  if (route === 'admissions') {
    const visible = admissions.filter((a) => admTab === 'All' || a.status === admTab);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border border-slate-200 bg-white p-4">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setAdmTab(tab)}
              className={`cursor-pointer px-3.5 py-1.5 text-xs font-bold ${
                admTab === tab ? 'bg-[#0F294A] text-white' : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">App ID</th>
                <th className="px-4 py-3">Applicant & Father</th>
                <th className="px-4 py-3">Course / Darja</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((adm) => (
                <tr key={adm.id}>
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{adm.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{adm.studentName}</p>
                    <p className="text-[11px] text-slate-500">D/O {adm.fatherName}</p>
                  </td>
                  <td className="px-4 py-3">{adm.darja}</td>
                  <td className="px-4 py-3">{adm.type}</td>
                  <td className="px-4 py-3 font-mono-num">{adm.phone}</td>
                  <td className="px-4 py-3">
                    <StatusText status={adm.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAdmissionStatus(adm.id, 'Approved');
                          onNotify(`Admission approved for ${adm.studentName}.`);
                        }}
                        className="cursor-pointer bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAdmissionStatus(adm.id, 'Rejected');
                          onNotify(`Application rejected for ${adm.studentName}.`);
                        }}
                        className="cursor-pointer bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. TEACHERS & STAFF
  if (route === 'teachers') {
    const handleAddMember = (e: FormEvent) => {
      e.preventDefault();
      if (!stName.trim()) return;
      const item: JamiaStaff = {
        id: `EMP-${Date.now()}`,
        code: `${stType === 'Teacher' ? 'M' : 'S'}-${String(staff.length + 1).padStart(2, '0')}`,
        name: stName.trim(),
        type: stType,
        designation: stDesig.trim() || 'Instructor',
        darjaOrDept: 'Jamia Campus',
        phone: stPhone.trim() || '0300-0000000',
        salary: Number(stSalary) || 25000,
        salaryStatus: 'Pending',
      };
      onAddStaff(item);
      onNotify(`${item.name} added to staff directory.`);
      setAddStaffOpen(false);
      setStName('');
      setStDesig('');
      setStPhone('');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F294A]">
            <Briefcase className="h-4 w-4" />
            <span>Teachers, Ulama & Support Staff ({staff.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setAddStaffOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Teacher / Staff</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name & Designation</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Monthly Salary</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{m.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-500">{m.designation}</p>
                  </td>
                  <td className="px-4 py-3">{m.darjaOrDept}</td>
                  <td className="px-4 py-3 font-mono-num">{m.phone}</td>
                  <td className="px-4 py-3 font-mono-num font-bold">
                    {m.salary === 0 ? 'Honorary (Fi Sabilillah)' : `PKR ${m.salary.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleSalary(m.id)}
                      className="cursor-pointer"
                      title="Click to toggle salary status"
                    >
                      <StatusText status={m.salaryStatus} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addStaffOpen} onClose={() => setAddStaffOpen(false)} title="Add Teacher / Staff" size="sm">
          <form onSubmit={handleAddMember} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">Full Name *</label>
              <input
                required
                type="text"
                value={stName}
                onChange={(e) => setStName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Type</label>
              <select
                value={stType}
                onChange={(e) => setStType(e.target.value as JamiaStaff['type'])}
                className="h-9 w-full border border-slate-300 px-2"
              >
                <option value="Teacher">Teacher / Ustazah</option>
                <option value="Staff">Administrative Staff</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-bold">Designation</label>
              <input
                type="text"
                value={stDesig}
                onChange={(e) => setStDesig(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">Phone</label>
                <input
                  type="text"
                  value={stPhone}
                  onChange={(e) => setStPhone(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">Salary (PKR)</label>
                <input
                  type="number"
                  value={stSalary}
                  onChange={(e) => setStSalary(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddStaffOpen(false)} className="cursor-pointer border border-slate-300 px-4 py-2 font-bold">
                Cancel
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                Save Member
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 5. ATTENDANCE
  if (route === 'attendance') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#0F294A]">Daily Attendance Register</span>
            <input
              type="date"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="h-9 border border-slate-300 px-2 font-mono-num text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const payload: Record<string, 'Present' | 'Absent' | 'Leave'> = {};
              students.forEach((st) => {
                payload[st.id] = attMarks[st.id] ?? 'Present';
              });
              onSaveAttendance(attDate, payload);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Attendance to Firestore</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class / Darja</th>
                <th className="px-4 py-3">Today&apos;s Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const status = attMarks[st.id] ?? 'Present';
                return (
                  <tr key={st.id}>
                    <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{st.rollNo}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{st.name}</td>
                    <td className="px-4 py-3">{st.darja}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(['Present', 'Absent', 'Leave'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAttMarks((prev) => ({ ...prev, [st.id]: opt }))}
                            className={`cursor-pointer border px-3 py-1 text-[11px] font-bold ${
                              status === opt
                                ? opt === 'Present'
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : opt === 'Absent'
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : 'border-amber-600 bg-amber-600 text-white'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 6. FEES & DONATIONS
  if (route === 'fees') {
    const visible = fees.filter((f) => feeFilter === 'All' || f.status === feeFilter);

    const handleCreateFee = (e: FormEvent) => {
      e.preventDefault();
      if (!fStudent.trim()) return;
      const item: JamiaFeeRecord = {
        id: `F-${Date.now()}`,
        receiptNo: `RCP-${1050 + Math.floor(Math.random() * 8900)}`,
        studentName: fStudent.trim(),
        darja: 'Jamia Office',
        month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        amount: Number(fAmount) || 2000,
        category: fCat,
        paymentMethod: fMethod,
        date: new Date().toISOString().slice(0, 10),
        status: 'Paid',
      };
      onAddFee(item);
      onNotify(`Receipt ${item.receiptNo} recorded.`);
      setAddFeeOpen(false);
      setFStudent('');
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="flex gap-1.5">
            {(['All', 'Paid', 'Pending'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFeeFilter(t)}
                className={`cursor-pointer px-3 py-1.5 text-xs font-bold ${
                  feeFilter === t ? 'bg-[#0F294A] text-white' : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAddFeeOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Record Fee / Donation</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Receipt #</th>
                <th className="px-4 py-3">Student / Donor</th>
                <th className="px-4 py-3">Category & Method</th>
                <th className="px-4 py-3">Amount (PKR)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{f.receiptNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{f.studentName}</p>
                    <p className="text-[11px] text-slate-500">{f.darja} · {f.month}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{f.category}</p>
                    <p className="text-[11px] text-slate-500">{f.paymentMethod}</p>
                  </td>
                  <td className="px-4 py-3 font-mono-num font-bold">PKR {f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusText status={f.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPrintReceipt(f)}
                        className="inline-flex cursor-pointer items-center gap-1 border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-[#0F294A]"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Receipt</span>
                      </button>
                      {f.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => {
                            onMarkFeePaid(f.id);
                            onNotify(`Receipt ${f.receiptNo} marked as Paid.`);
                          }}
                          className="cursor-pointer bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addFeeOpen} onClose={() => setAddFeeOpen(false)} title="Record Fee or Donation" size="sm">
          <form onSubmit={handleCreateFee} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">Student or Donor Name *</label>
              <input
                required
                type="text"
                value={fStudent}
                onChange={(e) => setFStudent(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">Category</label>
                <select
                  value={fCat}
                  onChange={(e) => setFCat(e.target.value as JamiaFeeRecord['category'])}
                  className="h-9 w-full border border-slate-300 px-2"
                >
                  <option value="Monthly Fee">Monthly Fee</option>
                  <option value="Donation / Sadaqat">Donation / Sadaqat</option>
                  <option value="Admission Fee">Admission Fee</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-bold">Payment Method</label>
                <select
                  value={fMethod}
                  onChange={(e) => setFMethod(e.target.value as JamiaFeeRecord['paymentMethod'])}
                  className="h-9 w-full border border-slate-300 px-2"
                >
                  <option value="MCB Bank">MCB Bank</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Cash Office">Cash Office</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block font-bold">Amount (PKR)</label>
              <input
                required
                type="number"
                value={fAmount}
                onChange={(e) => setFAmount(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddFeeOpen(false)} className="cursor-pointer border border-slate-300 px-4 py-2 font-bold">
                Cancel
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                Issue Receipt
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={Boolean(printReceipt)} onClose={() => setPrintReceipt(null)} title="Official Payment Receipt" size="sm">
          {printReceipt && (
            <div className="space-y-4 text-xs">
              <div className="border border-slate-300 bg-white p-4">
                <p className="text-center font-extrabold text-[#0F294A]">Markazi Jamia tul Banat Kasur</p>
                <p className="mt-1 text-center font-mono-num text-slate-500">{printReceipt.receiptNo}</p>
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                  <p>Name: <strong>{printReceipt.studentName}</strong></p>
                  <p>Category: <strong>{printReceipt.category}</strong></p>
                  <p>Method: <strong>{printReceipt.paymentMethod}</strong></p>
                  <p>Date: <strong className="font-mono-num">{printReceipt.date}</strong></p>
                  <p className="text-sm font-bold text-[#0F294A]">
                    Amount: <span className="font-mono-num">PKR {printReceipt.amount.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 bg-[#0F294A] py-2 font-bold text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // 7. EXAMS & RESULTS
  if (route === 'results') {
    const handleAddRes = (e: FormEvent) => {
      e.preventDefault();
      if (!rName.trim() || !rRoll.trim()) return;
      const obt = Number(rTotal) || 320;
      const item: JamiaResult = {
        id: `RES-${Date.now()}`,
        rollNo: rRoll.trim(),
        studentName: rName.trim(),
        fatherName: rFather.trim() || '—',
        darja: rDarja,
        examTitle: 'Tanzeem-ul-Madaris Annual Exam',
        year: '2026',
        subjects: [
          { name: 'Tafsir & Hadith', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'Fiqh & Usul-ul-Fiqh', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'Arabic Grammar (Nahw & Sarf)', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'Tajweed & Creed', max: 100, obtained: Math.min(100, obt - 3 * Math.round(obt / 4)) },
        ],
        totalObtained: obt,
        totalMax: 400,
        position: obt >= 350 ? 'Distinction Rank' : 'Passed',
        grade:
          obt >= 340
            ? 'Distinction (Mumtaz)'
            : obt >= 280
              ? 'First Class (Jayyid Jiddan)'
              : 'Second Class (Jayyid)',
      };
      onAddResult(item);
      onNotify(`Result published for ${item.studentName}. Now searchable on the Public Website.`);
      setAddResOpen(false);
      setRRoll('');
      setRName('');
      setRFather('');
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F294A]">
            <Award className="h-4 w-4" />
            <span>Examination Results (Synced with Public Result Search)</span>
          </div>
          <button
            type="button"
            onClick={() => setAddResOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Publish New Result</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class / Darja</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Standing</th>
                <th className="px-4 py-3">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{r.rollNo}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{r.studentName}</td>
                  <td className="px-4 py-3">{r.darja}</td>
                  <td className="px-4 py-3 font-mono-num font-bold">
                    {r.totalObtained} / {r.totalMax}
                  </td>
                  <td className="px-4 py-3">
                    <StatusText status={r.grade} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{r.position}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onDeleteResult(r.id)}
                      className="cursor-pointer border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="inline h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addResOpen} onClose={() => setAddResOpen(false)} title="Publish Student Result" size="sm">
          <form onSubmit={handleAddRes} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">Roll Number *</label>
              <input
                required
                type="text"
                value={rRoll}
                onChange={(e) => setRRoll(e.target.value)}
                placeholder="JB-2026-09"
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Student Name *</label>
              <input
                required
                type="text"
                value={rName}
                onChange={(e) => setRName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Father Name</label>
              <input
                type="text"
                value={rFather}
                onChange={(e) => setRFather(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">Class / Darja</label>
                <input
                  type="text"
                  value={rDarja}
                  onChange={(e) => setRDarja(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">Obtained Marks (out of 400)</label>
                <input
                  type="number"
                  max={400}
                  min={0}
                  value={rTotal}
                  onChange={(e) => setRTotal(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddResOpen(false)} className="cursor-pointer border border-slate-300 px-4 py-2 font-bold">
                Cancel
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                Publish Result
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 8. DARUL IFTA & ONLINE CLASSES
  if (route === 'darulifta') {
    return (
      <div className="space-y-6">
        <div className="border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-extrabold text-[#0F294A]">Online Darul Ifta (Fiqhi Questions)</h2>
          <p className="mt-1 text-xs text-slate-600">
            Write and publish official answers to pending questions — published answers appear live on the Public Website.
          </p>
          <div className="mt-4 space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="border border-slate-200 bg-slate-50 p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#0F294A]">
                    {q.id} · Questioner: {q.questioner} ({q.city}) — {q.category}
                  </span>
                  <StatusText status={q.status} />
                </div>
                <p className="mt-2 font-semibold text-slate-900">Q: {q.question}</p>
                {q.answer ? (
                  <p className="mt-2 border-l-2 border-emerald-600 pl-3 text-slate-700">
                    <strong>Answer:</strong> {q.answer}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAnsTarget(q);
                      setAnsText('');
                    }}
                    className="mt-3 cursor-pointer bg-[#2563EB] px-3.5 py-1.5 font-bold text-white"
                  >
                    Write & Publish Answer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F294A]">
              <BookOpen className="h-4 w-4" />
              <span>Active Online Classes ({courses.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setAddCourseOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-3.5 py-1.5 text-xs font-bold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Online Class</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {courses.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 border border-slate-200 p-3.5 text-xs">
                <div>
                  <p className="font-bold text-[#0F294A]">{c.titleEn}</p>
                  <p className="mt-1 text-slate-600">
                    {c.timingEn} · {c.durationEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCourse(c.id)}
                  title="Delete course"
                  className="cursor-pointer border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Modal open={addCourseOpen} onClose={() => setAddCourseOpen(false)} title="Add Online Class / Program" size="sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!cTitleEn.trim()) return;
              const item: OnlineCourse = {
                id: `course-${Date.now()}`,
                title: cTitleUr.trim() || cTitleEn.trim(),
                titleEn: cTitleEn.trim(),
                duration: cDuration.trim(),
                durationEn: cDuration.trim(),
                timing: cTiming.trim(),
                timingEn: cTiming.trim(),
                teacher: cTeacher.trim(),
                teacherEn: cTeacher.trim(),
                seats: 'داخلے جاری ہیں',
                seatsEn: 'Admissions Open',
                description: cDesc.trim() || cTitleEn.trim(),
                descriptionEn: cDesc.trim() || cTitleEn.trim(),
              };
              onAddCourse(item);
              setAddCourseOpen(false);
              setCTitleEn('');
              setCTitleUr('');
              setCDesc('');
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="mb-1 block font-bold">Course Title (English) *</label>
              <input
                required
                type="text"
                value={cTitleEn}
                onChange={(e) => setCTitleEn(e.target.value)}
                placeholder="e.g. Tafsir & Hadith Diploma"
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Course Title (Urdu)</label>
              <input
                type="text"
                dir="rtl"
                value={cTitleUr}
                onChange={(e) => setCTitleUr(e.target.value)}
                placeholder="تفسیر و حدیث کورس"
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">Duration</label>
                <input
                  type="text"
                  value={cDuration}
                  onChange={(e) => setCDuration(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">Timings</label>
                <input
                  type="text"
                  value={cTiming}
                  onChange={(e) => setCTiming(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-bold">Instructor / Faculty</label>
              <input
                type="text"
                value={cTeacher}
                onChange={(e) => setCTeacher(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">Description</label>
              <textarea
                rows={2}
                value={cDesc}
                onChange={(e) => setCDesc(e.target.value)}
                className="w-full border border-slate-300 p-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddCourseOpen(false)}
                className="cursor-pointer border border-slate-300 px-4 py-2 font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                Save to Firestore
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={Boolean(ansTarget)}
          onClose={() => setAnsTarget(null)}
          title="Darul Ifta — Publish Answer"
          size="md"
        >
          {ansTarget && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!ansText.trim()) return;
                onAnswerQuestion(ansTarget.id, ansText.trim());
                onNotify(`Answer for ${ansTarget.id} published to the Public Website.`);
                setAnsTarget(null);
              }}
              className="space-y-3 text-xs"
            >
              <p className="border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900">
                {ansTarget.question}
              </p>
              <textarea
                required
                rows={4}
                value={ansText}
                onChange={(e) => setAnsText(e.target.value)}
                placeholder="Write authentic Sharia ruling with references..."
                className="w-full border border-slate-300 p-3"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setAnsTarget(null)} className="cursor-pointer border border-slate-300 px-4 py-2 font-bold">
                  Cancel
                </button>
                <button type="submit" className="cursor-pointer bg-emerald-600 px-4 py-2 font-bold text-white">
                  Publish Answer
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  // 9. WEBSITE SETTINGS & IMGBB MEDIA CMS
  if (route === 'website') {
    const handleSaveCms = (e: FormEvent) => {
      e.preventDefault();
      onUpdateSiteConfig(cmsDraft);
    };

    const handleLeaderImageUpload = async (leader: LeadershipProfile, file: File | undefined) => {
      if (!file) return;
      setUploadingLeaderId(leader.id);
      try {
        const url = await uploadImageToImgBB(file);
        onUpdateLeadership({ ...leader, image: url });
        onNotify(`Updated portrait for ${leader.badgeEn} via ImgBB & Firestore.`);
      } catch (err) {
        onNotify(err instanceof Error ? err.message : 'ImgBB upload failed.');
      } finally {
        setUploadingLeaderId(null);
      }
    };

    const handleGalleryUpload = async (file: File | undefined) => {
      if (!file) return;
      setUploadingGallery(true);
      try {
        const url = await uploadImageToImgBB(file);
        const photo: GalleryPhoto = {
          id: `gal-${Date.now()}`,
          title: newGalleryTitleUr.trim() || newGalleryTitleEn.trim() || 'جامعہ تقریب',
          titleEn: newGalleryTitleEn.trim() || 'Jamia Campus Highlight',
          src: url,
        };
        onAddGalleryPhoto(photo);
        setNewGalleryTitleEn('');
        setNewGalleryTitleUr('');
        onNotify('Photo uploaded to ImgBB and saved to Firestore Gallery.');
      } catch (err) {
        onNotify(err instanceof Error ? err.message : 'Gallery upload failed.');
      } finally {
        setUploadingGallery(false);
      }
    };

    return (
      <div className="space-y-6 text-xs">
        <form onSubmit={handleSaveCms} className="space-y-4 border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0F294A]">Public Website, Social Links & Bank Settings</h2>
              <p className="text-slate-500">All updates save to Firebase Firestore and reflect immediately on {cmsDraft.websiteDomain}.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  try {
                    await onSeedDatabase();
                  } finally {
                    setSeeding(false);
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 bg-slate-50 px-3.5 py-2 font-bold text-[#0F294A] hover:bg-slate-100 disabled:opacity-60"
              >
                <Database className="h-3.5 w-3.5" />
                <span>{seeding ? 'Syncing...' : 'Sync Default Data to Firestore'}</span>
              </button>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 font-bold text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-bold text-slate-800">Institution Name (Urdu)</label>
              <input
                type="text"
                dir="rtl"
                value={cmsDraft.name}
                onChange={(e) => setCmsDraft({ ...cmsDraft, name: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Website Domain</label>
              <input
                type="text"
                value={cmsDraft.websiteDomain}
                onChange={(e) => setCmsDraft({ ...cmsDraft, websiteDomain: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Official Phone</label>
              <input
                type="text"
                value={cmsDraft.phone}
                onChange={(e) => setCmsDraft({ ...cmsDraft, phone: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Facebook Page URL</label>
              <input
                type="url"
                value={cmsDraft.facebookUrl}
                onChange={(e) => setCmsDraft({ ...cmsDraft, facebookUrl: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">WhatsApp Channel URL</label>
              <input
                type="url"
                value={cmsDraft.whatsappChannel}
                onChange={(e) => setCmsDraft({ ...cmsDraft, whatsappChannel: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">TikTok URL</label>
              <input
                type="url"
                value={cmsDraft.tiktokUrl}
                onChange={(e) => setCmsDraft({ ...cmsDraft, tiktokUrl: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-bold text-slate-800">Top Marquee Notice (Urdu)</label>
              <input
                type="text"
                dir="rtl"
                value={cmsDraft.heroNotice}
                onChange={(e) => setCmsDraft({ ...cmsDraft, heroNotice: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Bank Name</label>
              <input
                type="text"
                value={cmsDraft.bankName}
                onChange={(e) => setCmsDraft({ ...cmsDraft, bankName: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Branch Code & Address</label>
              <input
                type="text"
                value={cmsDraft.branchName}
                onChange={(e) => setCmsDraft({ ...cmsDraft, branchName: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Account Title</label>
              <input
                type="text"
                value={cmsDraft.accountTitle}
                onChange={(e) => setCmsDraft({ ...cmsDraft, accountTitle: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">Account Number</label>
              <input
                type="text"
                value={cmsDraft.accountNumber}
                onChange={(e) => setCmsDraft({ ...cmsDraft, accountNumber: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold text-slate-800">IBAN</label>
              <input
                type="text"
                value={cmsDraft.iban}
                onChange={(e) => setCmsDraft({ ...cmsDraft, iban: e.target.value })}
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold text-slate-800">Wallet Account Name</label>
                <input
                  type="text"
                  value={cmsDraft.walletOwnerName}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, walletOwnerName: e.target.value })}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-slate-800">EasyPaisa / JazzCash No</label>
                <input
                  type="text"
                  value={cmsDraft.walletNumber}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, walletNumber: e.target.value })}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Founders & Spiritual Leadership Portraits (ImgBB Upload) */}
        <div className="border border-slate-200 bg-white p-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-[#0F294A]">
              Founders & Spiritual Leadership Portraits (ImgBB Upload)
            </h3>
            <p className="text-slate-500">
              Upload or replace any of the 3 Ulama portraits using ImgBB and save directly to Firestore.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...leadership]
              .sort((a, b) => a.order - b.order)
              .map((leader) => (
                <div key={leader.id} className="flex flex-col justify-between border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <span className="inline-block border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0F294A]">
                      {leader.badgeEn}
                    </span>
                    <div className="mt-2 flex h-44 items-center justify-center border border-slate-200 bg-white p-2">
                      <img
                        src={leader.image}
                        alt={leader.nameEn}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="mt-2 font-bold text-slate-900">{leader.nameEn}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{leader.roleEn}</p>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                    <label className="flex cursor-pointer items-center justify-center gap-1.5 bg-[#0F294A] px-3 py-2 font-bold text-white hover:bg-[#193B68]">
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {uploadingLeaderId === leader.id
                          ? 'Uploading to ImgBB...'
                          : 'Upload New Photo (ImgBB)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingLeaderId === leader.id}
                        onChange={(e) => handleLeaderImageUpload(leader, e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Photo Gallery Manager (ImgBB Upload) */}
        <div className="border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#0F294A]" />
              <div>
                <h3 className="text-sm font-extrabold text-[#0F294A]">
                  Campus Photo Gallery ({gallery.length} Photos)
                </h3>
                <p className="text-slate-500">Upload event photos directly via ImgBB to Firestore.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <input
              type="text"
              value={newGalleryTitleEn}
              onChange={(e) => setNewGalleryTitleEn(e.target.value)}
              placeholder="Photo Caption (English)"
              className="h-9 border border-slate-300 bg-white px-3"
            />
            <input
              type="text"
              dir="rtl"
              value={newGalleryTitleUr}
              onChange={(e) => setNewGalleryTitleUr(e.target.value)}
              placeholder="تصویر کا عنوان (اردو)"
              className="h-9 border border-slate-300 bg-white px-3"
            />
            <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 bg-emerald-700 px-3 font-bold text-white hover:bg-emerald-800">
              <Upload className="h-3.5 w-3.5" />
              <span>{uploadingGallery ? 'Uploading...' : 'Select & Upload Photo (ImgBB)'}</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingGallery}
                onChange={(e) => handleGalleryUpload(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((photo) => (
              <div key={photo.id} className="border border-slate-200 bg-white">
                <img src={photo.src} alt={photo.titleEn} className="h-28 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="truncate font-semibold text-slate-700">{photo.titleEn}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteGalleryPhoto(photo.id)}
                    title="Delete photo"
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. ACCOUNT SETTINGS
  return (
    <div className="space-y-4 border border-slate-200 bg-white p-6 text-xs">
      <h2 className="text-sm font-extrabold text-[#0F294A]">Admin Account & Session Settings</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-slate-500">Signed-in Admin Email</p>
          <p className="mt-1 font-mono-num font-bold text-[#0F294A]">{adminEmail}</p>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-slate-500">Institution</p>
          <p className="mt-1 font-bold text-slate-900">Markazi Jamia tul Banat Purana Lari Adda Kasur</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onViewWebsite}
          className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white"
        >
          View Public Website
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="cursor-pointer bg-red-600 px-4 py-2 font-bold text-white"
        >
          Logout from Admin Panel
        </button>
      </div>
    </div>
  );
}
