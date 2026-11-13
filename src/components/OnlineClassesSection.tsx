import { useState, FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { JAMIA_INFO, ONLINE_COURSES } from '../data/jamiaData';

interface OnlineClassesSectionProps {
  compact?: boolean;
}

export function OnlineClassesSection({ compact = false }: OnlineClassesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState(ONLINE_COURSES[0].title);
  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [city, setCity] = useState('');
  const [preferredTime, setPreferredTime] = useState('صبح 9 تا 12');
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    course: string;
    time: string;
  } | null>(null);

  const handleEnroll = (e: FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !whatsappNo.trim()) return;
    setSubmittedData({
      name: studentName.trim(),
      course: selectedCourse,
      time: preferredTime,
    });
    setStudentName('');
    setGuardianName('');
    setWhatsappNo('');
    setCity('');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
        {ONLINE_COURSES.map((course) => {
          const isSelected = selectedCourse === course.title;
          return (
            <div
              key={course.id}
              className={`flex flex-col justify-between rounded-sm border bg-white p-4 transition-colors sm:p-5 ${
                isSelected ? 'border-[#0A543E]' : 'border-[#DDD6C7]'
              }`}
            >
              <div>
                <p className="font-arabic text-sm font-bold text-[#85581F]">
                  {course.arabicTitle}
                </p>
                <h4 className="mt-1 font-display text-base font-bold text-[#0A110E]">
                  {course.title}
                </h4>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#3E4A43]">
                  <span>{course.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span>{course.level}</span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-[#1E2923]">
                  {course.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EFECE4] pt-3">
                <span className="text-xs font-medium text-[#3E4A43]">{course.timing}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course.title)}
                  className={`min-h-[38px] cursor-pointer whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#0A543E] text-white'
                      : 'bg-[#F3EFE6] text-[#0A543E] hover:bg-[#0A543E] hover:text-white'
                  }`}
                >
                  {isSelected ? 'منتخب شدہ' : 'داخلہ منتخب کریں'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-6">
          <p className="text-xs font-bold text-[#85581F]">صرف طالبات و خواتین کے لیے</p>
          <h4 className="mt-1 font-display text-xl font-bold text-[#0A110E]">
            آن لائن کلاسز داخلہ فارم
          </h4>
          {!compact && (
            <p className="mt-1 text-xs font-medium text-[#3E4A43]">
              مستند معلمات کی نگرانی میں باقاعدہ لائیو کلاسز اور ماہانہ ٹیسٹ سسٹم۔
            </p>
          )}

          <form onSubmit={handleEnroll} className="mt-4 space-y-3">
            <div>
              <label htmlFor="course-select" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                مطلوبہ کورس
              </label>
              <select
                id="course-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] focus:border-[#0A543E] focus:outline-none"
              >
                {ONLINE_COURSES.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="student-name" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  طالبہ کا نام
                </label>
                <input
                  id="student-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="مکمل نام"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="guardian-name" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  سرپرست / والد کا نام
                </label>
                <input
                  id="guardian-name"
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="والد یا سرپرست"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="student-whatsapp" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  واٹس ایپ نمبر
                </label>
                <input
                  id="student-whatsapp"
                  type="tel"
                  required
                  value={whatsappNo}
                  onChange={(e) => setWhatsappNo(e.target.value)}
                  placeholder="03001234567"
                  dir="ltr"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-right text-sm font-medium tabular-nums text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="student-city" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  شہر / ملک
                </label>
                <input
                  id="student-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="قصور، پاکستان"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="class-time" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                کلاس کا موزوں وقت
              </label>
              <select
                id="class-time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] focus:border-[#0A543E] focus:outline-none"
              >
                <option value="صبح 9 تا 12">صبح 9 تا 12 بجے</option>
                <option value="دوپہر 2 تا 5">دوپہر 2 تا 5 بجے</option>
                <option value="شام 5 تا 8">شام 5 تا 8 بجے</option>
                <option value="بیرونِ ملک وقت">بیرونِ ملک شیڈول کے مطابق</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#0A543E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#073E2D]"
            >
              <Send className="h-4 w-4" />
              <span>داخلہ درخواست جمع کروائیں</span>
            </button>
          </form>

          {submittedData && (
            <div className="mt-4 rounded-sm border border-[#A6D3BC] bg-[#EDF8F2] p-3.5 text-xs font-semibold text-[#0A543E]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  جزاکِ اللہ! {submittedData.name} کی درخواست ({submittedData.course}) موصول ہو گئی۔
                </span>
              </div>
              <a
                href={`${JAMIA_INFO.whatsappDirect}?text=${encodeURIComponent(
                  `السلام علیکم، آن لائن داخلہ برائے ${submittedData.course}\nنام طالبہ: ${submittedData.name}\nوقت: ${submittedData.time}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block underline"
              >
                تصدیق کے لیے دفترِ جامعہ کے واٹس ایپ پر میسج بھیجیں
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
