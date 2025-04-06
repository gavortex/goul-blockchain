'use client';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { metaMask, coinbaseWallet, walletConnect } from '../Web3Provider';
import Image from 'next/image';
import PriceTicker from '../../src/components/PriceTicker';
import { Navbar } from '../../src/components';
import Link from 'next/link';
import Swap from '../../src/components/Swap';
import CryptoPrediction from '../../src/components/CryptoPrediction';
import StockData from '../../src/components/StockData';

export default function Page() {
  const { connector: activeConnector, isActive, account } = useWeb3React();
  const [isClient, setIsClient] = useState(false);
  const [activeDirection, setActiveDirection] = useState<'BNB_TO_GOUL' | 'GOUL_TO_BNB'>('BNB_TO_GOUL');
  const [amount, setAmount] = useState('');
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





  const handleSwapDirection = () => {
    setActiveDirection(prev => prev === 'BNB_TO_GOUL' ? 'GOUL_TO_BNB' : 'BNB_TO_GOUL');
    setAmount('');
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

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setCurrentTheme(newTheme);
  };

  if (!isClient) return null;

  return (
    <div className='min-h-screen gradient-bg'>     
     
      <div className="container">
      <header className="header-container">
 
<Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />

  {/* Theme toggle */}
  <div className="theme-toggle-container ml-4">

  
    <button 
      className="theme-toggle-btn text-2xl"
      onClick={toggleTheme}
    >
      {document.documentElement.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙'}
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

          <div className="wallet-section">
            {isActive ? (
              <div className="connection-status bg-card p-4 rounded-lg">
                <p className="text-sm mb-2">Connected with {activeConnector?.constructor.name}</p>
                <p className="account-address text-xs break-words opacity-75 mb-3">
                  {account}
                </p>
                <button 
                  onClick={disconnect}
                  className="w-full py-2 px-4 bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="wallet-buttons">
                <button onClick={() => connect(metaMask)}
                    className="wallet-btn p-3 bg-card rounded-lg hover:bg-accent transition-colors"
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
                  className="wallet-btn p-3 bg-card rounded-lg hover:bg-accent transition-colors"
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
                  className="wallet-btn p-3 bg-card rounded-lg hover:bg-accent transition-colors"
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

          <div className="swap-info">
            <Swap 
              amount={amount}
              setAmount={setAmount}
              direction={activeDirection}
              isSwapped={activeDirection === 'GOUL_TO_BNB'}
              onSwapDirection={handleSwapDirection}
              onSwapSuccess={() => console.log("Swap successful!")}
            />
          </div>
          <div className="flex flex-row justify-center w-full">
  <Link href="/postimg" className="wallet-btn p-3 rounded-lg hover: transition-colors">
    <h1>Post Images →</h1>
  </Link>
</div>
        
        </main>
      </div>
    </div>
  );
}