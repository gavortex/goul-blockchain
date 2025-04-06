
'use client';
import dynamic from 'next/dynamic';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import SendGoul from 'components/SendGoul';
import Link from 'next/link';
import Image from 'next/image';

import { metaMask, coinbaseWallet, walletConnect } from '../Web3Provider';


const Navbar = dynamic(() => import('../../src/components/Navbar'), { ssr: false });
const PriceTicker = dynamic(() => import('../../src/components/PriceTicker'), { 
  ssr: false,
  loading: () => <div className="text-gray-400">Loading prices...</div>
});


export default function SendGoulPage() {
  const { connector: activeConnector, isActive, account } = useWeb3React();
  const [isClient, setIsClient] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');



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

     
    const toggleTheme = () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      setCurrentTheme(newTheme);
    };
  

       // Wallet connection functions
  const connect = async (connector: any) => {
    try {
      if (!connector) {
        console.error("No connector found!");
        return;
      }
  
      if (connector === metaMask) {
        // Check if MetaMask is installed on mobile
        if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
          await metaMask.activate();
          console.log("Connected via MetaMask!");
        } else {
          // Open MetaMask app on mobile if not detected
          window.open("https://metamask.app.link/dapp/" + window.location.href, "_blank");
        }
      } else {
        // Other wallets (Coinbase, WalletConnect)
        await connector.activate();
        console.log("Connected successfully!");
      }
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };
  
  const disconnect = async () => {
    try {
      if (activeConnector) {
        await activeConnector.deactivate?.();
        console.log("Disconnected successfully!");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
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
          <Link href="/swap" className="back-link">
            ← Back to Swap
          </Link>
            <h2 className="market-title text-center text-xl mb-8">
              Coming Soon 05-25-2025
            </h2>
            <div className="wallet-section">
            {isActive ? (
              <div className="connection-status  p-4 ">
                <p className="text-sm mb-2">Connected with {activeConnector?.constructor.name}</p>
                <p className="account-address text-xs break-words opacity-75 mb-3">
                  {account}
                </p>
                <button 
                  onClick={disconnect}
                  className="w-full py-2 px-4 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="wallet-buttons">
                <button onClick={() => connect(metaMask)}
                    className="wallet-btn p-3 rounded-lg hover: transition-colors"
                  >
                    <Image 
                      src="/assets/metamask-logo.png" 
                      alt="MetaMask" 
                      width={50} 
                      height={50}
                      className="mx-auto"
                    />
                  </button>
                <button 
                  onClick={() => connect(walletConnect)} 
                  className="wallet-btn p-3 rounded-lg hover: transition-colors"
                >
                  <Image 
                    src="/assets/wallet-connect-logo.svg" 
                    alt="WalletConnect" 
                    width={50} 
                    height={50}
                    className="mx-auto"
                  />
                </button>
                <button 
                  onClick={() => connect(coinbaseWallet)} 
                  className="wallet-btn p-3 rounded-lg hover: transition-colors"
                >
                  <Image 
                    src="/assets/coinbase-wallet-logo.svg" 
                    alt="Coinbase Wallet" 
                    width={50} 
                    height={50}
                    className="mx-auto"
                  />
                </button>
              </div>
            )}
          </div>
            <SendGoul />
           </main>
        </div>
      </div>
    );
  }