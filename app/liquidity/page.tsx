
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Liquidity from '../../src/components/Liquidity';
import Link from 'next/link';
const Navbar = dynamic(() => import('../../src/components/Navbar'), { ssr: false });


 


  export default function LiquidityPage() {
    const [currentTheme, setCurrentTheme] = useState('dark');
  
    const toggleTheme = () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      setCurrentTheme(newTheme);
    };
  
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container">
          <header className="header-container">
            <Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <div className="theme-toggle-container">
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {currentTheme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
          </header>
                 
             
          <main className="main-content">
            <h2 className="market-title text-center text-xl mb-8">
              Coming Soon 05-25-2025
            </h2>
                 

            <Liquidity />
            <div className="flex flex-row justify-center w-full">
  <Link href="/sendgoul" className="wallet-btn p-3 rounded-lg hover: transition-colors">
    <h1>Send GOUL to any address →</h1>
  </Link>
</div>
          </main>
        </div>
      </div>
    );
  }