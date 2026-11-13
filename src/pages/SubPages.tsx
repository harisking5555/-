import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import {
  CEREMONY_DETAILS,
  DEPARTMENTS,
  GALLERY_IMAGES,
  GalleryItem,
  JAMIA_INFO,
  LEADERS,
  PageId,
} from '../data/jamiaData';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { OnlineClassesSection } from '../components/OnlineClassesSection';
import { DarulIftaSection } from '../components/DarulIftaSection';
import { ResultsSection } from '../components/ResultsSection';
import { DonationsSection } from '../components/DonationsSection';
import { SocialIcons } from '../components/SocialIcons';

interface SubPageHeaderProps {
  title: string;
  arabicTitle: string;
  subtitle: string;
  onBackHome: () => void;
}

function SubPageHeader({ title, arabicTitle, subtitle, onBackHome }: SubPageHeaderProps) {
  return (
    <div className="no-print border-b border-[#DDD6C7] bg-white py-6 sm:py-9">
      <div className="mx-auto max-w-[1240px] px-3.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackHome}
          className="mb-3 inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 text-xs font-bold text-[#0A543E] hover:underline"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>واپس سرورق</span>
        </button>
        <p className="font-arabic text-base font-bold text-[#85581F]">{arabicTitle}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[#0A110E] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium text-[#1E2923]">{subtitle}</p>
      </div>
    </div>
  );
}

interface SubPageProps {
  page: Exclude<PageId, 'home'>;
  onNavigate: (page: PageId) => void;
  onOpenLightbox: (items: GalleryItem[], index: number) => void;
}

export function SubPages({ page, onNavigate, onOpenLightbox }: SubPageProps) {
  const [galleryCategory, setGalleryCategory] = useState<'سب تصاویر' | GalleryItem['category']>('سب تصاویر');

  return (
    <motion.div
      key={page}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {page === 'about' && (
        <div>
          <SubPageHeader
            title="تعارفِ جامعہ و مشائخِ عظام"
            arabicTitle="التعريف بالجامعة والمشايخ الكرام"
            subtitle="مرکزی جامعۃ البنات پرانا لاری اڈا قصور کی علمی، روحانی اور انتظامی قیادت کا مختصر تعارف۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {LEADERS.map((leader) => (
                <article
                  key={leader.id}
                  className="overflow-hidden rounded-sm border border-[#DDD6C7] bg-white"
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
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug text-[#0A110E]">
                      {leader.name}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#0A543E]">{leader.honorific}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#1E2923]">{leader.bio}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6 md:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-bold text-[#0A543E]">
                  مقاصد و امتیازاتِ جامعہ
                </h3>
                <ul className="mt-3 space-y-2 text-sm font-medium text-[#1E2923]">
                  <li>• طالبات کے لیے باپردہ، محفوظ اور دینی تربیتی ماحول۔</li>
                  <li>• تنظیم المدارس اہلسنت پاکستان کے نصاب و امتحانات کے مطابق تعلیم۔</li>
                  <li>• مستند عالمات و معلمات کی نگرانی میں حفظ و ناظرہ اور درسِ نظامی۔</li>
                  <li>• جدید دور کے تقاضوں کے مطابق آن لائن کلاسز اور دارالافتاء کی سہولت۔</li>
                </ul>
              </div>
              <div className="space-y-3 border-t border-[#EFECE4] pt-4 text-right text-sm font-medium text-[#1E2923] md:border-t-0 md:border-r md:pt-0 md:pr-6">
                <h3 className="font-display text-xl font-bold text-[#0A543E]">پتہ و رابطہ</h3>
                <p className="flex items-center justify-start gap-2 text-right">
                  <MapPin className="h-4 w-4 shrink-0 text-[#0A543E]" />
                  <span>{JAMIA_INFO.location}</span>
                </p>
                <p className="text-right">
                  <a href={`tel:${JAMIA_INFO.phone}`} className="inline-flex items-center justify-start gap-2 hover:text-[#0A543E]">
                    <Phone className="h-4 w-4 shrink-0 text-[#0A543E]" />
                    <span dir="ltr" className="tabular-nums">{JAMIA_INFO.phoneIntl}</span>
                  </a>
                </p>
                <p className="break-all text-right">
                  <a href={`mailto:${JAMIA_INFO.email}`} className="inline-flex items-center justify-start gap-2 hover:text-[#0A543E]">
                    <Mail className="h-4 w-4 shrink-0 text-[#0A543E]" />
                    <span dir="ltr">{JAMIA_INFO.email}</span>
                  </a>
                </p>
                <div className="pt-2">
                  <SocialIcons size="sm" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {page === 'departments' && (
        <div>
          <SubPageHeader
            title="شعبہ جات و نصابِ تعلیم"
            arabicTitle="الأقسام العلمية والمنهج الدراسي"
            subtitle="مرکزی جامعۃ البنات میں جاری باقاعدہ تعلیمی و تربیتی شعبہ جات کی تفصیل۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="rounded-sm border border-[#DDD6C7] bg-white p-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#3E4A43]">
                    <span className="font-bold tabular-nums text-[#0A543E]">{dept.num}</span>
                    <span>{dept.duration}</span>
                  </div>
                  <p className="mt-2 font-arabic text-base font-bold text-[#85581F]">
                    {dept.arabicTitle}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold text-[#0A110E]">{dept.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#1E2923]">{dept.summary}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A110E] sm:text-xl">
                  آن لائن یا اقامتی داخلے کے لیے درخواست دیں
                </h3>
                <p className="mt-1 text-sm font-medium text-[#1E2923]">
                  نئے تعلیمی سال کے داخلہ فارم آن لائن دستیاب ہیں۔
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('classes')}
                className="min-h-[44px] cursor-pointer rounded-sm bg-[#0A543E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#073E2D]"
              >
                داخلہ فارم کھولیں
              </button>
            </div>
          </section>
        </div>
      )}

      {page === 'classes' && (
        <div>
          <SubPageHeader
            title="آن لائن کلاسز و داخلہ"
            arabicTitle="الدروس المباشرة عبر الإنترنت"
            subtitle="دنیا بھر کی طالبات و خواتین کے لیے مستند معلمات کے زیرِ نگرانی آن لائن دینی کورسز۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <OnlineClassesSection />
          </section>
        </div>
      )}

      {page === 'darul-ifta' && (
        <div>
          <SubPageHeader
            title="آن لائن فقہی سوال و جواب"
            arabicTitle="دار الإفتاء والأسئلة الفقهية"
            subtitle="نماز، روزہ، زکوٰۃ، نکاح و طلاق اور روزمرہ شرعی مسائل کے مستند جوابات اور نیا سوال پوچھنے کی سہولت۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <DarulIftaSection />
          </section>
        </div>
      )}

      {page === 'results' && (
        <div>
          <SubPageHeader
            title="آن لائن امتحانی رزلٹ جامعہ ہذا"
            arabicTitle="النتائج السنوية — تنظيم المدارس"
            subtitle="تنظیم المدارس اہلسنت پاکستان کے سالانہ امتحانات کا رزلٹ کارڈ رول نمبر کے ذریعے چیک اور پرنٹ کریں۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <ResultsSection />
          </section>
        </div>
      )}

      {page === 'ceremony' && (
        <div>
          <SubPageHeader
            title={CEREMONY_DETAILS.title}
            arabicTitle={CEREMONY_DETAILS.arabicTitle}
            subtitle={`${CEREMONY_DETAILS.date} · ${CEREMONY_DETAILS.venue}`}
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-6">
                <div className="rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6">
                  <h2 className="font-display text-xl font-bold text-[#0A543E]">
                    پروگرام کی اہم خصوصیات
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-sm font-medium text-[#1E2923]">
                    {CEREMONY_DETAILS.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#0A543E]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6">
                  <h2 className="font-display text-xl font-bold text-[#0A543E]">
                    ترتیب و اوقاتِ تقریب
                  </h2>
                  <dl className="mt-4 divide-y divide-[#EFECE4] text-sm">
                    {CEREMONY_DETAILS.schedule.map((row) => (
                      <div key={row.time} className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="font-bold tabular-nums text-[#85581F]">{row.time}</dt>
                        <dd className="font-semibold text-[#0A110E]">{row.item}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:col-span-6">
                {GALLERY_IMAGES.filter((g) => g.category === 'تقسیمِ اسناد').map((photo) => {
                  const idx = GALLERY_IMAGES.findIndex((i) => i.id === photo.id);
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => onOpenLightbox(GALLERY_IMAGES, idx)}
                      className="group cursor-pointer overflow-hidden rounded-sm border border-[#DDD6C7] bg-white text-right"
                    >
                      <ImageWithFallback
                        src={photo.src}
                        alt={photo.title}
                        aspectClass="aspect-[4/3]"
                        className="group-hover:scale-[1.03]"
                      />
                      <div className="p-3">
                        <p className="text-xs font-bold text-[#0A110E]">{photo.title}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#3E4A43]">{photo.caption}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {page === 'gallery' && (
        <div>
          <SubPageHeader
            title="جامعہ کی تصویری جھلکیاں"
            arabicTitle="معرض صور الجامعة"
            subtitle="اکابرینِ جامعہ، سالانہ تقسیمِ اسناد اور تعلیمی سرگرمیوں کی یادگار تصاویر۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mb-6 flex flex-wrap gap-2">
              {(['سب تصاویر', 'اکابرین و مشائخ', 'تقسیمِ اسناد', 'درس و تدریس', 'جامعہ جھلکیاں'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryCategory(cat)}
                    className={`min-h-[40px] cursor-pointer rounded-sm px-3.5 py-2 text-xs font-semibold transition-colors ${
                      galleryCategory === cat
                        ? 'bg-[#0A543E] text-white'
                        : 'border border-[#DDD6C7] bg-white text-[#0A110E] hover:border-[#0A543E]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY_IMAGES.filter(
                (g) => galleryCategory === 'سب تصاویر' || g.category === galleryCategory
              ).map((item) => {
                const idx = GALLERY_IMAGES.findIndex((g) => g.id === item.id);
                const isScholar = item.category === 'اکابرین و مشائخ';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenLightbox(GALLERY_IMAGES, idx)}
                    className="group cursor-pointer overflow-hidden rounded-sm border border-[#DDD6C7] bg-white text-right"
                  >
                    <ImageWithFallback
                      src={item.src}
                      alt={item.title}
                      aspectClass="aspect-[4/3]"
                      objectFit={isScholar ? 'contain' : 'cover'}
                      className={isScholar ? 'p-1.5' : 'group-hover:scale-[1.03]'}
                    />
                    <div className="p-4">
                      <p className="text-xs font-bold text-[#85581F]">{item.category}</p>
                      <h2 className="mt-1 text-sm font-bold text-[#0A110E]">{item.title}</h2>
                      <p className="mt-1 text-xs font-medium text-[#1E2923]">{item.caption}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {page === 'donations' && (
        <div>
          <SubPageHeader
            title="جامعہ کا بینک اکاؤنٹ و مالی تعاون"
            arabicTitle="الحساب البنكي والتبرعات للجامعة"
            subtitle="دینی تعلیم کی اشاعت اور طالبات کی کفالت کے لیے زکوٰۃ، صدقات، فطرانہ اور للہ عطیات ارسال فرمائیں۔"
            onBackHome={() => onNavigate('home')}
          />
          <section className="mx-auto max-w-[1240px] px-3.5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <DonationsSection />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-[#DDD6C7] bg-white p-5 sm:p-6">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0A110E]">
                  جامعہ کے آفیشل چینلز
                </h3>
                <p className="mt-1 text-xs font-medium text-[#3E4A43]">
                  تازہ بیانات، اعلانات اور امتحانی اطلاعات کے لیے رابطے میں رہیں۔
                </p>
              </div>
              <SocialIcons size="md" />
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );
}
