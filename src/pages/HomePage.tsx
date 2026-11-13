import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import {
  CEREMONY_DETAILS,
  DEPARTMENTS,
  GALLERY_IMAGES,
  GalleryItem,
  JAMIA_INFO,
  LEADERS,
  PRAYER_TIMES_KASUR,
  PageId,
} from '../data/jamiaData';
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { OnlineClassesSection } from '../components/OnlineClassesSection';
import { DarulIftaSection } from '../components/DarulIftaSection';
import { ResultsSection } from '../components/ResultsSection';
import { DonationsSection } from '../components/DonationsSection';
import { SocialIcons } from '../components/SocialIcons';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenLightbox: (items: GalleryItem[], index: number) => void;
}

const QUICK_PAGES: { id: PageId; label: string }[] = [
  { id: 'about', label: 'تعارف و مشائخ' },
  { id: 'departments', label: 'شعبہ جات' },
  { id: 'classes', label: 'آن لائن کلاسز' },
  { id: 'darul-ifta', label: 'دارالافتاء' },
  { id: 'results', label: 'امتحانی نتائج' },
  { id: 'ceremony', label: 'تقسیمِ اسناد' },
  { id: 'gallery', label: 'تصویری جھلکیاں' },
  { id: 'donations', label: 'بینک اکاؤنٹ' },
];

const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};

export function HomePage({ onNavigate, onOpenLightbox }: HomePageProps) {
  const [galleryFilter, setGalleryFilter] = useState<'سب تصاویر' | GalleryItem['category']>('سب تصاویر');

  const filteredGallery =
    galleryFilter === 'سب تصاویر'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((item) => item.category === galleryFilter);

  return (
    <div>
      {/* 1. Animated Hero Banner Slider + Institutional Proof + Quick Page Grid */}
      <section className="border-b border-[#DDD6C7] bg-[#FAF8F4] py-5 sm:py-8">
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <HeroBannerSlider onNavigate={onNavigate} />

          {/* 4-Column Institutional Proof Strip */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-sm border border-[#DDD6C7] bg-white p-3.5 sm:p-4">
              <p className="text-xs font-medium text-[#3E4A43]">تعلیمی الحاق</p>
              <p className="mt-1 font-display text-sm font-bold text-[#0A543E]">تنظیم المدارس اہلسنت</p>
            </div>
            <div className="rounded-sm border border-[#DDD6C7] bg-white p-3.5 sm:p-4">
              <p className="text-xs font-medium text-[#3E4A43]">شعبہ جات</p>
              <p className="mt-1 font-display text-sm font-bold text-[#0A110E]">حفظ، تجوید و عالمہ کورس</p>
            </div>
            <div className="rounded-sm border border-[#DDD6C7] bg-white p-3.5 sm:p-4">
              <p className="text-xs font-medium text-[#3E4A43]">آن لائن نظام</p>
              <p className="mt-1 font-display text-sm font-bold text-[#0A110E]">کلاسز و دارالافتاء</p>
            </div>
            <div className="rounded-sm border border-[#DDD6C7] bg-white p-3.5 sm:p-4">
              <p className="text-xs font-medium text-[#3E4A43]">مرکزِ جامعہ</p>
              <p className="mt-1 font-display text-sm font-bold text-[#0A110E]">پرانا لاری اڈا، قصور</p>
            </div>
          </div>

          {/* Mobile-Optimized Multi-Page Quick Directory */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {QUICK_PAGES.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onNavigate(page.id)}
                className="min-h-[42px] cursor-pointer truncate rounded-sm border border-[#DDD6C7] bg-[#F3EFE6] px-3 py-2 text-center text-xs font-semibold text-[#0A110E] transition-colors hover:border-[#0A543E] hover:bg-white hover:text-[#0A543E]"
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Founders & Leadership (Uncropped Complete Portraits) */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-white py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">مشائخ و اکابرینِ جامعہ</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                بانی، سرپرستِ اعلیٰ و ناظمِ اعلیٰ
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-[#0A543E] hover:underline"
            >
              <span>تعارفِ جامعہ پڑھیں</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {LEADERS.map((leader) => (
              <article
                key={leader.id}
                className="overflow-hidden rounded-sm border border-[#DDD6C7] bg-[#FAF8F4]"
              >
                <div className="border-b border-[#E5DEC9] bg-[#F3EFE6] p-2">
                  <ImageWithFallback
                    src={leader.image}
                    alt={leader.name}
                    aspectClass="h-72 sm:h-80 w-full"
                    objectFit="contain"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#85581F]">
                    <span>{leader.role}</span>
                    <span className="font-arabic">{leader.arabicRole}</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold leading-snug text-[#0A110E] sm:text-lg">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#0A543E]">{leader.honorific}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#1E2923]">{leader.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. Academic Departments */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-[#FAF8F4] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">الأقسام العلمية</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                شعبہ جات و نصابِ تعلیم
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('departments')}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-[#0A543E] hover:underline"
            >
              <span>تمام شعبہ جات</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#3E4A43]">
                  <span className="font-bold tabular-nums text-[#0A543E]">{dept.num}</span>
                  <span>{dept.duration}</span>
                </div>
                <p className="mt-2 font-arabic text-sm font-bold text-[#85581F]">
                  {dept.arabicTitle}
                </p>
                <h3 className="mt-0.5 font-display text-base font-bold text-[#0A110E]">
                  {dept.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1E2923]">{dept.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Online Classes Section */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-[#F3EFE6] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">الدروس المباشرة عبر الإنترنت</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                آن لائن کلاسز کے بارے میں
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('classes')}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-[#0A543E] hover:underline"
            >
              <span>تفصیلی صفحہ کھولیں</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <OnlineClassesSection compact />
        </div>
      </motion.section>

      {/* 5. Online Fiqhi Q&A (Dar-ul-Ifta) */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-[#FAF8F4] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">دار الإفتاء والأسئلة الفقهية</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                آن لائن فقہی سوال و جواب
              </h2>
            </div>
          </div>
          <DarulIftaSection compact onOpenFullPage={() => onNavigate('darul-ifta')} />
        </div>
      </motion.section>

      {/* 6. Online Result (Tanzeem-ul-Madaris) */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-white py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <ResultsSection compact onOpenFullPage={() => onNavigate('results')} />
        </div>
      </motion.section>

      {/* 7. Annual Certificate Distribution Ceremony */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-[#FAF8F4] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6 lg:col-span-6">
              <div>
                <p className="font-arabic text-base font-bold text-[#85581F]">
                  {CEREMONY_DETAILS.arabicTitle}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                  {CEREMONY_DETAILS.title}
                </h2>
                <p className="mt-2 text-xs font-medium text-[#3E4A43]">
                  {CEREMONY_DETAILS.date} · {CEREMONY_DETAILS.venue}
                </p>

                <ul className="mt-5 space-y-2.5 text-sm font-medium text-[#1E2923]">
                  {CEREMONY_DETAILS.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#0A543E]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#EFECE4] pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('ceremony')}
                  className="min-h-[42px] cursor-pointer rounded-sm bg-[#0A543E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#073E2D] sm:text-sm"
                >
                  پروگرام کی مکمل تفصیل
                </button>
                <span className="text-xs font-medium text-[#3E4A43]">
                  زیرِ سرپرستی: {CEREMONY_DETAILS.patron}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:col-span-6">
              {[GALLERY_IMAGES[3], GALLERY_IMAGES[5], GALLERY_IMAGES[8], GALLERY_IMAGES[13]].map(
                (photo) => {
                  const realIndex = GALLERY_IMAGES.findIndex((g) => g.id === photo.id);
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => onOpenLightbox(GALLERY_IMAGES, realIndex)}
                      className="group cursor-pointer overflow-hidden rounded-sm border border-[#DDD6C7] bg-white text-right"
                    >
                      <ImageWithFallback
                        src={photo.src}
                        alt={photo.title}
                        aspectClass="aspect-[4/3]"
                        className="group-hover:scale-[1.03]"
                      />
                      <p className="truncate px-3 py-2 text-xs font-semibold text-[#0A110E]">
                        {photo.title}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. Photo Highlights (All 15 Jamia Images) */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-white py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-arabic text-base font-bold text-[#85581F]">معرض الصور</p>
              <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
                جامعہ کی تصویری جھلکیاں
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['سب تصاویر', 'اکابرین و مشائخ', 'تقسیمِ اسناد', 'درس و تدریس', 'جامعہ جھلکیاں'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryFilter(cat)}
                    className={`min-h-[38px] cursor-pointer whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors ${
                      galleryFilter === cat
                        ? 'bg-[#0A543E] text-white'
                        : 'bg-[#F3EFE6] text-[#1E2923] hover:text-[#0A110E]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {filteredGallery.map((item) => {
              const globalIdx = GALLERY_IMAGES.findIndex((g) => g.id === item.id);
              const isScholar = item.category === 'اکابرین و مشائخ';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenLightbox(GALLERY_IMAGES, globalIdx)}
                  className="group cursor-pointer overflow-hidden rounded-sm border border-[#DDD6C7] bg-[#FAF8F4] text-right"
                >
                  <ImageWithFallback
                    src={item.src}
                    alt={item.title}
                    aspectClass="aspect-[4/3]"
                    objectFit={isScholar ? 'contain' : 'cover'}
                    className={isScholar ? 'p-1' : 'group-hover:scale-[1.03]'}
                  />
                  <div className="p-2.5">
                    <p className="truncate text-xs font-bold text-[#0A110E]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-[#3E4A43]">{item.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 9. Bank Account & Donations */}
      <motion.section
        {...revealProps}
        className="border-b border-[#DDD6C7] bg-[#FAF8F4] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="font-arabic text-base font-bold text-[#85581F]">تعاون و صدقۂ جاریہ</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[#0A110E] sm:text-3xl">
              جامعہ کا بینک اکاؤنٹ و مالی تعاون
            </h2>
            <p className="mt-1 text-sm font-medium text-[#1E2923]">
              دینی تعلیم کی اشاعت اور طالباتِ علم کی کفالت کے لیے زکوٰۃ، صدقات اور عطیات جمع کروائیں۔
            </p>
          </div>
          <DonationsSection />
        </div>
      </motion.section>

      {/* 10. Kasur Prayer Timings, Daily Hadith & Direct Contact (Right-Aligned Phone/Email + Icon-Only Socials) */}
      <motion.section
        {...revealProps}
        className="bg-white py-10 sm:py-12"
      >
        <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Prayer Times Card */}
            <div className="rounded-sm border border-[#DDD6C7] bg-[#FAF8F4] p-4 sm:p-6 lg:col-span-7">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-[#0A110E] sm:text-xl">
                  اوقاتِ نماز — قصور
                </h3>
                <span className="font-arabic text-sm font-bold text-[#85581F]">
                  أوقات الصلاة
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
                {PRAYER_TIMES_KASUR.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-sm border border-[#DDD6C7] bg-white p-3 text-center"
                  >
                    <p className="text-xs font-semibold text-[#1E2923]">{p.name}</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-[#0A543E]" dir="ltr">
                      {p.time}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-[#DDD6C7] pt-3 font-arabic text-base font-bold text-[#0A110E]">
                {JAMIA_INFO.heroHadith}
                <span className="mr-2 font-naskh text-xs font-semibold text-[#1E2923]">
                  (علم حاصل کرنا ہر مسلمان پر فرض ہے)
                </span>
              </p>
            </div>

            {/* Direct Contact Card — strictly right-aligned */}
            <div className="flex flex-col justify-between rounded-sm border border-[#DDD6C7] bg-[#FAF8F4] p-4 text-right sm:p-6 lg:col-span-5">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A110E] sm:text-xl">
                  براہِ راست رابطہ دفترِ جامعہ
                </h3>
                <div className="mt-4 space-y-2.5 text-sm font-medium text-[#1E2923]">
                  <p className="flex items-center justify-start gap-2 text-right">
                    <MapPin className="h-4 w-4 shrink-0 text-[#0A543E]" />
                    <span>{JAMIA_INFO.location}</span>
                  </p>
                  <p className="text-right">
                    <a
                      href={`tel:${JAMIA_INFO.phone}`}
                      className="inline-flex items-center justify-start gap-2 hover:text-[#0A543E]"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-[#0A543E]" />
                      <span dir="ltr" className="tabular-nums">{JAMIA_INFO.phoneIntl}</span>
                    </a>
                  </p>
                  <p className="break-all text-right">
                    <a
                      href={`mailto:${JAMIA_INFO.email}`}
                      className="inline-flex items-center justify-start gap-2 hover:text-[#0A543E]"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-[#0A543E]" />
                      <span dir="ltr">{JAMIA_INFO.email}</span>
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#DDD6C7] pt-4">
                <SocialIcons size="md" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
