// src/components/CryptoPrediction.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoPrediction = () => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get('/api/cryptoPrediction');
        setPredictedPrice(response.data.prediction); // Assuming the response contains a 'prediction' field
      } catch (error) {
        console.error('Error fetching prediction:', error);
      }
    };

    fetchPrediction();
  }, []);

  return (
    <div className="price-prediction bg-card p-4 mt-6 rounded-lg text-center">
      <h3 className="text-lg font-semibold">Crypto Prediction</h3>
      <p className="text-2xl mt-2">
        {predictedPrice ? `$${predictedPrice.toFixed(2)}` : 'Fetching...'}
      </p>
    </div>
  );
};

export default CryptoPrediction;
