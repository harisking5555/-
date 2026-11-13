import { JAMIA_INFO, PageId } from '../data/jamiaData';
import { SocialIcons } from './SocialIcons';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const jump = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print border-t border-[#DDD6C7] bg-[#F3EFE6] text-[#0A110E]">
      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h2 className="font-display text-xl font-bold text-[#0A543E]">
              {JAMIA_INFO.name}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#1E2923]">
              {JAMIA_INFO.location}
            </p>
            <p className="mt-1 text-xs font-medium text-[#3E4A43]">
              {JAMIA_INFO.affiliation}
            </p>
            <p className="mt-4 font-arabic text-base font-bold text-[#85581F]">
              {JAMIA_INFO.arabicName}
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-display text-sm font-bold text-[#0A110E]">صفحاتِ جامعہ</h3>
            <ul className="mt-3 space-y-2.5 text-sm font-medium text-[#1E2923]">
              <li>
                <button type="button" onClick={() => jump('home')} className="cursor-pointer hover:text-[#0A543E]">
                  سرورق
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('about')} className="cursor-pointer hover:text-[#0A543E]">
                  تعارف و مشائخِ عظام
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('departments')} className="cursor-pointer hover:text-[#0A543E]">
                  شعبہ جات و نصاب
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('gallery')} className="cursor-pointer hover:text-[#0A543E]">
                  تصویری جھلکیاں
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-display text-sm font-bold text-[#0A110E]">آن لائن شعبہ جات</h3>
            <ul className="mt-3 space-y-2.5 text-sm font-medium text-[#1E2923]">
              <li>
                <button type="button" onClick={() => jump('classes')} className="cursor-pointer hover:text-[#0A543E]">
                  آن لائن کلاسز و داخلہ
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('darul-ifta')} className="cursor-pointer hover:text-[#0A543E]">
                  آن لائن فقہی سوال و جواب
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('results')} className="cursor-pointer hover:text-[#0A543E]">
                  آن لائن رزلٹ (تنظیم المدارس)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('ceremony')} className="cursor-pointer hover:text-[#0A543E]">
                  سالانہ تقسیمِ اسناد پروگرام
                </button>
              </li>
              <li>
                <button type="button" onClick={() => jump('donations')} className="cursor-pointer hover:text-[#0A543E]">
                  جامعہ کا بینک اکاؤنٹ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Right-Aligned Phone, Email & Icon-Only Social Links */}
          <div className="text-right">
            <h3 className="font-display text-sm font-bold text-[#0A110E]">رابطہ</h3>
            <div className="mt-3 space-y-2 text-sm font-medium text-[#1E2923]">
              <p className="text-right tabular-nums">
                <a href={`tel:${JAMIA_INFO.phone}`} className="inline-block hover:text-[#0A543E]">
                  <span dir="ltr">{JAMIA_INFO.phoneIntl}</span>
                </a>
              </p>
              <p className="break-all text-right text-xs sm:text-sm">
                <a href={`mailto:${JAMIA_INFO.email}`} className="inline-block hover:text-[#0A543E]">
                  <span dir="ltr">{JAMIA_INFO.email}</span>
                </a>
              </p>
              <div className="pt-2">
                <SocialIcons size="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#D8D0C0] pt-6 text-xs font-medium text-[#3E4A43] sm:flex-row">
          <p>© ۱۴۴۸ھ / ۲۰۲۶ء {JAMIA_INFO.fullName} — جملہ حقوق محفوظ ہیں</p>
          <p className="font-arabic text-sm font-bold text-[#85581F]">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ</p>
        </div>
      </div>
    </footer>
  );
}
