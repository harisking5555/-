import { useState, FormEvent } from 'react';
import { Search, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { JAMIA_INFO, STUDENT_RESULTS, StudentResult } from '../data/jamiaData';

interface ResultsSectionProps {
  compact?: boolean;
  onOpenFullPage?: () => void;
}

export function ResultsSection({ compact = false, onOpenFullPage }: ResultsSectionProps) {
  const [rollQuery, setRollQuery] = useState('10421');
  const [selectedDarja, setSelectedDarja] = useState('تمام درجات');
  const [activeResult, setActiveResult] = useState<StudentResult | null>(STUDENT_RESULTS[0]);
  const [notFound, setNotFound] = useState(false);

  const darajat = [
    'تمام درجات',
    'درجہ عالمیہ (سال دوم)',
    'درجہ عامہ (سال اول)',
    'درجہ خاصہ (سال اول)',
    'شعبہ حفظ و تجوید',
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = rollQuery.trim();
    const match = STUDENT_RESULTS.find((item) => {
      const rollMatch = trimmed === '' || item.rollNo === trimmed || item.name.includes(trimmed);
      const darjaMatch = selectedDarja === 'تمام درجات' || item.darja === selectedDarja;
      return rollMatch && darjaMatch;
    });

    if (match) {
      setActiveResult(match);
      setNotFound(false);
    } else {
      setActiveResult(null);
      setNotFound(true);
    }
  };

  const selectSample = (student: StudentResult) => {
    setRollQuery(student.rollNo);
    setSelectedDarja('تمام درجات');
    setActiveResult(student);
    setNotFound(false);
  };

  return (
    <div className="space-y-5">
      {/* Search Box */}
      <div className="no-print rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[#85581F]">
              {JAMIA_INFO.affiliation}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-2xl">
              آن لائن امتحانی رزلٹ جامعہ ہذا
            </h3>
          </div>
          {compact && onOpenFullPage && (
            <button
              type="button"
              onClick={onOpenFullPage}
              className="cursor-pointer whitespace-nowrap shrink-0 text-sm font-bold text-[#0A543E] hover:underline"
            >
              مکمل رزلٹ پورٹل کھولیں
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <label htmlFor="roll-input" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
              رول نمبر یا طالبہ کا نام درج کریں
            </label>
            <input
              id="roll-input"
              type="text"
              value={rollQuery}
              onChange={(e) => setRollQuery(e.target.value)}
              placeholder="مثال: 10421"
              className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3.5 py-2.5 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="darja-select" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
              درجہ منتخب کریں
            </label>
            <select
              id="darja-select"
              value={selectedDarja}
              onChange={(e) => setSelectedDarja(e.target.value)}
              className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3.5 py-2.5 text-sm font-medium text-[#0A110E] focus:border-[#0A543E] focus:outline-none"
            >
              {darajat.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end sm:col-span-3">
            <button
              type="submit"
              className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[#0A543E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#073E2D]"
            >
              <Search className="h-4 w-4" />
              <span>رزلٹ تلاش کریں</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Roll Numbers */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EFECE4] pt-3 text-xs font-medium text-[#1E2923]">
          <span>نمونہ رول نمبرز:</span>
          {STUDENT_RESULTS.map((s) => (
            <button
              key={s.rollNo}
              type="button"
              onClick={() => selectSample(s)}
              className={`min-h-[36px] cursor-pointer rounded-sm border px-2.5 py-1 tabular-nums transition-colors ${
                activeResult?.rollNo === s.rollNo
                  ? 'border-[#0A543E] bg-[#0A543E] text-white'
                  : 'border-[#DDD6C7] bg-[#FAF8F4] text-[#0A110E] hover:border-[#0A543E]'
              }`}
            >
              {s.rollNo} · {s.darja.split(' ')[1] || s.darja}
            </button>
          ))}
        </div>
      </div>

      {notFound && (
        <div className="flex items-center gap-3 rounded-sm border border-[#DFB98D] bg-[#FDF6EC] p-5 text-sm font-medium text-[#6B3E0B]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            اس رول نمبر یا درجہ کا ریکارڈ دستیاب نہیں۔ برائے مہربانی درست رول نمبر درج کریں یا دفترِ جامعہ سے رابطہ فرمائیں۔
          </p>
        </div>
      )}

      {/* Result Card Display */}
      {activeResult && (
        <div className="rounded-sm border border-[#D4CCB9] bg-white p-4 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EFECE4] pb-5">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h4 className="mt-1 font-display text-lg font-bold text-[#0A543E] sm:text-xl">
                کشفُ الدرجات — {activeResult.board}
              </h4>
              <p className="mt-1 text-xs font-medium text-[#3E4A43]">
                {JAMIA_INFO.fullName} · {activeResult.year}
              </p>
            </div>

            <div className="no-print flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3.5 py-2 text-xs font-semibold text-[#0A110E] transition-colors hover:border-[#0A543E]"
              >
                <Printer className="h-4 w-4 text-[#0A543E]" />
                <span>رزلٹ پرنٹ کریں</span>
              </button>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 border-b border-[#EFECE4] pb-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs font-medium text-[#3E4A43]">نام طالبہ</dt>
              <dd className="mt-1 font-bold text-[#0A110E]">{activeResult.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#3E4A43]">رول نمبر / رجسٹریشن</dt>
              <dd className="mt-1 font-bold tabular-nums text-[#0A110E]">
                {activeResult.rollNo} · {activeResult.regNo}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#3E4A43]">درجہ</dt>
              <dd className="mt-1 font-bold text-[#0A110E]">{activeResult.darja}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#3E4A43]">نتیجہ و تقدیر</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-bold text-[#0A543E]">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {activeResult.status} ({activeResult.grade})
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="border-b border-[#DDD6C7] bg-[#FAF8F4] text-xs font-bold text-[#1E2923]">
                  <th className="px-3 py-2.5 sm:px-4">شمار</th>
                  <th className="px-3 py-2.5 sm:px-4">مضمون / کتاب</th>
                  <th className="px-3 py-2.5 tabular-nums sm:px-4">کل نمبر</th>
                  <th className="px-3 py-2.5 tabular-nums sm:px-4">حاصل کردہ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE4]">
                {activeResult.subjects.map((sub, idx) => (
                  <tr key={sub.subject} className="hover:bg-[#FAF8F4]">
                    <td className="px-3 py-2.5 tabular-nums text-[#3E4A43] sm:px-4">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-[#0A110E] sm:px-4">{sub.subject}</td>
                    <td className="px-3 py-2.5 tabular-nums text-[#1E2923] sm:px-4">{sub.total}</td>
                    <td className="px-3 py-2.5 font-bold tabular-nums text-[#0A543E] sm:px-4">
                      {sub.obtained}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#D4CCB9] bg-[#FAF8F4] font-bold text-[#0A110E]">
                  <td colSpan={2} className="px-3 py-3 sm:px-4">
                    میزان / کل تناسب ({activeResult.percentage})
                  </td>
                  <td className="px-3 py-3 tabular-nums sm:px-4">{activeResult.totalMarks}</td>
                  <td className="px-3 py-3 tabular-nums text-[#0A543E] sm:px-4">
                    {activeResult.obtainedMarks}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
