// lib/pancakeSwap.ts
import { ethers } from "ethers";
import PANCAKE_ROUTER_ABI from "../src/contracts/PANCAKE_ROUTER_ABI.json";

const PANCAKE_ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export async function getBNBPrice(tokenAddress: string) {
  try {
    const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    const router = new ethers.Contract(
      PANCAKE_ROUTER_ADDRESS,
      PANCAKE_ROUTER_ABI,
      provider
    );

    const tokenIn = "0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // BNB
    const amounts = await router.getAmountsOut(
      ethers.parseEther("1"), // 1 BNB
      [tokenIn, tokenAddress] // Swap path
    );

    return {
      price: ethers.formatUnits(amounts[1], 18),
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error("PancakeSwap price fetch error:", error);
    return null;
  }
}