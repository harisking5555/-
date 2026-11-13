import { useState, FormEvent } from 'react';
import { Search, Send, CheckCircle2 } from 'lucide-react';
import { FatwaItem, INITIAL_FATAWA, JAMIA_INFO } from '../data/jamiaData';

interface DarulIftaSectionProps {
  compact?: boolean;
  onOpenFullPage?: () => void;
}

const CATEGORIES: ('سب مسائل' | FatwaItem['category'])[] = [
  'سب مسائل',
  'عبادات',
  'معاملات',
  'نکاح و طلاق',
  'جدید مسائل',
];

export function DarulIftaSection({ compact = false, onOpenFullPage }: DarulIftaSectionProps) {
  const [fatawa, setFatawa] = useState<FatwaItem[]>(INITIAL_FATAWA);
  const [activeCategory, setActiveCategory] = useState<'سب مسائل' | FatwaItem['category']>('سب مسائل');
  const [query, setQuery] = useState('');

  const [askerName, setAskerName] = useState('');
  const [askerCity, setAskerCity] = useState('');
  const [questionCategory, setQuestionCategory] = useState<FatwaItem['category']>('عبادات');
  const [questionText, setQuestionText] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const filtered = fatawa.filter((item) => {
    const catMatch = activeCategory === 'سب مسائل' || item.category === activeCategory;
    const textMatch =
      query.trim() === '' ||
      item.question.includes(query.trim()) ||
      item.answer.includes(query.trim());
    return catMatch && textMatch;
  });

  const displayList = compact ? filtered.slice(0, 3) : filtered;

  const handleSubmitQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newEntry: FatwaItem = {
      id: `user-${Date.now()}`,
      code: `موصولہ استفتاء ${fatawa.length + 1043}`,
      category: questionCategory,
      question: questionText.trim(),
      answer:
        'آپ کا شرعی سوال دارالافتاء مرکزی جامعۃ البنات میں موصول ہو چکا ہے۔ مفتیانِ کرام کی جانب سے جلد مستند شرعی جواب عطا کر دیا جائے گا، یا فوری جواب کے لیے واٹس ایپ بٹن استعمال فرمائیں۔',
      mufti: `سائل: ${askerName.trim() || 'مخفی'} (${askerCity.trim() || 'قصور'})`,
      date: 'تازہ موصولہ سوال',
    };

    setFatawa([newEntry, ...fatawa]);
    setSubmittedNotice(questionText.trim());
    setQuestionText('');
    setAskerName('');
    setAskerCity('');
  };

  const whatsappUrl = submittedNotice
    ? `${JAMIA_INFO.whatsappDirect}?text=${encodeURIComponent(
        `السلام علیکم ورحمۃ اللہ، دارالافتاء مرکزی جامعۃ البنات قصور سے شرعی سوال:\n${submittedNotice}`
      )}`
    : JAMIA_INFO.whatsappDirect;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <div className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#3E4A43]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="فقہی مسئلہ تلاش کریں..."
                className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] py-2 pr-9 pl-3 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
              />
            </div>

            {compact && onOpenFullPage && (
              <button
                type="button"
                onClick={onOpenFullPage}
                className="cursor-pointer whitespace-nowrap shrink-0 text-sm font-bold text-[#0A543E] hover:underline"
              >
                تمام فتاویٰ دیکھیں
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[38px] cursor-pointer whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#0A543E] text-white'
                    : 'bg-[#F3EFE6] text-[#1E2923] hover:text-[#0A110E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {displayList.map((item) => (
            <article
              key={item.id}
              className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#3E4A43]">
                <span className="text-[#85581F]">{item.code}</span>
                <span aria-hidden="true">·</span>
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{item.date}</span>
              </div>
              <h4 className="mt-2 font-display text-base font-bold text-[#0A110E]">
                سوال: {item.question}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#1E2923]">
                <span className="font-bold text-[#0A543E]">جواب: </span>
                {item.answer}
              </p>
              <p className="mt-3 text-xs font-medium text-[#3E4A43]">تصدیق: {item.mufti}</p>
            </article>
          ))}

          {displayList.length === 0 && (
            <div className="rounded-sm border border-[#DDD6C7] bg-white p-6 text-center text-sm font-medium text-[#1E2923]">
              اس موضوع پر کوئی فتویٰ تلاش میں نہیں ملا۔ آپ اپنا نیا شرعی سوال درج کر سکتے ہیں۔
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-6">
          <p className="font-arabic text-sm font-bold text-[#85581F]">دارالافتاء اہلسنت</p>
          <h4 className="mt-1 font-display text-xl font-bold text-[#0A110E]">
            آن لائن شرعی سوال پوچھیں
          </h4>
          <p className="mt-1 text-xs font-medium text-[#3E4A43]">
            قرآن و سنت اور فقہِ حنفی کی روشنی میں مستند رہنمائی حاصل کریں۔
          </p>

          <form onSubmit={handleSubmitQuestion} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="asker-name" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  نام (اختیاری)
                </label>
                <input
                  id="asker-name"
                  type="text"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="آپ کا اسمِ گرامی"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="asker-city" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                  شہر
                </label>
                <input
                  id="asker-city"
                  type="text"
                  value={askerCity}
                  onChange={(e) => setAskerCity(e.target.value)}
                  placeholder="قصور"
                  className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fatwa-cat" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                موضوع
              </label>
              <select
                id="fatwa-cat"
                value={questionCategory}
                onChange={(e) => setQuestionCategory(e.target.value as FatwaItem['category'])}
                className="min-h-[44px] w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3 py-2 text-sm font-medium text-[#0A110E] focus:border-[#0A543E] focus:outline-none"
              >
                <option value="عبادات">عبادات (نماز، روزہ، طہارت)</option>
                <option value="معاملات">معاملات و زکوٰۃ</option>
                <option value="نکاح و طلاق">نکاح، طلاق و عائلی مسائل</option>
                <option value="جدید مسائل">جدید شرعی مسائل</option>
              </select>
            </div>

            <div>
              <label htmlFor="fatwa-question" className="mb-1.5 block text-xs font-semibold text-[#1E2923]">
                اپنا سوال واضح الفاظ میں تحریر کریں
              </label>
              <textarea
                id="fatwa-question"
                rows={4}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="مسئلہ تفصیل سے لکھیں..."
                className="w-full rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] p-3 text-sm font-medium text-[#0A110E] placeholder:text-[#57605B] focus:border-[#0A543E] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#0A543E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#073E2D]"
            >
              <Send className="h-4 w-4" />
              <span>سوال ارسال کریں</span>
            </button>
          </form>

          {submittedNotice && (
            <div className="mt-4 rounded-sm border border-[#A6D3BC] bg-[#EDF8F2] p-3.5 text-xs font-semibold text-[#0A543E]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>آپ کا سوال درج ہو گیا ہے۔</span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block underline"
              >
                فوری جواب کے لیے یہی سوال دارالافتاء واٹس ایپ پر بھیجیں
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
