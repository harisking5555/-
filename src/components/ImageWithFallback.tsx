import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  objectPosition?: 'center' | 'top';
  objectFit?: 'cover' | 'contain';
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
  objectPosition = 'center',
  objectFit = 'cover',
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#F3EFE6] ${aspectClass} ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`h-full w-full transition-transform duration-300 ${
            objectFit === 'contain' ? 'object-contain' : 'object-cover'
          } ${objectPosition === 'top' ? 'object-top' : 'object-center'}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F3EFE6] to-[#E6DFCF] p-4 text-center text-[#0A543E]">
          <BookOpen className="h-7 w-7 opacity-80" />
          <span className="text-xs font-semibold text-[#1E2923]">{alt}</span>
        </div>
      )}
    </div>
  );
}
