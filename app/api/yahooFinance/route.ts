import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract ticker from query parameters
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get("ticker") || "AAPL,MSFT,AAL,NVDA,QBTS,AMZN,TSLA";

    const options = {
      method: "GET",
      url: "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes",
      params: { ticker },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}