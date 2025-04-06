'use client';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther, parseUnits, Eip1193Provider } from 'ethers';
import { GOUL_DEX_ABI, GOUL_DEX_ADDRESS, GOUL_TOKEN_ADDRESS, ERC20_ABI } from '../contracts/';


interface SwapProps {
  amount: string;
  setAmount: (value: string) => void;
  direction: 'BNB_TO_GOUL' | 'GOUL_TO_BNB';
  isSwapped: boolean;
  onSwapDirection: () => void;
  onSwapSuccess: () => void;
}
const FIXED_RATE = 100000; // 1 BNB = 100,000 GOUL
const SLIPPAGE_TOLERANCE = 0.01; // 1% slippage



export default function Swap({ isSwapped, onSwapDirection, onSwapSuccess }: SwapProps) {
  const [amountBNB, setAmountBNB] = useState('');
  const [amountGOUL, setAmountGOUL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const MIN_BNB_AMOUNT = 0.001;

 

 
  const fetchPrice = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const dexContract = new Contract(GOUL_DEX_ADDRESS, GOUL_DEX_ABI, provider);
      
      // Get both balances to calculate real-time price
      const [bnbBalance, goulBalance] = await Promise.all([
        provider.getBalance(GOUL_DEX_ADDRESS),
        new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, provider).balanceOf(GOUL_DEX_ADDRESS)
      ]);
      
      const calculatedPrice = Number(formatEther(goulBalance)) / Number(formatEther(bnbBalance));

      setPrice(calculatedPrice);
    } catch (error) {
      console.error('Price fetch error:', error);
    }
  };
  
  const calculateOutput = (input: string, isBNBToGoul: boolean) => {
    if (!input || isNaN(Number(input))) return '0.00';
    
    const amount = parseFloat(input);
    return isBNBToGoul 
      ? (amount * 100000).toFixed(2) 
      : (amount / 100000).toFixed(6);
  };
  

  // Calculate output amount when input changes
  useEffect(() => {
    if (isSwapped) {
      const calculatedBNB = calculateOutput(amountGOUL, false);
      setAmountBNB(calculatedBNB);
    } else {
      const calculatedGOUL = calculateOutput(amountBNB, true);
      setAmountGOUL(calculatedGOUL);
    }
  }, [amountBNB, amountGOUL, isSwapped]);

  // Periodically update price
  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

 // components/Swap.tsx
 const handleSwap = async () => {
  setLoading(true);
  
  try {
    if (!window.ethereum) throw new Error("Wallet not connected");
    
    // Initialize provider and signer
    const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
    const signer = await provider.getSigner();
    
    // Initialize contracts
    const dexContract = new Contract(
      GOUL_DEX_ADDRESS,
      GOUL_DEX_ABI,
      signer
    );

    // Calculate minimum output with 1% slippage tolerance
    const calculateMinAmountOut = (inputAmount: string, isBNBToGoul: boolean) => {
      const amount = parseFloat(inputAmount);
      const rate = isBNBToGoul ? 100000 : 1/100000;
      return Math.floor(amount * rate * 0.99); // 1% slippage
    };

    if (!isSwapped) { // BNB to GOUL swap
      const amountWei = parseEther(amountBNB);
      const minAmountOut = calculateMinAmountOut(amountBNB, true);
      
      const tx = await dexContract.swapBNBforGoul(
        minAmountOut, // Add minimum output parameter
        { 
          value: amountWei,
          gasLimit: 300000 
        }
      );
      
      const receipt = await tx.wait();
      if (!receipt.status) throw new Error("Transaction reverted");
    } 
    else { // GOUL to BNB swap
      const amountWei = parseUnits(amountGOUL, 18);
      const goulContract = new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, signer);
      
      // Check and approve allowance
      const allowance = await goulContract.allowance(
        await signer.getAddress(),
        GOUL_DEX_ADDRESS
      );
      if (allowance < amountWei) {
        await (await goulContract.approve(GOUL_DEX_ADDRESS, amountWei)).wait();
      }
      
      // Execute swap through main swap function
      const minAmountOut = calculateMinAmountOut(amountGOUL, false);
      const tx = await dexContract.swap(
        GOUL_TOKEN_ADDRESS,
        amountWei,
        minAmountOut
      );
      
      const receipt = await tx.wait();
      if (!receipt.status) throw new Error("Transaction reverted");
    }

    // Update UI state
    setAmountBNB('');
    setAmountGOUL('');
    onSwapSuccess();

  } catch (error: any) {
    console.error("Swap Error:", error);
    const message = error.reason?.replace("execution reverted: ", "") || error.message;
    alert(`Swap failed: ${message}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="swap-container">
      {/* From Section */}
      <div className="swap-box">
        <div className="swap-info">
          <img 
            src={isSwapped ? "/assets/gouldex-logo.png" : "/assets/bnb-bnb-logo.png"} 
            alt="Token" 
            width={24} 
            height={24} 
          />
          <span>{isSwapped ? "GOUL" : "BNB"}</span>
        </div>
        <input
          type="number"
          className="swap-input"
          value={isSwapped ? amountGOUL : amountBNB}
          onChange={(e) => {
            const value = e.target.value;
            if (isSwapped) {
              setAmountGOUL(value);
            } else {
              setAmountBNB(value);
            }
          }}
          placeholder="0.00"
          disabled={loading}
        />
      </div>

      <p>Minimum amount {MIN_BNB_AMOUNT} BNB</p>

      {/* Swap Direction Button */}
      <div className="swap-toggle-container">
        <button className="swap-toggle" onClick={onSwapDirection} disabled={loading}>
          <img src="/assets/arrow.png" alt="Swap Direction" />
        </button>
      </div>

      {/* To Section */}
      <div className="swap-box">
        <div className="swap-info">
          <img 
            src={isSwapped ? "/assets/bnb-bnb-logo.png" : "/assets/gouldex-logo.png"} 
            alt="Token" 
            width={24} 
            height={24} 
          />
          <span>{isSwapped ? "BNB" : "GOUL"}</span>
        </div>
        <input
          type="number"
          className="swap-input"
          value={isSwapped ? amountBNB : amountGOUL}
          readOnly
          placeholder="0.00"
        />
      </div>

      {/* Swap Button */}
      <button className="swap-btn" onClick={handleSwap} disabled={loading}>
        {loading ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
}