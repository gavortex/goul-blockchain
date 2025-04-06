// components/CustomOnramper.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export default function CustomOnramper() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const params = new URLSearchParams({
        apiKey: 'pk_test_01JN211ABK3SMDBH7K5ZDFXF9Z',
        themeName: theme === 'light' ? 'light' : 'dark',
        primaryColor: '27BE91',
        secondaryColor: 'ABE982',
        backgroundColor: theme === 'light' ? 'FFFFFF' : '121212',
        textColor: theme === 'light' ? '333333' : '9E9898',
        cardColor: theme === 'light' ? 'F8F9FA' : '1F1F1F',
        borderRadius: '10',
        fontFamily: 'Inter',
        containerWidth: '100%',
        defaultCrypto: 'BNB'
      });

      const iframe = document.createElement('iframe');
      iframe.onload = () => setIsLoading(false);
      iframe.src = `https://buy.onramper.com/?${params.toString()}`;
      iframe.style.height = '630px';
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '10px';
      iframe.allow = 'accelerometer; autoplay; camera; gyroscope; payment; microphone';

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(iframe);
    }
  }, [theme]);

  return (
    <div className={`onramper-container ${isLoading ? 'loading' : ''}`}>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}


