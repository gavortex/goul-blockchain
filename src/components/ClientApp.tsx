"use client";

import { useEffect, useState } from "react";

const ClientApp = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Example API call (ensure NEXT_PUBLIC_API_URL is correctly set in .env)
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/example-endpoint`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Client-Side Component</h1>
      <p>Data from API: {data ?? "Loading..."}</p>
    </div>
  );
};

export default ClientApp;
