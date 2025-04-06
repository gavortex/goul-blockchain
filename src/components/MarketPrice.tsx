// components/MarketPrice.tsx
'use client';

import { useEffect, useState } from 'react';

const tokenPrices: { [key: string]: { name: string, geckoId: string } } = {
  BNB: { name: 'BNB', geckoId: 'binancecoin' },
  GOUL: { name: 'GOUL', geckoId: '0x225eae542804ACebbD46C81B519E70Db32bb6fA4' }
};

export default function MarketPrice({ token }: { token: keyof typeof tokenPrices }) {
  const [priceData, setPriceData] = useState<{
    current: number
    change24h: number
    volume: number
  } | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenPrices[token].geckoId}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await res.json();
        
        setPriceData({
          current: data[tokenPrices[token].geckoId].usd,
          change24h: data[tokenPrices[token].geckoId].usd_24h_change,
          volume: 0 // Add volume if needed
        });
      } catch (error) {
        console.error('Failed to fetch price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="market-price">
      <div className="token-header">
        <h3>{tokenPrices[token].name}</h3>
        <span className="token-symbol">{token}</span>
      </div>
      
      {priceData ? (
        <div className="price-data">
          <div className="price-current">
            ${priceData.current.toFixed(2)}
          </div>
          <div className={`price-change ${priceData.change24h >= 0 ? 'positive' : 'negative'}`}>
            {priceData.change24h.toFixed(2)}%
          </div>
        </div>
      ) : (
        <div className="price-loading">Loading...</div>
      )}
    </div>
  );
}
