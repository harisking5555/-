import { FormEvent, useState } from 'react';
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
} from 'lucide-react';
import {
  AdminRoute,
  FiqhQuestion,
  JamiaAdmission,
  JamiaFeeRecord,
  JamiaResult,
  JamiaSiteConfig,
  JamiaStaff,
  JamiaStudent,
  OnlineCourse,
} from '../types/jamia';
import { StatCard } from '../components/ui/StatCard';
import { StatusText } from '../components/ui/StatusText';
import { Modal } from '../components/ui/Modal';

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
  fees: JamiaFeeRecord[];
  onAddFee: (f: JamiaFeeRecord) => void;
  onMarkFeePaid: (id: string) => void;
  results: JamiaResult[];
  onAddResult: (r: JamiaResult) => void;
  questions: FiqhQuestion[];
  onAnswerQuestion: (id: string, answer: string) => void;
  courses: OnlineCourse[];
  siteConfig: JamiaSiteConfig;
  onUpdateSiteConfig: (cfg: JamiaSiteConfig) => void;
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
  fees,
  onAddFee,
  onMarkFeePaid,
  results,
  onAddResult,
  questions,
  onAnswerQuestion,
  courses,
  siteConfig,
  onUpdateSiteConfig,
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
  const [sDarja, setSDarja] = useState('درجہ خامسہ (عالمہ)');
  const [sPhone, setSPhone] = useState('');
  const [sCity, setSCity] = useState('قصور');
  const [selectedStudentCard, setSelectedStudentCard] = useState<JamiaStudent | null>(null);

  // Admissions filter
  const [admTab, setAdmTab] = useState<'سب' | JamiaAdmission['status']>('سب');

  // Staff modal
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [stName, setStName] = useState('');
  const [stType, setStType] = useState<JamiaStaff['type']>('معلمہ / استاد');
  const [stDesig, setStDesig] = useState('');
  const [stPhone, setStPhone] = useState('');
  const [stSalary, setStSalary] = useState('30000');

  // Attendance state
  const [attDate, setAttDate] = useState('2026-11-14');
  const [attMarks, setAttMarks] = useState<Record<string, 'حاضر' | 'غیر حاضر' | 'رخصت'>>({});

  // Fees modal & filter
  const [feeFilter, setFeeFilter] = useState<'سب' | 'ادا شدہ' | 'باقی'>('سب');
  const [addFeeOpen, setAddFeeOpen] = useState(false);
  const [fStudent, setFStudent] = useState('');
  const [fAmount, setFAmount] = useState('2500');
  const [fCat, setFCat] = useState<JamiaFeeRecord['category']>('ماہانہ فیس');
  const [printReceipt, setPrintReceipt] = useState<JamiaFeeRecord | null>(null);

  // Results modal
  const [addResOpen, setAddResOpen] = useState(false);
  const [rRoll, setRRoll] = useState('');
  const [rName, setRName] = useState('');
  const [rFather, setRFather] = useState('');
  const [rDarja, setRDarja] = useState('درجہ رابعہ');
  const [rTotal, setRTotal] = useState('345');

  // Darul Ifta answer modal
  const [ansTarget, setAnsTarget] = useState<FiqhQuestion | null>(null);
  const [ansText, setAnsText] = useState('');

  // Website CMS local draft
  const [cmsDraft, setCmsDraft] = useState<JamiaSiteConfig>(siteConfig);

  const collectedFees = fees
    .filter((f) => f.status === 'ادا شدہ')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAdmissions = admissions.filter((a) => a.status === 'زیر غور').length;
  const pendingQuestions = questions.filter((q) => q.status === 'زیر غور').length;

  // 1. DASHBOARD
  if (route === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="کل فعال طالبات"
            value={String(students.length)}
            delta="جامعہ و آن لائن شعبہ"
            deltaTone="positive"
            icon={Users}
            onClick={() => onNavigate('students')}
          />
          <StatCard
            label="زیرِ غور داخلے"
            value={String(pendingAdmissions)}
            delta="ویب سائٹ سے موصول شدہ"
            icon={UserPlus}
            onClick={() => onNavigate('admissions')}
          />
          <StatCard
            label="جمع شدہ فیس و تعاون"
            value={`Rs ${collectedFees.toLocaleString()}`}
            delta="نومبر 2026 ریکارڈ"
            deltaTone="positive"
            icon={CreditCard}
            onClick={() => onNavigate('fees')}
          />
          <StatCard
            label="جواب طلب فقہی سوالات"
            value={String(pendingQuestions)}
            delta="دارالافتاء پورٹل"
            icon={Scale}
            onClick={() => onNavigate('darulifta')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Admissions */}
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-[#0F294A]">حالیہ آن لائن داخلہ درخواستیں</h2>
              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="cursor-pointer text-xs font-bold text-[#2563EB] hover:underline"
              >
                سب دیکھیں
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
              <h2 className="text-sm font-extrabold text-[#0F294A]">دارالافتاء کے حالیہ سوالات</h2>
              <button
                type="button"
                onClick={() => onNavigate('darulifta')}
                className="cursor-pointer text-xs font-bold text-[#2563EB] hover:underline"
              >
                جواب دیں
              </button>
            </div>
            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {questions.slice(0, 4).map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{q.question}</p>
                    <p className="text-slate-500">
                      سائل: {q.questioner} ({q.city})
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
    const filtered = students.filter(
      (s) =>
        s.name.includes(stuSearch) ||
        s.rollNo.toLowerCase().includes(stuSearch.toLowerCase()) ||
        s.darja.includes(stuSearch)
    );

    const handleCreateStudent = (e: FormEvent) => {
      e.preventDefault();
      if (!sName.trim()) return;
      const item: JamiaStudent = {
        id: `ST-${106 + students.length}`,
        rollNo: `JB-2026-0${students.length + 1}`,
        name: sName.trim(),
        fatherName: sFather.trim() || '—',
        darja: sDarja,
        phone: sPhone.trim() || '0300-0000000',
        city: sCity.trim() || 'قصور',
        admissionDate: '2026-11-14',
        status: 'فعال',
        feeStatus: 'ادا شدہ',
        attendanceRate: 100,
      };
      onAddStudent(item);
      onNotify(`طالبہ ${item.name} کا داخلہ ریکارڈ میں شامل کر دیا گیا۔`);
      setAddStuOpen(false);
      setSName('');
      setSFather('');
      setSPhone('');
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={stuSearch}
              onChange={(e) => setStuSearch(e.target.value)}
              placeholder="نام، رول نمبر یا درجہ تلاش کریں..."
              className="h-9 w-full border border-slate-300 bg-slate-50 pr-9 pl-3 text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => setAddStuOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>نئی طالبہ شامل کریں</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">رول نمبر</th>
                <th className="px-4 py-3">نام و ولدیت</th>
                <th className="px-4 py-3">درجہ</th>
                <th className="px-4 py-3">فون / شہر</th>
                <th className="px-4 py-3">حاضری</th>
                <th className="px-4 py-3">فیس</th>
                <th className="px-4 py-3">کارڈ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{s.rollNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">بنتِ {s.fatherName}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.darja}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono-num text-slate-800" dir="ltr">
                      {s.phone}
                    </p>
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
                      شناختی کارڈ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addStuOpen} onClose={() => setAddStuOpen(false)} title="نئی طالبہ کا اندراج" size="sm">
          <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">نام طالبہ *</label>
              <input
                required
                type="text"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">والد کا نام</label>
              <input
                type="text"
                value={sFather}
                onChange={(e) => setSFather(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">درجہ</label>
              <input
                type="text"
                value={sDarja}
                onChange={(e) => setSDarja(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">فون نمبر</label>
                <input
                  type="text"
                  dir="ltr"
                  value={sPhone}
                  onChange={(e) => setSPhone(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">شہر</label>
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
                منسوخ
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                محفوظ کریں
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={Boolean(selectedStudentCard)}
          onClose={() => setSelectedStudentCard(null)}
          title="طالبہ شناختی کارڈ"
          size="sm"
        >
          {selectedStudentCard && (
            <div className="space-y-4 text-xs">
              <div className="border-2 border-[#0F294A] bg-white p-4">
                <p className="border-b border-slate-200 pb-2 text-center font-extrabold text-[#0F294A]">
                  {siteConfig.name}
                </p>
                <div className="mt-3 space-y-1.5">
                  <p>نام طالبہ: <strong>{selectedStudentCard.name}</strong></p>
                  <p>ولدیت: <strong>{selectedStudentCard.fatherName}</strong></p>
                  <p>رول نمبر: <strong className="font-mono-num">{selectedStudentCard.rollNo}</strong></p>
                  <p>درجہ: <strong>{selectedStudentCard.darja}</strong></p>
                  <p>فون: <strong className="font-mono-num" dir="ltr">{selectedStudentCard.phone}</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 bg-[#0F294A] py-2 font-bold text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>کارڈ پرنٹ کریں</span>
              </button>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // 3. ADMISSIONS
  if (route === 'admissions') {
    const visible = admissions.filter((a) => admTab === 'سب' || a.status === admTab);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border border-slate-200 bg-white p-4">
          {(['سب', 'زیر غور', 'منظور', 'مسترد'] as const).map((tab) => (
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
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">نمبر</th>
                <th className="px-4 py-3">طالبہ و ولدیت</th>
                <th className="px-4 py-3">درجہ / کورس</th>
                <th className="px-4 py-3">قسم</th>
                <th className="px-4 py-3">فون</th>
                <th className="px-4 py-3">حالت</th>
                <th className="px-4 py-3">کارروائی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((adm) => (
                <tr key={adm.id}>
                  <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{adm.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{adm.studentName}</p>
                    <p className="text-[11px] text-slate-500">بنتِ {adm.fatherName}</p>
                  </td>
                  <td className="px-4 py-3">{adm.darja}</td>
                  <td className="px-4 py-3">{adm.type}</td>
                  <td className="px-4 py-3 font-mono-num" dir="ltr">{adm.phone}</td>
                  <td className="px-4 py-3">
                    <StatusText status={adm.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAdmissionStatus(adm.id, 'منظور');
                          onNotify(`${adm.studentName} کا داخلہ منظور کر لیا گیا۔`);
                        }}
                        className="cursor-pointer bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        منظور
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateAdmissionStatus(adm.id, 'مسترد');
                          onNotify(`${adm.studentName} کی درخواست مسترد کر دی گئی۔`);
                        }}
                        className="cursor-pointer bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        مسترد
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
        id: `EMP-${staff.length + 1}`,
        code: `${stType === 'معلمہ / استاد' ? 'M' : 'S'}-0${staff.length + 1}`,
        name: stName.trim(),
        type: stType,
        designation: stDesig.trim() || 'مدرسہ',
        darjaOrDept: 'جامعہ ہذا',
        phone: stPhone.trim() || '0300-0000000',
        salary: Number(stSalary) || 25000,
        salaryStatus: 'باقی',
      };
      onAddStaff(item);
      onNotify(`${item.name} کو عملہ میں شامل کر دیا گیا۔`);
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
            <span>معلمات، اساتذہ اور عملہ ({staff.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setAddStaffOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>نیا استاد / معلمہ شامل کریں</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">کوڈ</th>
                <th className="px-4 py-3">نام و عہدہ</th>
                <th className="px-4 py-3">شعبہ / درجہ</th>
                <th className="px-4 py-3">فون</th>
                <th className="px-4 py-3">مشاہرہ</th>
                <th className="px-4 py-3">حالت</th>
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
                  <td className="px-4 py-3 font-mono-num" dir="ltr">{m.phone}</td>
                  <td className="px-4 py-3 font-mono-num font-bold">
                    {m.salary === 0 ? 'فی سبیل اللہ' : `Rs ${m.salary.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleSalary(m.id)}
                      className="cursor-pointer"
                      title="مشاہرہ کی حالت تبدیل کریں"
                    >
                      <StatusText status={m.salaryStatus} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addStaffOpen} onClose={() => setAddStaffOpen(false)} title="نیا استاد / معلمہ شامل کریں" size="sm">
          <form onSubmit={handleAddMember} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">نام *</label>
              <input
                required
                type="text"
                value={stName}
                onChange={(e) => setStName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">شعبہ</label>
              <select
                value={stType}
                onChange={(e) => setStType(e.target.value as JamiaStaff['type'])}
                className="h-9 w-full border border-slate-300 px-2"
              >
                <option value="معلمہ / استاد">معلمہ / استاد</option>
                <option value="عملہ">انتظامی عملہ</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-bold">عہدہ</label>
              <input
                type="text"
                value={stDesig}
                onChange={(e) => setStDesig(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">فون</label>
                <input
                  type="text"
                  dir="ltr"
                  value={stPhone}
                  onChange={(e) => setStPhone(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3 font-mono-num"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">ماہانہ مشاہرہ</label>
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
                منسوخ
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                محفوظ کریں
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
            <span className="text-sm font-bold text-[#0F294A]">حاضری رجسٹر</span>
            <input
              type="date"
              dir="ltr"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="h-9 border border-slate-300 px-2 font-mono-num text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => onNotify(`تاریخ ${attDate} کی حاضری محفوظ کر لی گئی۔`)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Save className="h-3.5 w-3.5" />
            <span>حاضری محفوظ کریں</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">رول نمبر</th>
                <th className="px-4 py-3">نام طالبہ</th>
                <th className="px-4 py-3">درجہ</th>
                <th className="px-4 py-3">آج کی حاضری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const status = attMarks[st.id] ?? 'حاضر';
                return (
                  <tr key={st.id}>
                    <td className="px-4 py-3 font-mono-num font-bold text-[#0F294A]">{st.rollNo}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{st.name}</td>
                    <td className="px-4 py-3">{st.darja}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(['حاضر', 'غیر حاضر', 'رخصت'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAttMarks((prev) => ({ ...prev, [st.id]: opt }))}
                            className={`cursor-pointer border px-3 py-1 text-[11px] font-bold ${
                              status === opt
                                ? opt === 'حاضر'
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : opt === 'غیر حاضر'
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
    const visible = fees.filter((f) => feeFilter === 'سب' || f.status === feeFilter);

    const handleCreateFee = (e: FormEvent) => {
      e.preventDefault();
      if (!fStudent.trim()) return;
      const item: JamiaFeeRecord = {
        id: `F-${fees.length + 1}`,
        receiptNo: `RCP-${1045 + fees.length}`,
        studentName: fStudent.trim(),
        darja: 'جامعہ ہذا',
        month: 'نومبر 2026',
        amount: Number(fAmount) || 2000,
        category: fCat,
        date: '2026-11-14',
        status: 'ادا شدہ',
      };
      onAddFee(item);
      onNotify(`رسید نمبر ${item.receiptNo} محفوظ ہو گئی۔`);
      setAddFeeOpen(false);
      setFStudent('');
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4">
          <div className="flex gap-1.5">
            {(['سب', 'ادا شدہ', 'باقی'] as const).map((t) => (
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
            <span>نئی رسید / تعاون درج کریں</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">رسید نمبر</th>
                <th className="px-4 py-3">نام طالبہ / مخیر</th>
                <th className="px-4 py-3">مد</th>
                <th className="px-4 py-3">رقم</th>
                <th className="px-4 py-3">حالت</th>
                <th className="px-4 py-3">کارروائی</th>
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
                  <td className="px-4 py-3">{f.category}</td>
                  <td className="px-4 py-3 font-mono-num font-bold">Rs {f.amount.toLocaleString()}</td>
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
                        <span>رسید</span>
                      </button>
                      {f.status === 'باقی' && (
                        <button
                          type="button"
                          onClick={() => {
                            onMarkFeePaid(f.id);
                            onNotify(`رسید ${f.receiptNo} ادا شدہ کر دی گئی۔`);
                          }}
                          className="cursor-pointer bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                        >
                          وصول کریں
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addFeeOpen} onClose={() => setAddFeeOpen(false)} title="نئی فیس یا تعاون کی رسید" size="sm">
          <form onSubmit={handleCreateFee} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">نام طالبہ یا تعاون کنندہ *</label>
              <input
                required
                type="text"
                value={fStudent}
                onChange={(e) => setFStudent(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">مد</label>
              <select
                value={fCat}
                onChange={(e) => setFCat(e.target.value as JamiaFeeRecord['category'])}
                className="h-9 w-full border border-slate-300 px-2"
              >
                <option value="ماہانہ فیس">ماہانہ فیس</option>
                <option value="تعاون / عطیہ">تعاون / عطیہ</option>
                <option value="داخلہ فیس">داخلہ فیس</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-bold">رقم (PKR)</label>
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
                منسوخ
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                رسید جاری کریں
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={Boolean(printReceipt)} onClose={() => setPrintReceipt(null)} title="باضابطہ رسید" size="sm">
          {printReceipt && (
            <div className="space-y-4 text-xs">
              <div className="border border-slate-300 bg-white p-4">
                <p className="text-center font-extrabold text-[#0F294A]">{siteConfig.name}</p>
                <p className="mt-1 text-center font-mono-num text-slate-500">{printReceipt.receiptNo}</p>
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                  <p>نام: <strong>{printReceipt.studentName}</strong></p>
                  <p>مد: <strong>{printReceipt.category}</strong></p>
                  <p>تاریخ: <strong className="font-mono-num">{printReceipt.date}</strong></p>
                  <p className="text-sm font-bold text-[#0F294A]">
                    مبلغ: <span className="font-mono-num">Rs {printReceipt.amount.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 bg-[#0F294A] py-2 font-bold text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>رسید پرنٹ کریں</span>
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
        id: `RES-${results.length + 1}`,
        rollNo: rRoll.trim(),
        studentName: rName.trim(),
        fatherName: rFather.trim() || '—',
        darja: rDarja,
        examTitle: 'سالانہ امتحان جامعہ ہذا',
        year: '2026',
        subjects: [
          { name: 'تفسیر و حدیث', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'فقہ و اصولِ فقہ', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'نحو و صرف', max: 100, obtained: Math.min(100, Math.round(obt / 4)) },
          { name: 'تجوید و عقائد', max: 100, obtained: Math.min(100, obt - 3 * Math.round(obt / 4)) },
        ],
        totalObtained: obt,
        totalMax: 400,
        position: obt >= 350 ? 'نمایاں پوزیشن' : 'کامیاب',
        grade: obt >= 340 ? 'ممتاز' : obt >= 280 ? 'جید جداً' : 'جید',
      };
      onAddResult(item);
      onNotify(`رزلٹ برائے ${item.studentName} شائع کر دیا گیا۔ اب ویب سائٹ پر بھی تلاش کیا جا سکتا ہے۔`);
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
            <span>امتحانی نتائج (ویب سائٹ آن لائن رزلٹ سے منسلک)</span>
          </div>
          <button
            type="button"
            onClick={() => setAddResOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            <span>نیا رزلٹ شامل کریں</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">رول نمبر</th>
                <th className="px-4 py-3">طالبہ</th>
                <th className="px-4 py-3">درجہ</th>
                <th className="px-4 py-3">نمبر</th>
                <th className="px-4 py-3">تقدیر</th>
                <th className="px-4 py-3">پوزیشن</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal open={addResOpen} onClose={() => setAddResOpen(false)} title="نیا امتحانی نتیجہ درج کریں" size="sm">
          <form onSubmit={handleAddRes} className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-bold">رول نمبر *</label>
              <input
                required
                type="text"
                dir="ltr"
                value={rRoll}
                onChange={(e) => setRRoll(e.target.value)}
                placeholder="JB-2026-09"
                className="h-9 w-full border border-slate-300 px-3 font-mono-num"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">طالبہ کا نام *</label>
              <input
                required
                type="text"
                value={rName}
                onChange={(e) => setRName(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block font-bold">ولدیت</label>
              <input
                type="text"
                value={rFather}
                onChange={(e) => setRFather(e.target.value)}
                className="h-9 w-full border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-bold">درجہ</label>
                <input
                  type="text"
                  value={rDarja}
                  onChange={(e) => setRDarja(e.target.value)}
                  className="h-9 w-full border border-slate-300 px-3"
                />
              </div>
              <div>
                <label className="mb-1 block font-bold">حاصل کردہ نمبر (400 میں سے)</label>
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
                منسوخ
              </button>
              <button type="submit" className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white">
                رزلٹ شائع کریں
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
          <h2 className="text-sm font-extrabold text-[#0F294A]">آن لائن فقہی سوالات (دارالافتاء)</h2>
          <p className="mt-1 text-xs text-slate-600">
            کسی بھی سوال کا جواب تحریر کر کے شائع کریں — جواب فوری طور پر پبلک ویب سائٹ پر ظاہر ہو جائے گا۔
          </p>
          <div className="mt-4 space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="border border-slate-200 bg-slate-50 p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#0F294A]">
                    {q.id} · سائل: {q.questioner} ({q.city}) — {q.category}
                  </span>
                  <StatusText status={q.status} />
                </div>
                <p className="mt-2 font-semibold text-slate-900">سوال: {q.question}</p>
                {q.answer ? (
                  <p className="mt-2 border-r-2 border-emerald-600 pr-3 text-slate-700">
                    <strong>جواب:</strong> {q.answer}
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
                    شرعی جواب تحریر کریں
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0F294A]">
            <BookOpen className="h-4 w-4" />
            <span>جاری آن لائن کلاسز ({courses.length})</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {courses.map((c) => (
              <div key={c.id} className="border border-slate-200 p-3.5 text-xs">
                <p className="font-bold text-[#0F294A]">{c.title}</p>
                <p className="mt-1 text-slate-600">{c.timing} · {c.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <Modal
          open={Boolean(ansTarget)}
          onClose={() => setAnsTarget(null)}
          title="دارالافتاء — جواب جاری کریں"
          size="md"
        >
          {ansTarget && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!ansText.trim()) return;
                onAnswerQuestion(ansTarget.id, ansText.trim());
                onNotify(`سوال ${ansTarget.id} کا جواب ویب سائٹ پر شائع کر دیا گیا۔`);
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
                placeholder="مستند حوالہ جات کے ساتھ شرعی جواب تحریر کریں..."
                className="w-full border border-slate-300 p-3"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setAnsTarget(null)} className="cursor-pointer border border-slate-300 px-4 py-2 font-bold">
                  منسوخ
                </button>
                <button type="submit" className="cursor-pointer bg-emerald-600 px-4 py-2 font-bold text-white">
                  جواب شائع کریں
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  // 9. WEBSITE CMS
  if (route === 'website') {
    const handleSaveCms = (e: FormEvent) => {
      e.preventDefault();
      onUpdateSiteConfig(cmsDraft);
      onNotify('ویب سائٹ کی معلومات کامیابی سے اپ ڈیٹ کر دی گئیں۔');
    };

    return (
      <form onSubmit={handleSaveCms} className="space-y-4 border border-slate-200 bg-white p-6 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#0F294A]">ویب سائٹ کے مواد اور اعلانات کی ترمیم</h2>
            <p className="text-slate-500">یہ تبدیلیاں فوری طور پر پبلک ویب سائٹ پر نظر آئیں گی۔</p>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-4 py-2 font-bold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>تبدیلیاں محفوظ کریں</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-bold text-slate-800">جامعہ کا نام</label>
            <input
              type="text"
              value={cmsDraft.name}
              onChange={(e) => setCmsDraft({ ...cmsDraft, name: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3"
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-slate-800">فون نمبر</label>
            <input
              type="text"
              dir="ltr"
              value={cmsDraft.phone}
              onChange={(e) => setCmsDraft({ ...cmsDraft, phone: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3 font-mono-num"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-bold text-slate-800">ویب سائٹ کا اہم اعلان (نوٹس پٹی)</label>
            <input
              type="text"
              value={cmsDraft.heroNotice}
              onChange={(e) => setCmsDraft({ ...cmsDraft, heroNotice: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3"
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-slate-800">سالانہ تقسیمِ اسناد پروگرام عنوان</label>
            <input
              type="text"
              value={cmsDraft.annualProgramTitle}
              onChange={(e) => setCmsDraft({ ...cmsDraft, annualProgramTitle: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3"
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-slate-800">پروگرام کی تاریخ و وقت</label>
            <input
              type="text"
              value={cmsDraft.annualProgramDate}
              onChange={(e) => setCmsDraft({ ...cmsDraft, annualProgramDate: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3"
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-slate-800">بینک کا نام</label>
            <input
              type="text"
              value={cmsDraft.bankName}
              onChange={(e) => setCmsDraft({ ...cmsDraft, bankName: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3"
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-slate-800">بینک اکاؤنٹ نمبر</label>
            <input
              type="text"
              dir="ltr"
              value={cmsDraft.accountNumber}
              onChange={(e) => setCmsDraft({ ...cmsDraft, accountNumber: e.target.value })}
              className="h-9 w-full border border-slate-300 px-3 font-mono-num"
            />
          </div>
        </div>
      </form>
    );
  }

  // 10. SETTINGS
  return (
    <div className="space-y-4 border border-slate-200 bg-white p-6 text-xs">
      <h2 className="text-sm font-extrabold text-[#0F294A]">ایڈمن اکاؤنٹ اور پورٹل ترتیبات</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-slate-500">لاگ ان شدہ ایڈمن ای میل</p>
          <p className="mt-1 font-mono-num font-bold text-[#0F294A]" dir="ltr">{adminEmail}</p>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-slate-500">ادارہ</p>
          <p className="mt-1 font-bold text-slate-900">{siteConfig.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onViewWebsite}
          className="cursor-pointer bg-[#0F294A] px-4 py-2 font-bold text-white"
        >
          پبلک ویب سائٹ دیکھیں
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="cursor-pointer bg-red-600 px-4 py-2 font-bold text-white"
        >
          ایڈمن پینل سے لاگ آؤٹ کریں
        </button>
      </div>
    </div>
  );
}
