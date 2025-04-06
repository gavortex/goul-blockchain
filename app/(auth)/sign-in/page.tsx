"use client";
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { metaMask, coinbaseWallet, walletConnect } from '../../Web3Provider';
import Image from 'next/image';
import AuthForm from "../../../src/components/AuthForm"
import { Navbar } from 'components';
import PriceTicker from '../../../src/components/PriceTicker';

export default function Page() {
  const { connector: activeConnector, isActive, account } = useWeb3React();
  const [isClient, setIsClient] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  
  // Keep the same token list
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

  useEffect(() => {
    setIsClient(true);
    setHasMetaMask(typeof window !== 'undefined' && !!window.ethereum?.isMetaMask);
    const savedTheme = typeof window !== 'undefined' ? 
      (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark' : 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };


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
    <div className='min-h-screen gradient-bg'>
      <div className="container">
        <header className="header-container">
          <Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />
          <div className="theme-toggle-container">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        {/* Same price ticker */}
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

         {/* Wallet connection section */}
         <div className="wallet-section">
            {isActive ? (
              <div className="connection-status">
                <p>Connected with {activeConnector?.constructor.name}</p>
                <p className="account-address">{account}</p>
                <button onClick={disconnect} className="disconnect-btn">
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="wallet-buttons">
               <button onClick={() => connect(metaMask)} className="wallet-btn">
                    <Image 
                      src="/assets/metamask-logo.svg" 
                      alt="MetaMask" 
                      width={50} 
                      height={50}
                    />
                  </button>
              
                <button onClick={() => connect(walletConnect)} className="wallet-btn">
                  <Image 
                    src="/assets/wallet-connect-logo.svg" 
                    alt="WalletConnect" 
                    width={50} 
                    height={50}
                  />
                </button>
                <button onClick={() => connect(coinbaseWallet)} className="wallet-btn">
                  <Image 
                    src="/assets/coinbase-wallet-logo.svg" 
                    alt="Coinbase Wallet" 
                    width={50} 
                    height={50}
                  />
                </button>
              </div>
            )}
          </div>
          
          <AuthForm type="sign-in" />
                  
        </main>
      </div>
    </div>
  );
}