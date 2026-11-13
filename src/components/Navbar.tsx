import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { JAMIA_INFO, PageId } from '../data/jamiaData';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const PRIMARY_LINKS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'سرورق' },
  { id: 'classes', label: 'آن لائن کلاسز' },
  { id: 'darul-ifta', label: 'دارالافتاء' },
  { id: 'results', label: 'امتحانی نتائج' },
  { id: 'ceremony', label: 'تقسیمِ اسناد' },
];

const ALL_PAGES: { id: PageId; label: string }[] = [
  { id: 'home', label: 'سرورق' },
  { id: 'about', label: 'تعارف و مشائخ' },
  { id: 'departments', label: 'شعبہ جاتِ جامعہ' },
  { id: 'classes', label: 'آن لائن کلاسز' },
  { id: 'darul-ifta', label: 'آن لائن دارالافتاء' },
  { id: 'results', label: 'آن لائن امتحانی نتائج' },
  { id: 'ceremony', label: 'سالانہ تقسیمِ اسناد' },
  { id: 'gallery', label: 'تصویری جھلکیاں' },
  { id: 'donations', label: 'بینک اکاؤنٹ و تعاون' },
];

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#DDD6C7] bg-[#FAF8F4]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-3 px-3.5 sm:h-16 sm:gap-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="cursor-pointer whitespace-nowrap shrink-0 text-right font-display text-base font-bold text-[#0A543E] transition-colors hover:text-[#073E2D] sm:text-xl"
        >
          {JAMIA_INFO.name}
        </button>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="مرکزی مینو">
          {PRIMARY_LINKS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`cursor-pointer whitespace-nowrap shrink-0 border-b-2 py-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-[#0A543E] text-[#0A543E]'
                    : 'border-transparent text-[#1E2923] hover:border-[#0A543E]/50 hover:text-[#0A110E]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('donations')}
            className="min-h-[40px] cursor-pointer whitespace-nowrap shrink-0 rounded-sm bg-[#0A543E] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#073E2D] sm:px-4 sm:text-sm"
          >
            تعاون و بینک اکاؤنٹ
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'مینو بند کریں' : 'مینو کھولیں'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A110E] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[#DDD6C7] bg-[#FAF8F4] px-3.5 py-3.5 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {ALL_PAGES.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`min-h-[44px] cursor-pointer rounded-sm border px-3 py-2 text-right text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-[#0A543E] bg-[#0A543E] text-white'
                        : 'border-[#DDD6C7] bg-white text-[#0A110E] hover:border-[#0A543E]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
