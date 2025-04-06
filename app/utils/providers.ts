// app/utils/providers.ts
import { JsonRpcProvider } from 'ethers'; // Updated import

export const getBscProvider = () => {
  return new JsonRpcProvider('https://bsc-dataseed.binance.org/'); // Use JsonRpcProvider directly
};