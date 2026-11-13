import { Phone, Mail } from 'lucide-react';
import { JAMIA_INFO } from '../data/jamiaData';

interface SocialIconsProps {
  size?: 'sm' | 'md';
}

export function SocialIcons({ size = 'md' }: SocialIconsProps) {
  const btnSize = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={JAMIA_INFO.whatsappChannel}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واٹس ایپ چینل"
        title="واٹس ایپ چینل"
        className={`flex ${btnSize} items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A543E] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A543E] hover:bg-[#0A543E] hover:text-white`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M12.03 2C6.5 2 2 6.48 2 12c0 1.77.47 3.5 1.35 5.02L2 22l5.12-1.33A9.96 9.96 0 0 0 12.03 22C17.55 22 22 17.52 22 12S17.55 2 12.03 2Zm5.83 14.12c-.25.7-1.45 1.34-2 1.42-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.35-5.14-4.55-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.61.86 2.11.93 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.36.08.13.08.75-.17 1.45Z" />
        </svg>
      </a>

      <a
        href={JAMIA_INFO.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ٹک ٹاک"
        title="ٹک ٹاک"
        className={`flex ${btnSize} items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A110E] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A543E] hover:bg-[#0A543E] hover:text-white`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.14 15.68 6.34 6.34 0 0 0 9.48 22a6.34 6.34 0 0 0 6.34-6.34V8.73a8.16 8.16 0 0 0 4.77 1.52V6.8c-.34 0-.67-.04-1-.11Z" />
        </svg>
      </a>

      <a
        href={`tel:${JAMIA_INFO.phone}`}
        aria-label="فون کال"
        title={JAMIA_INFO.phoneIntl}
        className={`flex ${btnSize} items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A543E] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A543E] hover:bg-[#0A543E] hover:text-white`}
      >
        <Phone className="h-4 w-4" />
      </a>

      <a
        href={`mailto:${JAMIA_INFO.email}`}
        aria-label="ای میل"
        title={JAMIA_INFO.email}
        className={`flex ${btnSize} items-center justify-center rounded-sm border border-[#D4CCB9] bg-white text-[#0A543E] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A543E] hover:bg-[#0A543E] hover:text-white`}
      >
        <Mail className="h-4 w-4" />
      </a>
    </div>
  );
}
