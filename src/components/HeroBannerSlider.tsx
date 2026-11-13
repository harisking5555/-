import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_IMAGES, JAMIA_INFO, LEADERS, PageId } from '../data/jamiaData';

interface HeroSlide {
  id: string;
  image: string;
  objectFit: 'cover' | 'contain';
  arabicKicker: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryPage: PageId;
  secondaryLabel: string;
  secondaryPage: PageId;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: GALLERY_IMAGES[3].src,
    objectFit: 'cover',
    arabicKicker: JAMIA_INFO.heroVerse,
    title: JAMIA_INFO.fullName,
    subtitle: 'تنظیم المدارس سے ملحق دینی، عصری اور آن لائن تعلیمِ نسواں کا مستند مرکز',
    primaryLabel: 'آن لائن کلاسز داخلہ',
    primaryPage: 'classes',
    secondaryLabel: 'آن لائن رزلٹ دیکھیں',
    secondaryPage: 'results',
  },
  {
    id: 'slide-2',
    image: LEADERS[0].image,
    objectFit: 'contain',
    arabicKicker: 'المؤسس رحمه الله',
    title: 'بانیٔ جامعہ مفتی محمد عبداللہ قادری رحمۃ اللہ علیہ',
    subtitle: 'علم و تقویٰ، فقہِ حنفی اور تعلیمِ نسواں کی عظیم علمی و روحانی روایت',
    primaryLabel: 'تعارف و مشائخ',
    primaryPage: 'about',
    secondaryLabel: 'شعبہ جاتِ جامعہ',
    secondaryPage: 'departments',
  },
  {
    id: 'slide-3',
    image: LEADERS[2].image,
    objectFit: 'contain',
    arabicKicker: 'دار الإفتاء والدروس المباشرة',
    title: 'گھر بیٹھے آن لائن عالمہ کورس اور دارالافتاء',
    subtitle: 'مستند معلمات کی نگرانی میں لائیو کلاسز اور آن لائن شرعی رہنمائی',
    primaryLabel: 'دارالافتاء سوال پوچھیں',
    primaryPage: 'darul-ifta',
    secondaryLabel: 'کورسز دیکھیں',
    secondaryPage: 'classes',
  },
  {
    id: 'slide-4',
    image: GALLERY_IMAGES[8].src,
    objectFit: 'cover',
    arabicKicker: 'الحفل السنوي لتوزيع الشهادات',
    title: 'سالانہ تقریبِ تقسیمِ اسناد و ردائے فضیلت',
    subtitle: 'فارغ التحصیل عالمات و حافظات کی حوصلہ افزائی اور اکابر مشائخ کے بیانات',
    primaryLabel: 'تقسیمِ اسناد پروگرام',
    primaryPage: 'ceremony',
    secondaryLabel: 'تصویری جھلکیاں',
    secondaryPage: 'gallery',
  },
];

interface HeroBannerSliderProps {
  onNavigate: (page: PageId) => void;
}

export function HeroBannerSlider({ onNavigate }: HeroBannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [paused]);

  const goTo = (nextIdx: number, dir: number) => {
    setDirection(dir);
    setIndex(nextIdx);
  };

  const handleNext = () => {
    goTo((index + 1) % SLIDES.length, 1);
  };

  const handlePrev = () => {
    goTo((index - 1 + SLIDES.length) % SLIDES.length, -1);
  };

  const current = SLIDES[index];

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-[#DDD6C7] bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid min-h-[430px] grid-cols-1 lg:min-h-[460px] lg:grid-cols-12">
        {/* Text Panel */}
        <div className="relative z-10 order-2 flex flex-col justify-center bg-white p-5 pb-14 sm:p-8 sm:pb-16 lg:order-1 lg:col-span-6 lg:p-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-arabic text-xl font-bold text-[#85581F] sm:text-2xl">
                {current.arabicKicker}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-[#3E4A43]">
                {JAMIA_INFO.affiliation} · {JAMIA_INFO.location}
              </p>
              <h1 className="mt-2.5 font-display text-2xl font-bold text-[#0A110E] sm:text-3xl lg:text-[2.25rem] [text-wrap:balance]">
                {current.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#1E2923] sm:text-base">
                {current.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(current.primaryPage)}
                  className="min-h-[44px] cursor-pointer whitespace-nowrap rounded-sm bg-[#0A543E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#073E2D]"
                >
                  {current.primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(current.secondaryPage)}
                  className="min-h-[44px] cursor-pointer whitespace-nowrap rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-5 py-2.5 text-sm font-semibold text-[#0A110E] transition-colors hover:border-[#0A543E] hover:text-[#0A543E]"
                >
                  {current.secondaryLabel}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Controls */}
          <div className="mt-6 flex items-center justify-between border-t border-[#EFECE4] pt-4 lg:mt-8">
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(idx, idx > index ? 1 : -1)}
                  aria-label={`سلائیڈ ${idx + 1}`}
                  className={`h-1.5 cursor-pointer rounded-none transition-all duration-300 ${
                    idx === index ? 'w-7 bg-[#0A543E]' : 'w-2.5 bg-[#CFC6B4] hover:bg-[#85581F]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="پچھلا بینر"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] text-[#0A110E] transition-colors hover:border-[#0A543E] hover:text-[#0A543E]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="اگلا بینر"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] text-[#0A110E] transition-colors hover:border-[#0A543E] hover:text-[#0A543E]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Slide Image Panel */}
        <div className="relative order-1 h-72 overflow-hidden bg-[#F3EFE6] sm:h-88 lg:order-2 lg:col-span-6 lg:h-auto">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.title}
              referrerPolicy="no-referrer"
              custom={direction}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 h-full w-full ${
                current.objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'
              }`}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
