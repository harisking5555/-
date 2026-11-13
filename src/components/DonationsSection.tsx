import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { BANK_ACCOUNTS, JAMIA_INFO } from '../data/jamiaData';

const PURPOSES = [
  'زکوٰۃ',
  'صدقاتِ واجبہ و نافلہ',
  'فطرانہ و کفارہ',
  'للہ و تعمیرِ جامعہ',
  'کفالتِ طالباتِ علم',
];

export function DonationsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState(PURPOSES[0]);

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const whatsappDonationLink = `${JAMIA_INFO.whatsappDirect}?text=${encodeURIComponent(
    `السلام علیکم ورحمۃ اللہ، میں مرکزی جامعۃ البنات قصور میں "${selectedPurpose}" کی مد میں مالی تعاون کی رسید ارسال کر رہا/رہی ہوں۔`
  )}`;

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-5">
        <p className="text-xs font-semibold text-[#1E2923]">
          تعاون کی مد منتخب کریں (رسید واٹس ایپ پر ارسال کرنے کے لیے)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PURPOSES.map((purpose) => (
            <button
              key={purpose}
              type="button"
              onClick={() => setSelectedPurpose(purpose)}
              className={`min-h-[40px] cursor-pointer whitespace-nowrap rounded-sm px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                selectedPurpose === purpose
                  ? 'bg-[#0A543E] text-white'
                  : 'bg-[#F3EFE6] text-[#0A110E] hover:bg-[#E7E0D1]'
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {BANK_ACCOUNTS.map((acc) => (
          <div
            key={acc.id}
            className="flex flex-col justify-between rounded-sm border border-[#DDD6C7] bg-white p-4 sm:p-6"
          >
            <div>
              <p className="text-xs font-bold text-[#85581F]">{acc.label}</p>
              <h4 className="mt-1 font-display text-lg font-bold text-[#0A110E] sm:text-xl">
                {acc.bankName}
              </h4>

              <dl className="mt-4 space-y-2.5 border-t border-[#EFECE4] pt-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="font-medium text-[#3E4A43]">اکاؤنٹ ٹائٹل</dt>
                  <dd className="font-bold text-[#0A110E]">{acc.accountTitle}</dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="font-medium text-[#3E4A43]">اکاؤنٹ / رابطہ نمبر</dt>
                  <dd className="font-bold tabular-nums text-[#0A543E]">
                    <span dir="ltr">{acc.accountNumber}</span>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="font-medium text-[#3E4A43]">برانچ / مقام</dt>
                  <dd className="font-semibold text-[#0A110E]">{acc.branch}</dd>
                </div>
              </dl>

              <p className="mt-3 text-xs font-medium text-[#3E4A43]">{acc.iban}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#EFECE4] pt-4">
              <button
                type="button"
                onClick={() => handleCopy(acc.id, acc.accountNumber)}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-sm border border-[#D4CCB9] bg-[#FAF8F4] px-3.5 py-2 text-xs font-semibold text-[#0A110E] transition-colors hover:border-[#0A543E]"
              >
                {copiedId === acc.id ? (
                  <>
                    <Check className="h-4 w-4 text-[#0A543E]" />
                    <span>نمبر کاپی ہو گیا</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-[#0A543E]" />
                    <span>نمبر کاپی کریں</span>
                  </>
                )}
              </button>

              <a
                href={whatsappDonationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-sm bg-[#0A543E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#073E2D]"
              >
                <span>رسید واٹس ایپ کریں</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
