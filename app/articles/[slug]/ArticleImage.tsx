'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  fallbackColor: string;
};

export default function ArticleImage({ src, alt, fallbackColor }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ backgroundColor: fallbackColor, aspectRatio: '1200 / 630' }}
      >
        <span className="text-5xl">🏗️</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ aspectRatio: '1200 / 630' }}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className="w-full h-full object-cover"
        priority
        onError={() => setHasError(true)}
      />
    </div>
  );
}
