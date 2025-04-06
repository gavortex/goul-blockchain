// components/PriceTicker.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PriceTickerProps {
  coinId: string;
  tokenName: string;
}

export default function PriceTicker({ coinId, tokenName }: PriceTickerProps) {
  const [priceData, setPriceData] = useState<{
    current: number | null;
    change24h: number | null;
    lastUpdated: Date | null;
  }>({ current: null, change24h: null, lastUpdated: null });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
          { signal: controller.signal }
        );
        
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        if (isMounted) {
          setPriceData({
            current: data[coinId]?.usd || null,
            change24h: data[coinId]?.usd_24h_change || null,
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        if (isMounted && !controller.signal.aborted) {
          console.error('Price fetch failed:', error);
        }
      }
    };

    // Initial fetch
    fetchPrice();
    
    // WebSocket simulation with exponential backoff
    let retries = 0;
    const wsSimulation = setInterval(async () => {
      try {
        await fetchPrice();
        retries = 0;
      } catch (error) {
        retries = Math.min(retries + 1, 5);
      }
    }, Math.min(30000, 1000 * Math.pow(2, retries)));

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(wsSimulation);
    };
  }, [coinId]);

  return (
    <div className="price-card animate-scroll">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <Image
            src={`/assets/${coinId}-logo.png`}
            alt={tokenName}
            width={32}
            height={32}
            className="rounded-full animate-float"
          />
          <div className="ping-dot absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        <h3 className="font-medium">{tokenName}</h3>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          {priceData.current ? `$${priceData.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` : '--.--'}
        </span>
        <div className="flex flex-col items-end">
          <span className={`text-sm ${
            priceData.change24h && priceData.change24h >= 0 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {priceData.change24h ? `${priceData.change24h >= 0 ? '+' : ''}${priceData.change24h.toFixed(2)}%` : '--%'}
          </span>
          <span className="text-xs text-gray-400">
            {priceData.lastUpdated ? 
              new Intl.DateTimeFormat('en-US', { 
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
              }).format(priceData.lastUpdated) : '--:--'}
          </span>
        </div>
      </div>
    </div>
  );
}