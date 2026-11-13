import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { GalleryItem } from '../data/jamiaData';
import { ImageWithFallback } from './ImageWithFallback';

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  if (activeIndex === null || !items[activeIndex]) return null;

  const item = items[activeIndex];
  const prevIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-sm border border-[#DDD6C7] bg-[#FAF8F4] p-4 text-[#0A110E] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#85581F]">{item.category}</p>
            <h4 className="font-display text-base font-bold text-[#0A110E] sm:text-lg">{item.title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بند کریں"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A110E] hover:border-[#0A543E]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-sm bg-[#EFECE4]">
          <img
            src={item.src}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="max-h-[65vh] w-full object-contain"
          />
          <span className="sr-only">{item.caption}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#1E2923]">{item.caption}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onChangeIndex(prevIndex)}
              aria-label="پچھلی تصویر"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A110E] hover:border-[#0A543E]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold tabular-nums text-[#3E4A43]">
              {activeIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => onChangeIndex(nextIndex)}
              aria-label="اگلی تصویر"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A110E] hover:border-[#0A543E]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export { ImageWithFallback };
