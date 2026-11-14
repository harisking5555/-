import { FormEvent, useEffect, useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Scale,
  Award,
  Calendar,
  Search,
  CheckCircle2,
  Copy,
  Printer,
  Menu,
  X,
  Lock,
  Landmark,
  Images,
  GraduationCap,
  Globe,
} from 'lucide-react';
import {
  FiqhQuestion,
  JamiaAdmission,
  JamiaResult,
  JamiaSiteConfig,
  PublicSection,
} from '../types/jamia';
import {
  GALLERY_PHOTOS,
  HERO_BANNERS,
  INITIAL_COURSES,
  LEADERSHIP_PROFILES,
} from '../data/jamiaData';
import { Modal } from './ui/Modal';

export type SiteLang = 'ur' | 'en';

interface PublicWebsiteProps {
  lang: SiteLang;
  langPromptOpen: boolean;
  onSelectLanguage: (lang: SiteLang) => void;
  siteConfig: JamiaSiteConfig;
  courses: typeof INITIAL_COURSES;
  questions: FiqhQuestion[];
  results: JamiaResult[];
  onSubmitQuestion: (q: FiqhQuestion) => void;
  onSubmitAdmission: (adm: JamiaAdmission) => void;
  onOpenAdminLogin: () => void;
  onNotify: (msg: string) => void;
}

const NAV_ITEMS: { id: PublicSection; ur: string; en: string }[] = [
  { id: 'home', ur: 'صفحہ اول', en: 'Home' },
  { id: 'classes', ur: 'آن لائن کلاسز', en: 'Online Classes' },
  { id: 'darulifta', ur: 'آن لائن دارالافتاء', en: 'Darul Ifta' },
  { id: 'results', ur: 'آن لائن نتائج', en: 'Online Results' },
  { id: 'program', ur: 'تقریبِ تقسیمِ اسناد', en: 'Annual Program' },
  { id: 'gallery', ur: 'تصویری گیلری', en: 'Gallery' },
  { id: 'admissions', ur: 'داخلہ و عطیات', en: 'Admissions & Donations' },
];

export function PublicWebsite({
  lang,
  langPromptOpen,
  onSelectLanguage,
  siteConfig,
  courses,
  questions,
  results,
  onSubmitQuestion,
  onSubmitAdmission,
  onOpenAdminLogin,
  onNotify,
}: PublicWebsiteProps) {
  const isEn = lang === 'en';
  const [activeSection, setActiveSection] = useState<PublicSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; title: string } | null>(null);

  // Darul Ifta search & form
  const [fiqhSearch, setFiqhSearch] = useState('');
  const [qName, setQName] = useState('');
  const [qCity, setQCity] = useState('');
  const [qCat, setQCat] = useState('نماز و طہارت');
  const [qText, setQText] = useState('');

  // Results search
  const [resultQuery, setResultQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<JamiaResult | null>(results[0] ?? null);

  // Admission form
  const [admName, setAdmName] = useState('');
  const [admFather, setAdmFather] = useState('');
  const [admDarja, setAdmDarja] = useState('درسِ نظامی (عالمہ کورس)');
  const [admPhone, setAdmPhone] = useState('');
  const [admCity, setAdmCity] = useState('');
  const [admType, setAdmType] = useState<JamiaAdmission['type']>('آن لائن');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const currentBanner = HERO_BANNERS[slideIdx];
  const marqueeText = isEn
    ? 'Admissions Open for Academic Session 2026–2027 — Online Dars-e-Nizami (Alimah), Tajweed, Hifz-ul-Quran & Farz Uloom Courses Available'
    : siteConfig.heroNotice;

  const handleNav = (section: PublicSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (value: string, labelUr: string, labelEn: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    onNotify(isEn ? `${labelEn} copied: ${value}` : `${labelUr} کاپی کر لیا گیا: ${value}`);
  };

  const handleAskFiqh = (e: FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;
    const item: FiqhQuestion = {
      id: `FQ-${104 + questions.length}`,
      questioner: qName.trim() || (isEn ? 'Questioner' : 'سائل'),
      city: qCity.trim() || (isEn ? 'Kasur' : 'قصور'),
      category: qCat,
      question: qText.trim(),
      answer: '',
      date: '2026-11-14',
      status: 'زیر غور',
    };
    onSubmitQuestion(item);
    onNotify(
      isEn
        ? 'Your Fiqhi question has been submitted to Darul Ifta. A scholar will respond shortly.'
        : 'آپ کا شرعی سوال دارالافتاء کو موصول ہو گیا ہے۔ جواب جلد شائع کیا جائے گا۔'
    );
    setQName('');
    setQCity('');
    setQText('');
  };

  const handleAdmissionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!admName.trim() || !admPhone.trim()) return;
    const item: JamiaAdmission = {
      id: `ADM-${10 + Math.floor(Math.random() * 80)}`,
      studentName: admName.trim(),
      fatherName: admFather.trim() || '—',
      darja: admDarja,
      phone: admPhone.trim(),
      city: admCity.trim() || (isEn ? 'Kasur' : 'قصور'),
      appliedDate: '2026-11-14',
      type: admType,
      status: 'زیر غور',
    };
    onSubmitAdmission(item);
    onNotify(
      isEn
        ? `Admission application for ${item.studentName} submitted successfully.`
        : `داخلہ درخواست برائے ${item.studentName} کامیابی سے جمع ہو گئی۔`
    );
    setAdmName('');
    setAdmFather('');
    setAdmPhone('');
    setAdmCity('');
  };

  const answeredQuestions = questions.filter(
    (q) =>
      q.status === 'جواب جاری' &&
      (fiqhSearch.trim() === '' ||
        q.question.toLowerCase().includes(fiqhSearch.trim().toLowerCase()) ||
        q.answer.toLowerCase().includes(fiqhSearch.trim().toLowerCase()) ||
        q.category.toLowerCase().includes(fiqhSearch.trim().toLowerCase()))
  );

  const matchedResults = results.filter((r) => {
    const q = resultQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      r.rollNo.toLowerCase().includes(q) ||
      r.studentName.toLowerCase().includes(q) ||
      r.darja.toLowerCase().includes(q)
    );
  });

  return (
    <div dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* 1. Scrolling Marquee Top Bar */}
      <div className="no-print marquee-wrapper overflow-hidden border-b border-blue-900 bg-[#0A1E38] py-1.5 text-xs font-semibold text-blue-100">
        <div className={isEn ? 'marquee-track-ltr' : 'marquee-track-rtl'}>
          <span className="px-8">{marqueeText}</span>
          <span className="px-8 text-blue-300">✦</span>
          <span className="px-8">{marqueeText}</span>
          <span className="px-8 text-blue-300">✦</span>
        </div>
      </div>

      {/* 2. Utility Bar: Phone & Email + Social Icons + Language Toggle + Admin Login */}
      <div className="no-print border-b border-slate-200 bg-[#0F294A] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-1.5 font-medium text-slate-100 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 text-blue-300" />
              <span className="font-mono-num" dir="ltr">
                {siteConfig.phone}
              </span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 font-medium text-slate-100 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5 text-blue-300" />
              <span className="font-mono-num" dir="ltr">
                {siteConfig.email}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => onSelectLanguage(isEn ? 'ur' : 'en')}
              className="inline-flex cursor-pointer items-center gap-1.5 border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20"
            >
              <Globe className="h-3 w-3 text-blue-300" />
              <span>{isEn ? 'اردو' : 'English'}</span>
            </button>

            <a
              href={siteConfig.whatsappChannel}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp Channel"
              title="WhatsApp Channel"
              className="flex h-7 w-7 items-center justify-center border border-white/20 bg-white/10 text-white transition-colors hover:bg-emerald-600"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M12.03 2a9.97 9.97 0 0 0-8.52 15.17L2 22l4.98-1.46A9.98 9.98 0 1 0 12.03 2Zm5.8 14.12c-.24.68-1.4 1.3-1.95 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.32-1.72-.63-3.03-1.31-5-4.38-5.15-4.58-.15-.2-1.23-1.63-1.23-3.11 0-1.48.77-2.2 1.05-2.5.28-.3.6-.38.8-.38h.58c.18 0 .44-.07.68.52.25.6.85 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.3.32-.13.62.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.08.13.08.73-.17 1.41Z" />
              </svg>
            </a>

            <a
              href={siteConfig.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              title="TikTok"
              className="flex h-7 w-7 items-center justify-center border border-white/20 bg-white/10 text-white transition-colors hover:bg-slate-800"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.04.86.13V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.73a8.18 8.18 0 0 0 4.78 1.53V6.82a4.83 4.83 0 0 1-.87-.13Z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="inline-flex cursor-pointer items-center gap-1.5 border border-blue-400/50 bg-[#2563EB] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[#1D4ED8]"
            >
              <Lock className="h-3 w-3" />
              <span>{isEn ? 'Admin Login' : 'ایڈمن لاگ ان'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Header & Navigation (Two-Line Balanced Brand Name, No Address Subtitle) */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`flex shrink-0 cursor-pointer items-center gap-3 ${
              isEn ? 'text-left' : 'text-right'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0F294A] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-[#0F294A] sm:text-[15px]">
                {isEn ? 'Markazi Jamia tul Banat' : 'مرکزی جامعۃ البنات'}
              </p>
              <p className="mt-0.5 text-xs font-bold text-[#2563EB] sm:text-[13px]">
                {isEn ? 'Purana Lari Adda Kasur' : 'پرانا لاری اڈا قصور'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`cursor-pointer px-3 py-2 text-xs font-bold transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#0F294A] text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F294A]'
                }`}
              >
                {isEn ? item.en : item.ur}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label={isEn ? 'Open menu' : 'مینو کھولیں'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Drawer Nav */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`cursor-pointer border px-3 py-2 text-xs font-bold ${
                    isEn ? 'text-left' : 'text-right'
                  } ${
                    activeSection === item.id
                      ? 'border-[#0F294A] bg-[#0F294A] text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  {isEn ? item.en : item.ur}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* HOME PAGE */}
        {activeSection === 'home' && (
          <div className="space-y-10">
            {/* Animated Banner Slider */}
            <section className="overflow-hidden border border-slate-200 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div
                  key={`${currentBanner.id}-${lang}`}
                  className="animate-slide-in flex flex-col justify-between p-6 sm:p-8 lg:col-span-6"
                >
                  <div>
                    <span className="inline-block border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
                      {isEn ? currentBanner.tagEn : currentBanner.tag}
                    </span>
                    <h1 className="mt-4 text-xl font-extrabold leading-relaxed text-[#0F294A] sm:text-2xl">
                      {isEn ? currentBanner.titleEn : currentBanner.title}
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {isEn ? currentBanner.descriptionEn : currentBanner.description}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => handleNav(currentBanner.targetSection)}
                      className="cursor-pointer bg-[#0F294A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#193B68]"
                    >
                      {isEn ? currentBanner.actionLabelEn : currentBanner.actionLabel}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSlideIdx(
                            (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
                          )
                        }
                        aria-label={isEn ? 'Previous banner' : 'پچھلا بینر'}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        {isEn ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex items-center gap-1.5">
                        {HERO_BANNERS.map((b, i) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSlideIdx(i)}
                            aria-label={`Banner ${i + 1}`}
                            className={`h-2 cursor-pointer transition-all ${
                              slideIdx === i ? 'w-6 bg-[#0F294A]' : 'w-2 bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_BANNERS.length)}
                        aria-label={isEn ? 'Next banner' : 'اگلا بینر'}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        {isEn ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronLeft className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative flex min-h-[260px] items-center justify-center bg-slate-100 lg:col-span-6 lg:min-h-[340px]">
                  <img
                    src={currentBanner.image}
                    alt={isEn ? currentBanner.titleEn : currentBanner.title}
                    className="h-full max-h-[380px] w-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Quick Navigation Service Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: 'classes' as PublicSection,
                  ur: 'آن لائن کلاسز',
                  en: 'Online Classes',
                  descUr: 'درسِ نظامی، تجوید، حفظ و فرض علوم',
                  descEn: 'Dars-e-Nizami, Tajweed, Hifz & Farz Uloom',
                  icon: BookOpen,
                },
                {
                  id: 'darulifta' as PublicSection,
                  ur: 'آن لائن دارالافتاء',
                  en: 'Online Darul Ifta',
                  descUr: 'مستند شرعی مسائل اور فقہی رہنمائی',
                  descEn: 'Authentic Islamic Rulings & Fiqhi Guidance',
                  icon: Scale,
                },
                {
                  id: 'results' as PublicSection,
                  ur: 'آن لائن نتائج',
                  en: 'Online Results',
                  descUr: 'رول نمبر سے سالانہ و ششماہی نتائج',
                  descEn: 'Check Annual & Term Results by Roll No',
                  icon: Award,
                },
                {
                  id: 'program' as PublicSection,
                  ur: 'تقریبِ تقسیمِ اسناد',
                  en: 'Annual Sanad Program',
                  descUr: 'سالانہ تقریبِ سعید، تاریخ اور نظام الاوقات',
                  descEn: 'Annual Convocation Date & Schedule',
                  icon: Calendar,
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleNav(card.id)}
                    className={`cursor-pointer border border-slate-200 bg-white p-5 transition-colors hover:border-[#2563EB] ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-[#0F294A]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="mt-3 text-sm font-bold text-[#0F294A]">
                      {isEn ? card.en : card.ur}
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      {isEn ? card.descEn : card.descUr}
                    </p>
                  </button>
                );
              })}
            </section>

            {/* 3 Ulama / Leadership Portraits — Uncropped Full Size (object-contain) */}
            <section className="space-y-4">
              <div
                className={
                  isEn
                    ? 'border-l-4 border-[#0F294A] pl-3'
                    : 'border-r-4 border-[#0F294A] pr-3'
                }
              >
                <h2 className="text-lg font-extrabold text-[#0F294A]">
                  {isEn ? 'Founders & Spiritual Leadership' : 'بانیان و اکابرینِ جامعہ'}
                </h2>
                <p className="text-xs text-slate-600">
                  {isEn
                    ? 'Guided by esteemed Sunni scholars and spiritual elders'
                    : 'اکابر علمائے اہلِ سنت کی سرپرستی و رہنمائی میں دینی خدمات کا تسلسل'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {LEADERSHIP_PROFILES.map((leader) => (
                  <div
                    key={leader.id}
                    className="flex flex-col border border-slate-200 bg-white"
                  >
                    <div className="flex h-80 w-full items-center justify-center border-b border-slate-200 bg-slate-50 p-2">
                      <img
                        src={leader.image}
                        alt={isEn ? leader.nameEn : leader.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <span className="inline-block border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0F294A]">
                        {isEn ? leader.badgeEn : leader.badge}
                      </span>
                      <h3 className="mt-2 text-sm font-bold leading-relaxed text-slate-900">
                        {isEn ? leader.nameEn : leader.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {isEn ? leader.roleEn : leader.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Donations / Bank Account & Annual Program Strip */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="border border-slate-200 bg-white p-6 lg:col-span-7">
                <div className="flex items-center gap-2 text-[#0F294A]">
                  <Landmark className="h-5 w-5" />
                  <h2 className="text-base font-extrabold">
                    {isEn
                      ? 'Donations, Zakah & Bank Account Details'
                      : 'بینک اکاؤنٹ برائے عطیات، زکوٰۃ و صدقات'}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {isEn
                    ? 'Support religious education, student meals (Langar), and Jamia development through Zakah, Sadaqat, and donations.'
                    : 'طالباتِ علمِ دین کی کفالت، لنگر اور تعمیراتی خدمات میں زکوٰۃ، صدقاتِ واجبہ و نافلہ اور عطیات کے ذریعے تعاون فرمائیں۔'}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <p className="text-slate-500">{isEn ? 'Bank Name' : 'بینک کا نام'}</p>
                    <p className="mt-1 font-bold text-slate-900">{siteConfig.bankName}</p>
                  </div>
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <p className="text-slate-500">{isEn ? 'Account Title' : 'اکاؤنٹ ٹائٹل'}</p>
                    <p className="mt-1 font-bold text-slate-900" dir="ltr">
                      {siteConfig.accountTitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-slate-500">{isEn ? 'Account Number' : 'اکاؤنٹ نمبر'}</p>
                      <p className="mt-1 font-mono-num font-bold text-[#0F294A]" dir="ltr">
                        {siteConfig.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(siteConfig.accountNumber, 'اکاؤنٹ نمبر', 'Account Number')
                      }
                      className="cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100"
                      title={isEn ? 'Copy' : 'کاپی کریں'}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-slate-500">
                        {isEn ? 'EasyPaisa / JazzCash' : 'ایزی پیسہ / جاز کیش'}
                      </p>
                      <p className="mt-1 font-bold text-[#0F294A]">{siteConfig.easypaisa}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(siteConfig.phone, 'ایزی پیسہ نمبر', 'EasyPaisa Number')
                      }
                      className="cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100"
                      title={isEn ? 'Copy' : 'کاپی کریں'}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-6 lg:col-span-5">
                <div className="flex items-center gap-2 text-[#0F294A]">
                  <Calendar className="h-5 w-5" />
                  <h2 className="text-base font-extrabold">
                    {isEn
                      ? 'Annual Certificate & Sanad Ceremony'
                      : siteConfig.annualProgramTitle}
                  </h2>
                </div>
                <p className="mt-2 text-xs font-semibold text-[#2563EB]">
                  {isEn
                    ? '25 Rajab-ul-Murajjab / Sunday 9:00 AM · Markazi Jamia tul Banat Kasur'
                    : `${siteConfig.annualProgramDate} · ${siteConfig.annualProgramVenue}`}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-700">
                  {isEn
                    ? 'Annual awards and certificates will be presented to top-ranking students, Dars-e-Nizami graduates, and Huffaz, alongside keynote speeches by esteemed scholars.'
                    : siteConfig.annualProgramDetails}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleNav('program')}
                    className="cursor-pointer bg-[#0F294A] px-4 py-2 text-xs font-bold text-white"
                  >
                    {isEn ? 'Full Program Schedule' : 'مکمل پروگرام دیکھیں'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gallery')}
                    className="cursor-pointer border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                  >
                    {isEn ? 'Photo Gallery' : 'تصویری گیلری'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ONLINE CLASSES */}
        {activeSection === 'classes' && (
          <div className="space-y-6">
            <div className="border border-slate-200 bg-white p-6">
              <h1 className="text-xl font-extrabold text-[#0F294A]">
                {isEn
                  ? 'Online Classes & Academic Departments'
                  : 'آن لائن کلاسز اور تعلیمی شعبہ جات'}
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                {isEn
                  ? 'Acquire authentic Islamic education from home under qualified female scholars and Muftis.'
                  : 'گھر بیٹھے مستند عالمات اور مفتیانِ کرام سے دینی تعلیم حاصل کریں۔'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {courses.map((c) => (
                <div key={c.id} className="border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-[#0F294A]">
                      {isEn ? c.titleEn : c.title}
                    </h2>
                    <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      {isEn ? c.seatsEn : c.seats}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {isEn ? c.descriptionEn : c.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <p>
                      {isEn ? 'Duration:' : 'مدت:'}{' '}
                      <strong className="text-slate-900">{isEn ? c.durationEn : c.duration}</strong>
                    </p>
                    <p>
                      {isEn ? 'Timings:' : 'اوقات:'}{' '}
                      <strong className="text-slate-900">{isEn ? c.timingEn : c.timing}</strong>
                    </p>
                    <p className="col-span-2">
                      {isEn ? 'Faculty:' : 'نگرانی:'}{' '}
                      <strong className="text-slate-900">{isEn ? c.teacherEn : c.teacher}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdmDarja(c.title);
                      setAdmType('آن لائن');
                      handleNav('admissions');
                    }}
                    className="mt-4 cursor-pointer bg-[#0F294A] px-4 py-2 text-xs font-bold text-white hover:bg-[#193B68]"
                  >
                    {isEn ? 'Apply for This Course' : 'اس کورس میں داخلہ لیں'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DARUL IFTA */}
        {activeSection === 'darulifta' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="border border-slate-200 bg-white p-5">
                <h1 className="text-lg font-extrabold text-[#0F294A]">
                  {isEn
                    ? 'Online Darul Ifta (Islamic Q&A)'
                    : 'آن لائن دارالافتاء — فقہی سوال و جواب'}
                </h1>
                <div className="relative mt-3">
                  <Search
                    className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
                      isEn ? 'left-3' : 'right-3'
                    }`}
                  />
                  <input
                    type="text"
                    value={fiqhSearch}
                    onChange={(e) => setFiqhSearch(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Search rulings or topics (e.g. Salah, Zakah)...'
                        : 'مسئلہ یا موضوع تلاش کریں (مثلاً نماز، زکوٰۃ)...'
                    }
                    className={`h-9 w-full border border-slate-300 bg-slate-50 text-xs focus:border-[#2563EB] focus:bg-white focus:outline-none ${
                      isEn ? 'pr-3 pl-9' : 'pr-9 pl-3'
                    }`}
                  />
                </div>
              </div>

              {answeredQuestions.map((q) => (
                <div key={q.id} className="border border-slate-200 bg-white p-5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="font-bold text-[#2563EB]">{q.category}</span>
                    <span className="font-mono-num">
                      {q.id} · {q.date}
                    </span>
                  </div>
                  <h2 className="mt-2 text-sm font-bold text-[#0F294A]">
                    {isEn ? 'Question:' : 'سوال:'} {q.question}
                  </h2>
                  <div
                    className={`mt-3 bg-emerald-50/40 p-3 leading-relaxed text-slate-800 ${
                      isEn ? 'border-l-2 border-emerald-600' : 'border-r-2 border-emerald-600'
                    }`}
                  >
                    <strong className="text-emerald-800">{isEn ? 'Answer:' : 'الجواب:'}</strong>{' '}
                    {q.answer}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit border border-slate-200 bg-white p-5 lg:col-span-5">
              <h2 className="text-base font-extrabold text-[#0F294A]">
                {isEn ? 'Ask a New Sharia Question' : 'نیا شرعی سوال پوچھیں'}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {isEn
                  ? 'Your question goes directly to the Darul Ifta Admin Panel for scholarly review.'
                  : 'آپ کا سوال دارالافتاء کے ایڈمن پینل میں موصول ہو گا اور مفتیانِ کرام جواب جاری فرمائیں گے۔'}
              </p>
              <form onSubmit={handleAskFiqh} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="mb-1 block font-semibold text-slate-800">
                    {isEn ? 'Your Name' : 'آپ کا نام'}
                  </label>
                  <input
                    type="text"
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                    placeholder={isEn ? 'Enter your name' : 'نام درج کریں'}
                    className="h-9 w-full border border-slate-300 px-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'City' : 'شہر'}
                    </label>
                    <input
                      type="text"
                      value={qCity}
                      onChange={(e) => setQCity(e.target.value)}
                      placeholder={isEn ? 'Kasur' : 'قصور'}
                      className="h-9 w-full border border-slate-300 px-3"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Category' : 'شعبہ / موضوع'}
                    </label>
                    <select
                      value={qCat}
                      onChange={(e) => setQCat(e.target.value)}
                      className="h-9 w-full border border-slate-300 px-2"
                    >
                      <option value="نماز و طہارت">
                        {isEn ? 'Salah & Purification' : 'نماز و طہارت'}
                      </option>
                      <option value="زکوٰۃ و صدقات">
                        {isEn ? 'Zakah & Charity' : 'زکوٰۃ و صدقات'}
                      </option>
                      <option value="روزمرہ معاملات">
                        {isEn ? 'Daily Matters' : 'روزمرہ معاملات'}
                      </option>
                      <option value="نکاح و طلاق">
                        {isEn ? 'Nikah & Family' : 'نکاح و طلاق'}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-800">
                    {isEn ? 'Detailed Question *' : 'تفصیلی سوال *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Write your question clearly...'
                        : 'اپنا شرعی مسئلہ واضح الفاظ میں تحریر کریں...'
                    }
                    className="w-full border border-slate-300 p-3"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#0F294A] py-2.5 font-bold text-white hover:bg-[#193B68]"
                >
                  {isEn ? 'Submit Question' : 'سوال ارسال کریں'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ONLINE RESULTS */}
        {activeSection === 'results' && (
          <div className="space-y-6">
            <div className="border border-slate-200 bg-white p-6">
              <h1 className="text-lg font-extrabold text-[#0F294A]">
                {isEn
                  ? 'Online Examination Results — Jamia & Tanzeem-ul-Madaris'
                  : 'آن لائن نتائج جامعہ ہذا و تنظیم المدارس'}
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                {isEn ? (
                  <>
                    Enter Roll Number (e.g.{' '}
                    <span className="font-mono-num font-bold">JB-2026-01</span>) or Student Name to
                    view and print result card.
                  </>
                ) : (
                  <>
                    اپنا رول نمبر (مثلاً <span className="font-mono-num font-bold">JB-2026-01</span>)
                    یا طالبہ کا نام درج کر کے رزلٹ کارڈ دیکھیں۔
                  </>
                )}
              </p>
              <div className="relative mt-4 max-w-md">
                <Search
                  className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
                    isEn ? 'left-3' : 'right-3'
                  }`}
                />
                <input
                  type="text"
                  value={resultQuery}
                  onChange={(e) => setResultQuery(e.target.value)}
                  placeholder={isEn ? 'Search Roll No or Name...' : 'رول نمبر یا نام تلاش کریں...'}
                  className={`h-10 w-full border border-slate-300 bg-slate-50 text-xs focus:border-[#2563EB] focus:bg-white focus:outline-none ${
                    isEn ? 'pr-3 pl-9' : 'pr-9 pl-3'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-2 lg:col-span-5">
                {matchedResults.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResult(res)}
                    className={`w-full cursor-pointer border p-4 text-xs transition-colors ${
                      isEn ? 'text-left' : 'text-right'
                    } ${
                      selectedResult?.id === res.id
                        ? 'border-[#0F294A] bg-[#0F294A] text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{res.studentName}</span>
                      <span className="font-mono-num text-[11px]">{res.rollNo}</span>
                    </div>
                    <p
                      className={`mt-1 text-[11px] ${
                        selectedResult?.id === res.id ? 'text-blue-200' : 'text-slate-500'
                      }`}
                    >
                      {res.darja} · {res.grade} ({res.position})
                    </p>
                  </button>
                ))}
              </div>

              {selectedResult && (
                <div className="border border-slate-300 bg-white p-6 text-xs lg:col-span-7">
                  <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F294A]">
                        {isEn ? 'Markazi Jamia tul Banat Kasur' : siteConfig.name}
                      </h2>
                      <p className="text-slate-600">
                        {selectedResult.examTitle} ({selectedResult.year})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="no-print inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Print Result Card' : 'پرنٹ رزلٹ کارڈ'}</span>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-3 sm:grid-cols-4">
                    <div>
                      <p className="text-slate-500">{isEn ? 'Student Name' : 'نام طالبہ'}</p>
                      <p className="font-bold text-slate-900">{selectedResult.studentName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{isEn ? 'Father Name' : 'ولدیت'}</p>
                      <p className="font-bold text-slate-900">{selectedResult.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{isEn ? 'Roll No' : 'رول نمبر'}</p>
                      <p className="font-mono-num font-bold text-[#0F294A]">
                        {selectedResult.rollNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">{isEn ? 'Class / Darja' : 'درجہ'}</p>
                      <p className="font-bold text-slate-900">{selectedResult.darja}</p>
                    </div>
                  </div>

                  <table className={`mt-4 w-full ${isEn ? 'text-left' : 'text-right'}`}>
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2">{isEn ? 'Subject / Book' : 'مضمون / کتاب'}</th>
                        <th className="px-3 py-2 text-center">
                          {isEn ? 'Total Marks' : 'کل نمبر'}
                        </th>
                        <th className="px-3 py-2 text-center">
                          {isEn ? 'Obtained' : 'حاصل کردہ'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedResult.subjects.map((sub) => (
                        <tr key={sub.name}>
                          <td className="px-3 py-2 font-semibold text-slate-800">{sub.name}</td>
                          <td className="px-3 py-2 text-center font-mono-num text-slate-500">
                            {sub.max}
                          </td>
                          <td className="px-3 py-2 text-center font-mono-num font-bold text-[#0F294A]">
                            {sub.obtained}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-300 pt-3 font-bold text-[#0F294A]">
                    <span>
                      {isEn ? 'Total:' : 'مجموعی نمبر:'}{' '}
                      <span className="font-mono-num">
                        {selectedResult.totalObtained} / {selectedResult.totalMax}
                      </span>
                    </span>
                    <span>
                      {isEn ? 'Grade:' : 'تقدیر:'} {selectedResult.grade}
                    </span>
                    <span className="text-emerald-700">{selectedResult.position}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANNUAL PRIZE DISTRIBUTION PROGRAM */}
        {activeSection === 'program' && (
          <div className="space-y-6">
            <div className="border border-slate-200 bg-white p-6">
              <span className="border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
                {isEn ? 'Annual Ceremony' : 'سالانہ تقریبِ سعید'}
              </span>
              <h1 className="mt-3 text-xl font-extrabold text-[#0F294A]">
                {isEn
                  ? 'Annual Certificate & Sanad Distribution Program'
                  : siteConfig.annualProgramTitle}
              </h1>
              <p className="mt-2 text-xs font-bold text-slate-700">
                {isEn
                  ? 'Date & Time: 25 Rajab-ul-Murajjab / Sunday 9:00 AM | Venue: Markazi Jamia tul Banat, Purana Lari Adda, Kasur'
                  : `تاریخ و وقت: ${siteConfig.annualProgramDate} | بمقام: ${siteConfig.annualProgramVenue}`}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {isEn
                  ? 'Annual awards and certificates will be presented to top-ranking students, Dars-e-Nizami graduates, and Huffaz, alongside keynote speeches by esteemed scholars.'
                  : siteConfig.annualProgramDetails}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  stepUr: 'نشستِ اول (صبح 9:00 بجے)',
                  stepEn: 'Session I (9:00 AM)',
                  titleUr: 'تلاوتِ قرآن، نعتِ رسولِ مقبول ﷺ اور طالبات کے علمی مکالمے',
                  titleEn: 'Quran Recitation, Naat Sharif & Student Academic Presentations',
                },
                {
                  stepUr: 'نشستِ دوم (صبح 10:30 بجے)',
                  stepEn: 'Session II (10:30 AM)',
                  titleUr: 'درسِ بخاری شریف اور اکابر علمائے کرام کے خصوصی بیانات',
                  titleEn: 'Dars-e-Bukhari Sharif & Keynote Addresses by Ulama',
                },
                {
                  stepUr: 'نشستِ اختتام (دوپہر 12:00 بجے)',
                  stepEn: 'Closing Session (12:00 PM)',
                  titleUr: 'تقسیمِ اسناد و انعامات، دستارِ فضیلت اور خصوصی دعا و لنگر',
                  titleEn: 'Certificate & Prize Distribution, Closing Dua & Langar',
                },
              ].map((item) => (
                <div key={item.stepEn} className="border border-slate-200 bg-white p-5 text-xs">
                  <p className="font-bold text-[#2563EB]">{isEn ? item.stepEn : item.stepUr}</p>
                  <p className="mt-2 text-sm font-bold text-[#0F294A]">
                    {isEn ? item.titleEn : item.titleUr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeSection === 'gallery' && (
          <div className="space-y-5">
            <div className="border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-[#0F294A]">
                <Images className="h-5 w-5" />
                <h1 className="text-lg font-extrabold">
                  {isEn ? 'Photo Gallery & Campus Highlights' : 'تصویری گیلری و سالانہ جھلکیاں'}
                </h1>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {isEn
                  ? 'Highlights from Jamia ceremonies, prize distributions, and academic gatherings. Click any photo to enlarge.'
                  : 'جامعہ کی سالانہ تقاریب، تقسیمِ اسناد اور تعلیمی سرگرمیوں کی تصاویر۔ کسی بھی تصویر پر کلک کر کے بڑا دیکھیں۔'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY_PHOTOS.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() =>
                    setLightboxPhoto({
                      src: photo.src,
                      title: isEn ? photo.titleEn : photo.title,
                    })
                  }
                  className={`cursor-pointer overflow-hidden border border-slate-200 bg-white transition-colors hover:border-[#2563EB] ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  <div className="flex h-52 w-full items-center justify-center bg-slate-100">
                    <img
                      src={photo.src}
                      alt={isEn ? photo.titleEn : photo.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="p-3 text-xs font-bold text-slate-800">
                    {isEn ? photo.titleEn : photo.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADMISSIONS & DONATIONS */}
        {activeSection === 'admissions' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="border border-slate-200 bg-white p-6 lg:col-span-7">
              <h1 className="text-lg font-extrabold text-[#0F294A]">
                {isEn ? 'Online Admission Form' : 'آن لائن داخلہ فارم'}
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                {isEn
                  ? 'Submitted admission forms go directly to the Jamia Admin Portal for review.'
                  : 'داخلہ فارم پُر کرنے کے بعد درخواست براہِ راست ناظمِ جامعہ کے ایڈمن پورٹل میں موصول ہو جاتی ہے۔'}
              </p>

              <form onSubmit={handleAdmissionSubmit} className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Student Name *' : 'طالبہ کا نام *'}
                    </label>
                    <input
                      required
                      type="text"
                      value={admName}
                      onChange={(e) => setAdmName(e.target.value)}
                      placeholder={isEn ? 'Full name' : 'طالبہ کا مکمل نام'}
                      className="h-9 w-full border border-slate-300 px-3"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Father / Guardian Name' : 'والد کا نام'}
                    </label>
                    <input
                      type="text"
                      value={admFather}
                      onChange={(e) => setAdmFather(e.target.value)}
                      placeholder={isEn ? 'Father name' : 'ولدیت'}
                      className="h-9 w-full border border-slate-300 px-3"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Course / Darja' : 'مطلوبہ کورس / درجہ'}
                    </label>
                    <select
                      value={admDarja}
                      onChange={(e) => setAdmDarja(e.target.value)}
                      className="h-9 w-full border border-slate-300 px-2"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {isEn ? c.titleEn : c.title}
                        </option>
                      ))}
                      <option value="درجہ اولیٰ (عالمہ)">
                        {isEn ? 'Darja Ula (Alimah Year 1)' : 'درجہ اولیٰ (عالمہ)'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Study Mode' : 'طریقۂ تعلیم'}
                    </label>
                    <select
                      value={admType}
                      onChange={(e) => setAdmType(e.target.value as JamiaAdmission['type'])}
                      className="h-9 w-full border border-slate-300 px-2"
                    >
                      <option value="آن لائن">{isEn ? 'Online' : 'آن لائن'}</option>
                      <option value="غیر رہائشی">
                        {isEn ? 'Day Scholar (On-Campus)' : 'غیر رہائشی (جامعہ حاضری)'}
                      </option>
                      <option value="رہائشی">{isEn ? 'Residential (Hostel)' : 'رہائشی (ہاسٹل)'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'Phone / WhatsApp *' : 'فون / واٹس ایپ نمبر *'}
                    </label>
                    <input
                      required
                      type="text"
                      dir="ltr"
                      value={admPhone}
                      onChange={(e) => setAdmPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="h-9 w-full border border-slate-300 px-3 text-left font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-slate-800">
                      {isEn ? 'City' : 'شہر'}
                    </label>
                    <input
                      type="text"
                      value={admCity}
                      onChange={(e) => setAdmCity(e.target.value)}
                      placeholder={isEn ? 'Kasur' : 'قصور'}
                      className="h-9 w-full border border-slate-300 px-3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-6 py-2.5 font-bold text-white hover:bg-[#193B68]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isEn ? 'Submit Admission Form' : 'داخلہ درخواست جمع کروائیں'}</span>
                </button>
              </form>
            </div>

            <div className="border border-slate-200 bg-white p-6 text-xs lg:col-span-5">
              <h2 className="text-base font-extrabold text-[#0F294A]">
                {isEn
                  ? 'Donations, Zakah & Bank Account'
                  : 'بینک اکاؤنٹ برائے عطیات، زکوٰۃ و صدقات'}
              </h2>
              <div className="mt-4 space-y-3">
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-500">{isEn ? 'Bank' : 'بینک'}</p>
                  <p className="font-bold text-slate-900">{siteConfig.bankName}</p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-500">{isEn ? 'Account Title' : 'اکاؤنٹ ٹائٹل'}</p>
                  <p className="font-bold text-slate-900" dir="ltr">
                    {siteConfig.accountTitle}
                  </p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-500">IBAN</p>
                  <p className="font-mono-num font-bold text-[#0F294A]" dir="ltr">
                    {siteConfig.iban}
                  </p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-500">
                    {isEn ? 'EasyPaisa / JazzCash' : 'ایزی پیسہ / جاز کیش'}
                  </p>
                  <p className="font-bold text-slate-900">{siteConfig.easypaisa}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 text-xs text-slate-600 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-[#0F294A]">
              {isEn
                ? 'Markazi Jamia tul Banat Purana Lari Adda Kasur'
                : siteConfig.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {isEn ? 'Purana Lari Adda, Kasur, Punjab, Pakistan' : siteConfig.address}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="cursor-pointer border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-[#0F294A] hover:bg-slate-100"
            >
              {isEn ? 'Admin Portal Login' : 'ایڈمن پورٹل لاگ ان'}
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <Modal
        open={Boolean(lightboxPhoto)}
        onClose={() => setLightboxPhoto(null)}
        title={lightboxPhoto?.title ?? ''}
        size="lg"
      >
        {lightboxPhoto && (
          <div className="flex items-center justify-center bg-slate-50 p-2">
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title}
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        )}
      </Modal>

      {/* Initial Language Selection Popup Modal (English Prompt) */}
      {langPromptOpen && (
        <div
          dir="ltr"
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Choose website language"
        >
          <div className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0F294A] text-white">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#0F294A]">
                  Select Your Language
                </h2>
                <p className="text-xs text-slate-500">
                  Markazi Jamia tul Banat — Purana Lari Adda Kasur
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Would you like to view this website in <strong>English</strong> or{' '}
              <strong>Urdu (اردو)</strong>?
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className="flex cursor-pointer flex-col items-center justify-center border border-slate-300 bg-white px-4 py-3.5 text-center transition-colors hover:border-[#2563EB] hover:bg-blue-50/50"
              >
                <span className="text-sm font-extrabold text-[#0F294A]">English</span>
                <span className="mt-0.5 text-[11px] text-slate-500">View in English</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectLanguage('ur')}
                className="flex cursor-pointer flex-col items-center justify-center border border-[#0F294A] bg-[#0F294A] px-4 py-3.5 text-center text-white transition-colors hover:bg-[#193B68]"
              >
                <span className="text-sm font-extrabold">اردو (Urdu)</span>
                <span className="mt-0.5 text-[11px] text-blue-200">اردو میں دیکھیں</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
