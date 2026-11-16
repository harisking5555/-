import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  HeartHandshake,
  Smartphone,
  Building2,
  Eye,
  ShieldCheck,
  Users,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import {
  FiqhQuestion,
  GalleryPhoto,
  JamiaAdmission,
  JamiaFeeRecord,
  JamiaResult,
  JamiaSiteConfig,
  LeadershipProfile,
  OnlineCourse,
  PublicSection,
} from '../types/jamia';
import { BANK_CHEQUE_IMAGE, HERO_BANNERS } from '../data/jamiaData';
import { Modal } from './ui/Modal';

export type SiteLang = 'ur' | 'en';

interface PublicWebsiteProps {
  lang: SiteLang;
  langPromptOpen: boolean;
  onSelectLanguage: (lang: SiteLang) => void;
  siteConfig: JamiaSiteConfig;
  courses: OnlineCourse[];
  leadership: LeadershipProfile[];
  gallery: GalleryPhoto[];
  questions: FiqhQuestion[];
  results: JamiaResult[];
  onSubmitQuestion: (q: FiqhQuestion) => void;
  onSubmitAdmission: (adm: JamiaAdmission) => void;
  onSubmitDonation: (record: JamiaFeeRecord) => void;
  onOpenAdminLogin: () => void;
  onNotify: (msg: string) => void;
}

const NAV_ITEMS: { id: PublicSection; ur: string; en: string }[] = [
  { id: 'home', ur: 'صفحہ اول', en: 'Home' },
  { id: 'classes', ur: 'آن لائن کلاسز', en: 'Online Classes' },
  { id: 'darulifta', ur: 'دارالافتاء', en: 'Darul Ifta' },
  { id: 'results', ur: 'آن لائن نتائج', en: 'Results' },
  { id: 'program', ur: 'تقریبِ اسناد', en: 'Program' },
  { id: 'gallery', ur: 'گیلری', en: 'Gallery' },
  { id: 'admissions', ur: 'آن لائن داخلہ', en: 'Admissions' },
  { id: 'donations', ur: 'عطیات و صدقات', en: 'Donations' },
];

const DONATION_PURPOSES = [
  {
    id: 'zakah',
    ur: 'زکوٰۃ فنڈ',
    en: 'Zakah Fund',
    descUr: 'مستحق طالباتِ علمِ دین کی شرعی کفالت و تعلیمی اخراجات',
    descEn: 'Sharia-compliant support for deserving female scholars',
  },
  {
    id: 'sadaqat',
    ur: 'صدقات و خیرات',
    en: 'Sadaqat & Khairat',
    descUr: 'جامعہ کے عمومی فلاحی و تعلیمی اخراجات میں تعاون',
    descEn: 'General charity supporting daily Jamia operations',
  },
  {
    id: 'sponsorship',
    ur: 'طالبات کفالت فنڈ',
    en: 'Student Sponsorship',
    descUr: 'رہائشی و مستحق طالبات کے ماہانہ تعلیمی وظائف و کتب',
    descEn: 'Sponsor monthly tuition, books & hostel care',
  },
  {
    id: 'building',
    ur: 'تعمیرِ جامعہ فنڈ',
    en: 'Building & Campus Fund',
    descUr: 'مسجد، کلاس رومز اور ہاسٹل کی توسیع و تعمیر',
    descEn: 'Expansion of classrooms, Masjid & residential wing',
  },
  {
    id: 'langar',
    ur: 'لنگرِ جامعہ',
    en: 'Langar / Student Meals',
    descUr: 'طالبات و مہمانانِ جامعہ کے لیے روزانہ طعام کا انتظام',
    descEn: 'Daily meals for residential students & guests',
  },
  {
    id: 'fitrana',
    ur: 'فطرانہ / کفارہ',
    en: 'Fitrana / Kaffarah',
    descUr: 'رمضان المبارک اور واجب صدقات کی مستحقین تک ترسیل',
    descEn: 'Distribution of Fitrana and Kaffarah to eligible students',
  },
];

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000];

export function PublicWebsite({
  lang,
  langPromptOpen,
  onSelectLanguage,
  siteConfig,
  courses,
  leadership,
  gallery,
  questions,
  results,
  onSubmitQuestion,
  onSubmitAdmission,
  onSubmitDonation,
  onOpenAdminLogin,
  onNotify,
}: PublicWebsiteProps) {
  const isEn = lang === 'en';
  const [activeSection, setActiveSection] = useState<PublicSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; title: string } | null>(null);
  const [chequeModalOpen, setChequeModalOpen] = useState(false);

  // Darul Ifta search & form
  const [fiqhSearch, setFiqhSearch] = useState('');
  const [qName, setQName] = useState('');
  const [qCity, setQCity] = useState('');
  const [qCat, setQCat] = useState('Salah & Purification');
  const [qText, setQText] = useState('');

  // Results search
  const [resultQuery, setResultQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<JamiaResult | null>(results[0] ?? null);

  // Admission form
  const [admName, setAdmName] = useState('');
  const [admFather, setAdmFather] = useState('');
  const [admDarja, setAdmDarja] = useState('Dars-e-Nizami (Alimah)');
  const [admPhone, setAdmPhone] = useState('');
  const [admCity, setAdmCity] = useState('');
  const [admType, setAdmType] = useState<JamiaAdmission['type']>('Online');

  // Donations interactive form
  const [donPurpose, setDonPurpose] = useState(DONATION_PURPOSES[0].id);
  const [donAmount, setDonAmount] = useState<number>(5000);
  const [donMethod, setDonMethod] = useState<JamiaFeeRecord['paymentMethod']>('MCB Bank');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorRef, setDonorRef] = useState('');
  const [donationReceipt, setDonationReceipt] = useState<JamiaFeeRecord | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedResult((prev) => {
      if (!results.length) return null;
      if (prev && results.some((r) => r.id === prev.id)) {
        return results.find((r) => r.id === prev.id) ?? results[0];
      }
      return results[0];
    });
  }, [results]);

  const sortedLeadership = [...leadership].sort((a, b) => a.order - b.order);
  const currentBanner = HERO_BANNERS[slideIdx];
  const currentBannerLeader =
    sortedLeadership.find((l) => l.id === currentBanner.leaderId) ?? sortedLeadership[slideIdx];
  const currentBannerImage = currentBannerLeader?.image || currentBanner.image;
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
      id: `FQ-${Date.now()}`,
      questioner: qName.trim() || (isEn ? 'Questioner' : 'سائل'),
      city: qCity.trim() || (isEn ? 'Kasur' : 'قصور'),
      category: qCat,
      question: qText.trim(),
      answer: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
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
      id: `ADM-${Date.now()}`,
      studentName: admName.trim(),
      fatherName: admFather.trim() || '—',
      darja: admDarja,
      phone: admPhone.trim(),
      city: admCity.trim() || (isEn ? 'Kasur' : 'قصور'),
      appliedDate: new Date().toISOString().slice(0, 10),
      type: admType,
      status: 'Pending',
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

  const handleDonationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim() || !donAmount || donAmount <= 0) return;

    const selectedPurposeObj =
      DONATION_PURPOSES.find((p) => p.id === donPurpose) ?? DONATION_PURPOSES[0];
    const receiptNo = `DON-${1050 + Math.floor(Math.random() * 8900)}`;

    const record: JamiaFeeRecord = {
      id: `F-${Date.now()}`,
      receiptNo,
      studentName: `${donorName.trim()} (${donorPhone.trim()})`,
      darja: selectedPurposeObj.en + (donorRef.trim() ? ` · Ref: ${donorRef.trim()}` : ''),
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      amount: Number(donAmount),
      category: 'Donation / Sadaqat',
      paymentMethod: donMethod,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    onSubmitDonation(record);
    setDonationReceipt(record);
    onNotify(
      isEn
        ? `Thank you ${donorName.trim()}! Donation confirmation (${receiptNo}) recorded.`
        : `جزاک اللہ خیراً ${donorName.trim()}! آپ کا عطیہ رسید نمبر ${receiptNo} کے ساتھ محفوظ ہو گیا۔`
    );
  };

  const answeredQuestions = questions.filter(
    (q) =>
      q.status === 'Published' &&
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

  const activePurposeObj =
    DONATION_PURPOSES.find((p) => p.id === donPurpose) ?? DONATION_PURPOSES[0];

  return (
    <div dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* 1. Scrolling Marquee Top Bar (All Screen Sizes) */}
      <div className="no-print marquee-wrapper overflow-hidden border-b border-blue-900 bg-[#0A1E38] py-1.5 text-xs font-semibold text-blue-100">
        <div className={isEn ? 'marquee-track-ltr' : 'marquee-track-rtl'}>
          <span className="px-8">{marqueeText}</span>
          <span className="px-8 text-blue-300">✦</span>
          <span className="px-8">{marqueeText}</span>
          <span className="px-8 text-blue-300">✦</span>
        </div>
      </div>

      {/* 2. Desktop Utility Bar Only (Hidden on mobile; items live inside mobile 3-line menu) */}
      <div className="no-print hidden border-b border-slate-200 bg-[#0F294A] text-white lg:block">
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
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Page"
              title="Facebook Page"
              className="flex h-7 w-7 items-center justify-center border border-white/20 bg-white/10 text-white transition-colors hover:bg-[#1877F2]"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.46 1.5-1.46h1.6V5a21.5 21.5 0 0 0-2.34-.12c-2.32 0-3.9 1.42-3.9 4.02V11H7.7v3h2.66v8h3.14Z" />
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
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
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main Menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`cursor-pointer whitespace-nowrap px-2.5 py-2 text-xs font-bold transition-colors ${
                  activeSection === item.id
                    ? item.id === 'donations'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#0F294A] text-white'
                    : item.id === 'donations'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F294A]'
                }`}
              >
                {isEn ? item.en : item.ur}
              </button>
            ))}
          </nav>

          {/* Mobile 3-line Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label={isEn ? 'Open menu' : 'مینو کھولیں'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Drawer Nav (Contains All Nav + Contact, Language Switch, Socials & Admin Login) */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
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

            {/* Mobile Utility & Contact Controls inside 3-line drawer */}
            <div className="mt-4 space-y-3 border-t border-slate-200 pt-3 text-xs">
              <div className="flex flex-col gap-2 text-slate-700">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-2 font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span className="font-mono-num" dir="ltr">
                    {siteConfig.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 font-semibold"
                >
                  <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span className="font-mono-num" dir="ltr">
                    {siteConfig.email}
                  </span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLanguage(isEn ? 'ur' : 'en');
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#0F294A]"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>{isEn ? 'اردو' : 'English'}</span>
                  </button>

                  <a
                    href={siteConfig.whatsappChannel}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp Channel"
                    className="flex h-8 w-8 items-center justify-center border border-slate-300 bg-emerald-50 text-emerald-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M12.03 2a9.97 9.97 0 0 0-8.52 15.17L2 22l4.98-1.46A9.98 9.98 0 1 0 12.03 2Zm5.8 14.12c-.24.68-1.4 1.3-1.95 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.32-1.72-.63-3.03-1.31-5-4.38-5.15-4.58-.15-.2-1.23-1.63-1.23-3.11 0-1.48.77-2.2 1.05-2.5.28-.3.6-.38.8-.38h.58c.18 0 .44-.07.68.52.25.6.85 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.3.32-.13.62.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.08.13.08.73-.17 1.41Z" />
                    </svg>
                  </a>

                  <a
                    href={siteConfig.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook Page"
                    className="flex h-8 w-8 items-center justify-center border border-slate-300 bg-blue-50 text-[#1877F2]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.46 1.5-1.46h1.6V5a21.5 21.5 0 0 0-2.34-.12c-2.32 0-3.9 1.42-3.9 4.02V11H7.7v3h2.66v8h3.14Z" />
                    </svg>
                  </a>

                  <a
                    href={siteConfig.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    className="flex h-8 w-8 items-center justify-center border border-slate-300 bg-slate-100 text-slate-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.04.86.13V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.73a8.18 8.18 0 0 0 4.78 1.53V6.82a4.83 4.83 0 0 1-.87-.13Z" />
                    </svg>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 bg-[#0F294A] px-3 py-1.5 text-xs font-bold text-white"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Admin Login' : 'ایڈمن لاگ ان'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* HOME PAGE */}
        {activeSection === 'home' && (
          <div className="space-y-10">
            {/* Animated Banner Slider Featuring the 3 Ulama Portraits */}
            <section className="relative overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentBanner.id}-${lang}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <span className="inline-block border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
                        {isEn ? currentBanner.tagEn : currentBanner.tag}
                      </span>
                      <h1 className="mt-4 text-2xl font-bold text-[#0F294A] sm:text-[28px]">
                        {isEn ? currentBanner.titleEn : currentBanner.title}
                      </h1>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        {isEn ? currentBanner.descriptionEn : currentBanner.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleNav(currentBanner.targetSection)}
                        className="cursor-pointer bg-[#0F294A] px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#193B68] hover:shadow-sm"
                      >
                        {isEn ? currentBanner.actionLabelEn : currentBanner.actionLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNav('donations')}
                        className="cursor-pointer border border-emerald-700 bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-sm"
                      >
                        {isEn ? 'Donate / Zakah' : 'عطیات و زکوٰۃ'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSlideIdx(
                            (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
                          )
                        }
                        aria-label={isEn ? 'Previous banner' : 'پچھلا بینر'}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0F294A] hover:bg-slate-50"
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
                            className={`h-2 cursor-pointer transition-all duration-300 ${
                              slideIdx === i ? 'w-7 bg-[#0F294A]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_BANNERS.length)}
                        aria-label={isEn ? 'Next banner' : 'اگلا بینر'}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0F294A] hover:bg-slate-50"
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

                {/* Full Uncropped Maulana Portrait Stage */}
                <div className="relative flex min-h-[300px] flex-col justify-between border-t border-slate-200 bg-gradient-to-br from-slate-100 via-white to-blue-50/60 p-4 lg:col-span-6 lg:min-h-[390px] lg:border-t-0 lg:border-s">
                  <div className="flex flex-1 items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${currentBanner.id}-${currentBannerImage}`}
                        src={currentBannerImage}
                        alt={
                          currentBannerLeader
                            ? isEn
                              ? currentBannerLeader.nameEn
                              : currentBannerLeader.name
                            : isEn
                              ? currentBanner.titleEn
                              : currentBanner.title
                        }
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="max-h-[310px] w-auto max-w-full border border-slate-200 bg-white p-1.5 object-contain shadow-sm"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Dignified Caption & 3-Portrait Quick Switcher */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2.5 text-xs">
                    <div className="min-w-0 flex-1">
                      {currentBannerLeader && (
                        <>
                          <span className="inline-block border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0F294A]">
                            {isEn ? currentBannerLeader.badgeEn : currentBannerLeader.badge}
                          </span>
                          <p className="mt-1 truncate font-bold text-[#0F294A]">
                            {isEn ? currentBannerLeader.nameEn : currentBannerLeader.name}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {sortedLeadership.map((leader, idx) => (
                        <button
                          key={leader.id}
                          type="button"
                          onClick={() => setSlideIdx(idx)}
                          title={isEn ? leader.badgeEn : leader.badge}
                          className={`h-10 w-10 cursor-pointer overflow-hidden border bg-white p-0.5 transition-all ${
                            slideIdx === idx
                              ? 'border-[#2563EB] ring-1 ring-[#2563EB]'
                              : 'border-slate-300 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={leader.image}
                            alt={isEn ? leader.badgeEn : leader.badge}
                            className="h-full w-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Slide Progress Strip */}
              <div className="h-0.5 w-full bg-slate-100">
                <div
                  key={`prog-${slideIdx}`}
                  className="animate-banner-progress h-full bg-[#2563EB]"
                />
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
                  id: 'donations' as PublicSection,
                  ur: 'عطیات و صدقات پورٹل',
                  en: 'Donations & Zakah Portal',
                  descUr: 'MCB بینک چیک، ایزی پیسہ و آن لائن رسید',
                  descEn: 'MCB Bank Cheque, EasyPaisa & Instant Receipt',
                  icon: HeartHandshake,
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => handleNav(card.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className={`group cursor-pointer border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-md ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-[#0F294A] transition-colors group-hover:border-[#2563EB] group-hover:bg-[#0F294A] group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="mt-3 text-sm font-bold text-[#0F294A]">
                      {isEn ? card.en : card.ur}
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      {isEn ? card.descEn : card.descUr}
                    </p>
                  </motion.button>
                );
              })}
            </section>

            {/* NEW HOME SECTION 1: Academic Departments & Programs Overview */}
            <section className="space-y-4">
              <div
                className={
                  isEn
                    ? 'border-l-4 border-[#2563EB] pl-3'
                    : 'border-r-4 border-[#2563EB] pr-3'
                }
              >
                <h2 className="text-lg font-extrabold text-[#0F294A]">
                  {isEn ? 'Academic Departments & Curriculum' : 'تعلیمی شعبہ جات و نصابِ تعلیم'}
                </h2>
                <p className="text-xs text-slate-600">
                  {isEn
                    ? 'Structured Islamic education affiliated with Tanzeem-ul-Madaris Ahl-e-Sunnat Pakistan'
                    : 'تنظیم المدارس اہلِ سنت پاکستان سے ملحق مستند دینی و روحانی تعلیمی پروگرامز'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {courses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between border border-slate-200 bg-white p-5"
                  >
                    <div>
                      <span className="inline-block border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono-num text-[11px] font-bold text-[#2563EB]">
                        {isEn ? `Program 0${idx + 1}` : `شعبہ 0${idx + 1}`}
                      </span>
                      <h3 className="mt-3 text-sm font-extrabold text-[#0F294A]">
                        {isEn ? course.titleEn : course.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {isEn ? course.descriptionEn : course.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
                      <span className="font-semibold text-slate-500">
                        {isEn ? course.durationEn : course.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNav('classes')}
                        className="cursor-pointer font-bold text-[#2563EB] hover:underline"
                      >
                        {isEn ? 'Details →' : 'تفصیل ←'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                {sortedLeadership.map((leader, idx) => (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="flex flex-col border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/60 hover:shadow-md"
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
                  </motion.div>
                ))}
              </div>
            </section>

            {/* NEW HOME SECTION 2: Campus Highlights & Key Pillars */}
            <section className="border border-slate-200 bg-white p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#0F294A]">
                    {isEn
                      ? 'Why Markazi Jamia tul Banat?'
                      : 'جامعہ کی نمایاں تعلیمی و تربیتی خصوصیات'}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {isEn
                      ? 'Dedicated to spiritual discipline, academic rigor, and community welfare'
                      : 'باعمل عالمات کی تیاری، باپردہ ماحول اور مستحق طالبات کی مکمل کفالت'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('admissions')}
                  className="cursor-pointer bg-[#0F294A] px-4 py-2 text-xs font-bold text-white hover:bg-[#193B68]"
                >
                  {isEn ? 'Apply for Admission' : 'آن لائن داخلہ فارم'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: ShieldCheck,
                    ur: 'مکمل باپردہ ماحول و ہاسٹل',
                    en: 'Purdah Campus & Hostel',
                    descUr: 'رہائشی و غیر رہائشی طالبات کے لیے محفوظ، باپردہ اور روحانی ماحول۔',
                    descEn: 'Safe, Purdah-observant residential hostel & on-campus facilities.',
                  },
                  {
                    icon: Award,
                    ur: 'تنظیم المدارس سے الحاق',
                    en: 'Tanzeem-ul-Madaris Affiliated',
                    descUr: 'مستند وفاق المدارس امتحانات اور سرکاری سطح پر تسلیم شدہ اسناد۔',
                    descEn: 'Recognized annual board examinations and accredited Alimah degrees.',
                  },
                  {
                    icon: Users,
                    ur: 'تجربہ کار فاضلات معلمات',
                    en: 'Qualified Female Scholars',
                    descUr: 'مفتیانِ کرام کی نگرانی میں مستند عالمات و قاریات سے تدریس۔',
                    descEn: 'Instruction by experienced Alimahs & Qariahs under Mufti supervision.',
                  },
                  {
                    icon: Sparkles,
                    ur: 'مستحق طالبات کی مفت کفالت',
                    en: 'Free Support for Needy',
                    descUr: 'یتیم و مستحق طالبات کے لیے فیس، کتب اور لنگر کی مفت سہولت۔',
                    descEn: 'Fee waivers, free books, and daily Langar meals for deserving students.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.en}
                      className="border border-slate-200 bg-slate-50/70 p-4 text-xs"
                    >
                      <Icon className="h-5 w-5 text-[#2563EB]" />
                      <h3 className="mt-2.5 font-bold text-[#0F294A]">
                        {isEn ? item.en : item.ur}
                      </h3>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {isEn ? item.descEn : item.descUr}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Donations / Bank Account & Annual Program Strip */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="border border-slate-200 bg-white p-6 lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#0F294A]">
                    <Landmark className="h-5 w-5" />
                    <h2 className="text-base font-extrabold">
                      {isEn
                        ? 'MCB Bank Account & EasyPaisa / JazzCash'
                        : 'ایم سی بی بینک اکاؤنٹ و ایزی پیسہ برائے عطیات'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNav('donations')}
                    className="cursor-pointer bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                  >
                    {isEn ? 'Open Donations Page →' : 'عطیات پورٹل کھولیں ←'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {isEn
                    ? 'Support religious education, student meals (Langar), and Jamia development through Zakah, Sadaqat, and donations.'
                    : 'طالباتِ علمِ دین کی کفالت، لنگر اور تعمیراتی خدمات میں زکوٰۃ، صدقاتِ واجبہ و نافلہ اور عطیات کے ذریعے تعاون فرمائیں۔'}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <p className="text-slate-500">{isEn ? 'Bank & Branch' : 'بینک و برانچ'}</p>
                    <p className="mt-1 font-bold text-slate-900">{siteConfig.bankName}</p>
                    <p className="text-[11px] text-slate-600">{siteConfig.branchName}</p>
                  </div>
                  <div className="border border-slate-200 bg-slate-50 p-3">
                    <p className="text-slate-500">{isEn ? 'Account Title' : 'اکاؤنٹ ٹائٹل'}</p>
                    <p className="mt-1 font-bold text-slate-900" dir="ltr">
                      {siteConfig.accountTitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
                    <div className="min-w-0">
                      <p className="text-slate-500">{isEn ? 'Account No / IBAN' : 'اکاؤنٹ نمبر'}</p>
                      <p className="mt-1 font-mono-num font-bold text-[#0F294A]" dir="ltr">
                        {siteConfig.accountNumber}
                      </p>
                      <p className="truncate font-mono-num text-[11px] text-slate-600" dir="ltr">
                        {siteConfig.iban}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(siteConfig.iban, 'IBAN نمبر', 'IBAN')}
                      className="shrink-0 cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100"
                      title={isEn ? 'Copy IBAN' : 'کاپی کریں'}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-slate-500">
                        {isEn ? 'EasyPaisa / JazzCash' : 'ایزی پیسہ / جاز کیش'}
                      </p>
                      <p className="mt-1 font-bold text-[#0F294A]">
                        {siteConfig.walletOwnerName}
                      </p>
                      <p className="font-mono-num text-xs font-bold text-emerald-700" dir="ltr">
                        {siteConfig.walletNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(siteConfig.walletNumber, 'ایزی پیسہ نمبر', 'Wallet Number')
                      }
                      className="shrink-0 cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100"
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
                      setAdmDarja(c.titleEn);
                      setAdmType('Online');
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
                      <option value="Salah & Purification">
                        {isEn ? 'Salah & Purification' : 'نماز و طہارت'}
                      </option>
                      <option value="Zakah & Charity">
                        {isEn ? 'Zakah & Charity' : 'زکوٰۃ و صدقات'}
                      </option>
                      <option value="Daily Transactions">
                        {isEn ? 'Daily Matters' : 'روزمرہ معاملات'}
                      </option>
                      <option value="Nikah & Family">
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
                          <td className="px-3 py-2 font-semibold text-slate-800">
                            {isEn ? sub.name : sub.nameUr || sub.name}
                          </td>
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
              {gallery.map((photo) => (
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

        {/* ADMISSIONS */}
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
                        <option key={c.id} value={c.titleEn}>
                          {isEn ? c.titleEn : c.title}
                        </option>
                      ))}
                      <option value="Darja Ula (Alimah Year 1)">
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
                      <option value="Online">{isEn ? 'Online' : 'آن لائن'}</option>
                      <option value="Day Scholar">
                        {isEn ? 'Day Scholar (On-Campus)' : 'غیر رہائشی (جامعہ حاضری)'}
                      </option>
                      <option value="Residential">
                        {isEn ? 'Residential (Hostel)' : 'رہائشی (ہاسٹل)'}
                      </option>
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
                  ? 'MCB Bank & Wallet Account Details'
                  : 'بینک اکاؤنٹ برائے فیس و عطیات'}
              </h2>
              <div className="mt-4 space-y-3">
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-slate-500">{isEn ? 'Bank & Branch' : 'بینک و برانچ'}</p>
                  <p className="font-bold text-slate-900">{siteConfig.bankName}</p>
                  <p className="text-[11px] text-slate-600">{siteConfig.branchName}</p>
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
                  <p className="font-bold text-slate-900">
                    {siteConfig.walletOwnerName} ·{' '}
                    <span className="font-mono-num text-[#0F294A]" dir="ltr">
                      {siteConfig.walletNumber}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('donations')}
                  className="w-full cursor-pointer bg-emerald-700 py-2.5 font-bold text-white hover:bg-emerald-800"
                >
                  {isEn ? 'Open Full Donations & Cheque Portal' : 'مکمل عطیات پورٹل و بینک چیک دیکھیں'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED PROFESSIONAL DONATIONS PAGE */}
        {activeSection === 'donations' && (
          <div className="space-y-6">
            {/* Hero Header */}
            <div className="border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    <span>
                      {isEn ? 'Zakah · Sadaqat · Student Welfare' : 'زکوٰۃ · صدقات · کفالتِ طالبات'}
                    </span>
                  </span>
                  <h1 className="mt-3 text-xl font-extrabold text-[#0F294A]">
                    {isEn
                      ? 'Support Markazi Jamia tul Banat — Online Donations & Zakah'
                      : 'مرکزی جامعۃ البنات میں تعاون — عطیات، زکوٰۃ و صدقات پورٹل'}
                  </h1>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                    {isEn
                      ? 'Select your donation fund, amount, and preferred payment channel (MCB Bank Limited, EasyPaisa, JazzCash, or Cash Office) and download an instant official confirmation receipt.'
                      : 'اپنی پسند کی مد (زکوٰۃ، صدقات، کفالتِ طالبات، تعمیر یا لنگر)، رقم اور ادائیگی کا طریقہ (MCB بینک، ایزی پیسہ، جاز کیش) منتخب کریں اور فوری تصدیقی رسید حاصل کریں۔'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setChequeModalOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-2 border border-[#0F294A] bg-[#0F294A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#193B68]"
                >
                  <Eye className="h-4 w-4" />
                  <span>{isEn ? 'View Official MCB Cheque' : 'جامعہ کا اصل بینک چیک دیکھیں'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Donation Flow Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left / Main Builder */}
              <div className="space-y-5 lg:col-span-7">
                {/* Step 1: Purpose */}
                <div className="border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-extrabold text-[#0F294A]">
                    {isEn ? '1. Select Donation Purpose' : '1۔ عطیہ کی مد منتخب کریں'}
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {DONATION_PURPOSES.map((purpose) => {
                      const active = donPurpose === purpose.id;
                      return (
                        <button
                          key={purpose.id}
                          type="button"
                          onClick={() => setDonPurpose(purpose.id)}
                          className={`cursor-pointer border p-3 text-xs transition-colors ${
                            isEn ? 'text-left' : 'text-right'
                          } ${
                            active
                              ? 'border-[#0F294A] bg-blue-50/70 ring-1 ring-[#0F294A]'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <p className="font-bold text-[#0F294A]">
                            {isEn ? purpose.en : purpose.ur}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {isEn ? purpose.descEn : purpose.descUr}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Amount */}
                <div className="border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-extrabold text-[#0F294A]">
                    {isEn ? '2. Choose Amount (PKR)' : '2۔ رقم منتخب یا درج کریں (PKR)'}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonAmount(amt)}
                        className={`cursor-pointer border px-4 py-2 font-mono-num text-xs font-bold transition-colors ${
                          donAmount === amt
                            ? 'border-[#0F294A] bg-[#0F294A] text-white'
                            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        Rs. {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      {isEn ? 'Or Enter Custom Amount (PKR)' : 'یا اپنی مرضی کی رقم درج کریں (PKR)'}
                    </label>
                    <input
                      type="number"
                      min={100}
                      dir="ltr"
                      value={donAmount || ''}
                      onChange={(e) => setDonAmount(Number(e.target.value))}
                      className="h-10 w-full max-w-xs border border-slate-300 px-3 text-left font-mono-num text-sm font-bold text-[#0F294A]"
                    />
                  </div>
                </div>

                {/* Step 3: Payment Channel Selector */}
                <div className="border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-extrabold text-[#0F294A]">
                    {isEn ? '3. Select Payment Channel' : '3۔ ادائیگی کا طریقہ منتخب کریں'}
                  </h2>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(
                      [
                        { id: 'MCB Bank', labelEn: 'MCB Bank', labelUr: 'MCB بینک', icon: Landmark },
                        {
                          id: 'EasyPaisa',
                          labelEn: 'EasyPaisa',
                          labelUr: 'ایزی پیسہ',
                          icon: Smartphone,
                        },
                        {
                          id: 'JazzCash',
                          labelEn: 'JazzCash',
                          labelUr: 'جاز کیش',
                          icon: Smartphone,
                        },
                        {
                          id: 'Cash Office',
                          labelEn: 'Jamia Office',
                          labelUr: 'دفترِ جامعہ',
                          icon: Building2,
                        },
                      ] as const
                    ).map((m) => {
                      const Icon = m.icon;
                      const active = donMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDonMethod(m.id)}
                          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 border px-2 py-3 text-xs font-bold transition-colors ${
                            active
                              ? 'border-[#2563EB] bg-[#0F294A] text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{isEn ? m.labelEn : m.labelUr}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Channel Transfer Details */}
                  {donMethod === 'MCB Bank' && (
                    <div className="mt-4 space-y-2.5 border border-blue-200 bg-blue-50/40 p-4 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
                        <span className="font-extrabold text-[#0F294A]">
                          {siteConfig.bankName} — {siteConfig.branchName}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChequeModalOpen(true)}
                          className="cursor-pointer font-bold text-[#2563EB] underline"
                        >
                          {isEn ? 'Verify Cheque Photo' : 'چیک کی تصویر دیکھیں'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 bg-white p-2.5 border border-slate-200">
                        <div>
                          <p className="text-[11px] text-slate-500">
                            {isEn ? 'Account Title' : 'اکاؤنٹ ٹائٹل'}
                          </p>
                          <p className="font-bold text-slate-900" dir="ltr">
                            {siteConfig.accountTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(siteConfig.accountTitle, 'اکاؤنٹ ٹائٹل', 'Account Title')
                          }
                          className="cursor-pointer border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <Copy className="inline h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="flex items-center justify-between border border-slate-200 bg-white p-2.5">
                          <div>
                            <p className="text-[11px] text-slate-500">
                              {isEn ? 'Account Number' : 'اکاؤنٹ نمبر'}
                            </p>
                            <p className="font-mono-num font-bold text-[#0F294A]" dir="ltr">
                              {siteConfig.accountNumber}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(siteConfig.accountNumber, 'اکاؤنٹ نمبر', 'Account Number')
                            }
                            className="cursor-pointer border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between border border-slate-200 bg-white p-2.5">
                          <div className="min-w-0">
                            <p className="text-[11px] text-slate-500">IBAN</p>
                            <p className="truncate font-mono-num font-bold text-[#0F294A]" dir="ltr">
                              {siteConfig.iban}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(siteConfig.iban, 'IBAN نمبر', 'IBAN')}
                            className="shrink-0 cursor-pointer border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(donMethod === 'EasyPaisa' || donMethod === 'JazzCash') && (
                    <div className="mt-4 space-y-2.5 border border-emerald-200 bg-emerald-50/50 p-4 text-xs">
                      <p className="font-extrabold text-emerald-900">
                        {donMethod} {isEn ? 'Mobile Wallet Transfer' : 'موبائل اکاؤنٹ تفصیلات'}
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="border border-emerald-200 bg-white p-2.5">
                          <p className="text-[11px] text-slate-500">
                            {isEn ? 'Account Holder Name' : 'اکاؤنٹ ہولڈر کا نام'}
                          </p>
                          <p className="mt-0.5 font-bold text-[#0F294A]">
                            {siteConfig.walletOwnerName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border border-emerald-200 bg-white p-2.5">
                          <div>
                            <p className="text-[11px] text-slate-500">
                              {isEn ? 'Account Number' : 'موبائل نمبر'}
                            </p>
                            <p className="mt-0.5 font-mono-num font-bold text-emerald-700" dir="ltr">
                              {siteConfig.walletNumber}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(siteConfig.walletNumber, 'موبائل اکاؤنٹ نمبر', 'Mobile Number')
                            }
                            className="cursor-pointer border border-slate-300 px-2.5 py-1 text-slate-700 hover:bg-slate-50"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {isEn
                          ? 'After transferring via EasyPaisa / JazzCash App, enter your name and transaction ID on the right to generate an official receipt.'
                          : 'رقم ارسال کرنے کے بعد دائیں طرف فارم میں اپنا نام اور ٹرانزیکشن آئی ڈی درج کر کے فوری رسید حاصل کریں۔'}
                      </p>
                    </div>
                  )}

                  {donMethod === 'Cash Office' && (
                    <div className="mt-4 space-y-2 border border-slate-200 bg-slate-50 p-4 text-xs">
                      <p className="font-extrabold text-[#0F294A]">
                        {isEn
                          ? 'Direct Cash Submission at Jamia Office'
                          : 'دفترِ جامعہ میں براہِ راست نقد عطیہ جمع کروائیں'}
                      </p>
                      <p className="text-slate-700">
                        {isEn
                          ? 'Location: Markazi Jamia tul Banat, Purana Lari Adda, Kasur (Office Hours: 8:00 AM – 4:00 PM Daily)'
                          : `مقام: ${siteConfig.address} (دفتری اوقات: صبح 8:00 تا شام 4:00 بجے)`}
                      </p>
                      <p className="text-slate-600">
                        {isEn ? 'Office Contact:' : 'رابطہ نمبر:'}{' '}
                        <span className="font-mono-num font-bold" dir="ltr">
                          {siteConfig.phone}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Confirmation Form OR Official Receipt */}
              <div className="lg:col-span-5">
                {donationReceipt ? (
                  <div className="border-2 border-emerald-600 bg-white p-6 text-xs">
                    <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <FileCheck2 className="h-6 w-6" />
                        <div>
                          <h2 className="text-sm font-extrabold text-[#0F294A]">
                            {isEn ? 'Official Donation Receipt' : 'مصدقہ عطیہ رسید'}
                          </h2>
                          <p className="font-mono-num text-[11px] text-slate-500">
                            {donationReceipt.receiptNo}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="no-print inline-flex cursor-pointer items-center gap-1 border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-50"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>{isEn ? 'Print' : 'پرنٹ'}</span>
                      </button>
                    </div>

                    <div className="mt-4 space-y-2.5 bg-slate-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isEn ? 'Donor' : 'نام مع فون'}</span>
                        <span className="font-bold text-slate-900">
                          {donationReceipt.studentName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isEn ? 'Purpose' : 'مد'}</span>
                        <span className="font-bold text-slate-900">{donationReceipt.darja}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isEn ? 'Method' : 'طریقۂ ادائیگی'}</span>
                        <span className="font-bold text-[#2563EB]">
                          {donationReceipt.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isEn ? 'Date' : 'تاریخ'}</span>
                        <span className="font-mono-num font-bold">{donationReceipt.date}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                        <span className="font-bold text-[#0F294A]">
                          {isEn ? 'Total Amount' : 'کل رقم'}
                        </span>
                        <span className="font-mono-num font-extrabold text-emerald-700">
                          Rs. {donationReceipt.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
                      {isEn
                        ? 'Your donation entry has been synced with the Jamia Accounts Department. JazakAllah Khair for supporting Islamic education.'
                        : 'آپ کی عطیہ تفصیلات جامعہ کے اکاؤنٹس شعبہ میں محفوظ کر لی گئی ہیں۔ اللہ تعالیٰ آپ کے تعاون کو قبول فرمائے۔'}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setDonationReceipt(null);
                        setDonorName('');
                        setDonorPhone('');
                        setDonorRef('');
                      }}
                      className="no-print mt-4 w-full cursor-pointer bg-[#0F294A] py-2.5 font-bold text-white hover:bg-[#193B68]"
                    >
                      {isEn ? 'Submit Another Donation' : 'مزید عطیہ جمع کروائیں'}
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-200 bg-white p-6 text-xs">
                    <h2 className="text-base font-extrabold text-[#0F294A]">
                      {isEn
                        ? '4. Confirm & Generate Receipt'
                        : '4۔ عطیہ کی تصدیق و رسید حاصل کریں'}
                    </h2>
                    <div className="mt-3 border border-blue-200 bg-blue-50/50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">
                          {isEn ? 'Selected Fund:' : 'منتخب مد:'}
                        </span>
                        <span className="font-bold text-[#0F294A]">
                          {isEn ? activePurposeObj.en : activePurposeObj.ur}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-slate-600">
                          {isEn ? 'Payment Channel:' : 'طریقہ:'}
                        </span>
                        <span className="font-bold text-[#2563EB]">{donMethod}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between border-t border-blue-200 pt-1.5 text-sm">
                        <span className="font-bold text-[#0F294A]">
                          {isEn ? 'Donation Amount:' : 'کل رقم:'}
                        </span>
                        <span className="font-mono-num font-extrabold text-emerald-700">
                          Rs. {(donAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleDonationSubmit} className="mt-4 space-y-3">
                      <div>
                        <label className="mb-1 block font-semibold text-slate-800">
                          {isEn ? 'Donor Full Name *' : 'عطیہ کنندہ کا نام *'}
                        </label>
                        <input
                          required
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder={isEn ? 'e.g. Haji Muhammad Saleem' : 'مثلاً حاجی محمد سلیم'}
                          className="h-9 w-full border border-slate-300 px-3"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-slate-800">
                          {isEn ? 'Phone / WhatsApp Number *' : 'فون / واٹس ایپ نمبر *'}
                        </label>
                        <input
                          required
                          type="text"
                          dir="ltr"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          placeholder="0300-1234567"
                          className="h-9 w-full border border-slate-300 px-3 text-left font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-slate-800">
                          {isEn
                            ? 'Transaction ID / Reference (Optional)'
                            : 'ٹرانزیکشن آئی ڈی / حوالہ نمبر (اختیاری)'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={donorRef}
                          onChange={(e) => setDonorRef(e.target.value)}
                          placeholder="TID-884120 / IBFT Reference"
                          className="h-9 w-full border border-slate-300 px-3 text-left font-mono-num"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 bg-emerald-700 py-3 font-bold text-white hover:bg-emerald-800"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          {isEn
                            ? 'Confirm Donation & Generate Receipt'
                            : 'عطیہ محفوظ کریں اور رسید حاصل کریں'}
                        </span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Compact, Clean, Feature-Complete Footer */}
      <footer className="no-print mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-600">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-extrabold text-[#0F294A]">
                {isEn
                  ? 'Markazi Jamia tul Banat Purana Lari Adda Kasur'
                  : siteConfig.name}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {isEn ? 'Purana Lari Adda, Kasur, Punjab, Pakistan' : siteConfig.address}
                  </span>
                </span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-[#0F294A]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span className="font-mono-num" dir="ltr">
                    {siteConfig.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-[#0F294A]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span className="font-mono-num" dir="ltr">
                    {siteConfig.email}
                  </span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={siteConfig.whatsappChannel}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-bold text-emerald-800 hover:bg-emerald-100"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 px-3 py-1.5 font-bold text-[#1877F2] hover:bg-blue-100"
              >
                <span>Facebook</span>
              </a>
              <a
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-100"
              >
                <span>TikTok</span>
              </a>
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex cursor-pointer items-center gap-1.5 border border-[#0F294A] bg-[#0F294A] px-3.5 py-1.5 font-bold text-white hover:bg-[#193B68]"
              >
                <Lock className="h-3 w-3" />
                <span>{isEn ? 'Admin Portal Login' : 'ایڈمن پورٹل لاگ ان'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-semibold text-slate-700">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`cursor-pointer hover:text-[#2563EB] ${
                    activeSection === item.id ? 'text-[#2563EB] underline' : ''
                  }`}
                >
                  {isEn ? item.en : item.ur}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              <span className="font-mono-num font-semibold text-slate-600" dir="ltr">
                {siteConfig.websiteDomain}
              </span>{' '}
              ·{' '}
              {isEn
                ? '© 2026 Markazi Jamia tul Banat Kasur.'
                : '© 2026 مرکزی جامعۃ البنات قصور۔'}
            </p>
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

      {/* Official MCB Cheque Verification Modal */}
      <Modal
        open={chequeModalOpen}
        onClose={() => setChequeModalOpen(false)}
        title={
          isEn
            ? 'Official MCB Bank Cheque — Markazi Jamia tul Banat Kasur'
            : 'مرکزی جامعۃ البنات کا مصدقہ MCB بینک چیک'
        }
        size="lg"
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-center border border-slate-200 bg-slate-50 p-2">
            <img
              src={BANK_CHEQUE_IMAGE}
              alt="MCB Bank Limited Cheque - Markazi Jamia tul Banat Lari Adda Kasur"
              className="max-h-[60vh] w-full object-contain"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 bg-slate-50 p-3 sm:grid-cols-3">
            <div>
              <p className="text-slate-500">{isEn ? 'Bank & Branch' : 'بینک و برانچ'}</p>
              <p className="font-bold text-slate-900">{siteConfig.branchName}</p>
            </div>
            <div>
              <p className="text-slate-500">{isEn ? 'Account Number' : 'اکاؤنٹ نمبر'}</p>
              <p className="font-mono-num font-bold text-[#0F294A]" dir="ltr">
                {siteConfig.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-slate-500">IBAN</p>
              <p className="font-mono-num font-bold text-[#0F294A]" dir="ltr">
                {siteConfig.iban}
              </p>
            </div>
          </div>
        </div>
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
