'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Goulai from '../../src/components/Goulai';

// Dynamically import client-side only components
const PriceTicker = dynamic(() => import('../../src/components/PriceTicker'), { ssr: false });
const Navbar = dynamic(() => import('../../src/components/Navbar'), { ssr: false, loading: () => <div className="navbar-loading">Loading...</div> });

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


export default function Page() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialTheme = typeof window !== 'undefined' ? 
      (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark' : 'dark';
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4">
        <header className="header-container">
          <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
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

        <main className="main-content text-center">
          <h2 className="market-title text-xl mb-8">Coming Soon 05-25-2025</h2>
          <Goulai />
        </main>

   
      </div>
    </div>
  );
}
