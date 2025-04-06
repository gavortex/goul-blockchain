'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import StockData from '../../src/components/StockData';



// Dynamically import all browser-dependent components
const Navbar = dynamic(() => import('../../src/components/Navbar'), { ssr: false });
const PriceTicker = dynamic(() => import('../../src/components/PriceTicker'), { 
  ssr: false,
  loading: () => <div className="text-gray-400">Loading prices...</div>
});



const tokenList = [
  { id: 'bitcoin', name: 'BTC' },
  { id: 'binancecoin', name: 'BNB' },
  { id: 'ethereum', name: 'ETH' },
  { id: 'solana', name: 'SOL' },
  { id: 'xrp', name: 'XRP' },
  { id: 'cardano', name: 'ADA' },
  { id: 'dogecoin', name: 'DOGE' },
  { id: 'shibainu', name: 'SHIB' },
  { id: 'gouldex', name: 'GOUL' },
  { id: 'tron', name: 'TRX' },
  { id: 'chainlink', name: 'LINK' },
  { id: 'bitcoin', name: 'BTC' },
  { id: 'binancecoin', name: 'BNB' },
  { id: 'ethereum', name: 'ETH' },
  { id: 'solana', name: 'SOL' },
  { id: 'xrp', name: 'XRP' },
  { id: 'cardano', name: 'ADA' },
  { id: 'dogecoin', name: 'DOGE' },
  { id: 'shibainu', name: 'SHIB' },
  { id: 'gouldex', name: 'GOUL' },
  { id: 'tron', name: 'TRX' },
  { id: 'chainlink', name: 'LINK' },
  { id: 'litecoin', name: 'LTC' }
];

export default function OnramperPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_ONRAMPER_API_KEY;
  const defaultCrypto = process.env.NEXT_PUBLIC_DEFAULT_CRYPTO || 'BNB';
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentTheme, setCurrentTheme] = useState('dark');


// Theme configuration
const themeParams = {
  dark: {
    themeName: 'dark',
    containerColor: '242429',
    primaryColor: 'b0f057',
    secondaryColor: '3f3f43',
    cardColor: '333333',
    primaryTextColor: 'd8d7d7',
    secondaryTextColor: 'ffffff',
    primaryBtnTextColor: '083e2b',
    borderRadius: '0.5',
    wgBorderRadius: '1'
  },
  light: {
    themeName: 'light',
    containerColor: 'FFFFFF',
    primaryColor: '27BE91',
    secondaryColor: 'ABE982',
    cardColor: 'F8F9FA',
    primaryTextColor: '333333',
    secondaryTextColor: '666666',
    primaryBtnTextColor: '083e2b',
    borderRadius: '10',
    wgBorderRadius: '10'
  }
};

useEffect(() => {
  const storedTheme = typeof document !== 'undefined' 
  ? document.documentElement.getAttribute('data-theme') as 'dark' | 'light'
  : 'dark';
setTheme(storedTheme);

  if (!apiKey) {
    console.error('Onramper API key is missing');
    return;
  }


  const sessionId = Math.random().toString(36).substring(2, 15);
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const themeConfig = currentTheme === 'dark' ? themeParams.dark : themeParams.light;
  
  const url = new URL('https://buy.onramper.com');
  url.search = new URLSearchParams({
    apiKey,
    ...themeConfig,
    defaultCrypto,
    sessionId,
    fontFamily: 'Inter',
    containerWidth: '100%'
  }).toString();

  setIframeUrl(url.toString());
}, [apiKey, defaultCrypto]);

const toggleTheme = () => {
 
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  if (iframeRef.current) {
    const themeConfig = newTheme === 'dark' ? themeParams.dark : themeParams.light;
    iframeRef.current.contentWindow?.postMessage({
      type: "change-theme",
      theme: themeConfig
    }, "https://buy.onramper.com");
  }
};

if (!apiKey) return <div className="text-center p-4">Missing Onramper API key</div>;
  return (
    <div className='min-h-screen gradient-bg'>
    <div className="container">
    <header className="header-container">

<Navbar 
  toggleTheme={toggleTheme} 
  currentTheme={currentTheme}
   />

<div className="theme-toggle-container">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </header>


      <div className="market-scroller">
        <div className="scrolling-prices">
          {[...Array(3)].map((_, i) => (
            <div key={`group-${i}`} className="price-group">
              {tokenList.map((token) => (
                <PriceTicker 
                  key={`${token.id}-${i}`} 
                  coinId={token.id} 
                  tokenName={token.name} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="main-content">
        <h2 className="market-title text-center text-xl mb-8">
          Coming Soon 05-25-2025
        </h2>
        
        <div className="onramper-container">
            {iframeUrl && (
              <iframe        
                ref={iframeRef}
                src={iframeUrl}
                title="Onramper Widget"
                className="onramper-iframe"
                allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
                onLoad={() => console.log('Onramper iframe loaded')}
              />
            )}
          </div>             
      </main>

    </div>
  </div>
);
}

