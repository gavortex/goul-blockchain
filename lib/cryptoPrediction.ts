// lib/cryptoPrediction.ts
export async function getCryptoPrediction() {
    const response = await fetch(
      "https://cryptocurrency-price-prediction-api.p.rapidapi.com/predictions/hour/24/bitcoin",
      {
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
          "x-rapidapi-host": "cryptocurrency-price-prediction-api.p.rapidapi.com",
        },
      }
    );
    return response.json();
  }