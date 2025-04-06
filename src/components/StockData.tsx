'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const StockData = () => {
  const [stockData, setStockData] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  
  const stockList = ['AAPL', 'MSFT', 'AAL', 'NVDA', 'QBTS', 'AMZN', 'TSLA'];

  // Fetch stock data from API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        
        const tickers = stockList.join(',');

        const options = {
          method: 'GET',
          url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes',
          params: { ticker: tickers },
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Note: Client-visible!
            'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
          }
        };

        const response = await axios.request(options); // Use axios.request()
        setStockData(response.data); // Store data in state
        setLoading(false); // Set loading to false when done
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Error fetching stock data'); // Set error message
        setLoading(false);
      }
    };

    fetchStockData();
  }, []); // Empty dependency array to run the effect only once when component mounts

  if (loading) {
    return <div>Loading stock data...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an error
  }

  if (!stockData || !stockData.quoteResponse.result) {
    return <div>No stock data available.</div>;
  }

  return (
    <div className='flex flex-row justify-center w-full py-4 mt-4'>
      <h1 className='flex-row justify-items-center w-full mt-4'>Stock Market Predictions</h1>
      {stockData.quoteResponse.result.map((stock: any) => (
        <div key={stock.symbol}>
          <h2>{stock.symbol}</h2>
          <p>Price: ${stock.regularMarketPrice}</p>
          <p>Change: {stock.regularMarketChangePercent}%</p>
          <p>Market Status: {stock.marketState}</p>
        </div>
      ))}
    </div>
  );
};

export default StockData;
