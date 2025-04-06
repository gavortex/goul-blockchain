// lib/yahooFinance.ts
export async function getStockQuotes() {
    const response = await fetch(
      "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=AAPL,MSFT,AAL,NVDA,QBTS,AMZN,TSLA",
      {
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
          "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
        },
      }
    );
    return response.json();
  }