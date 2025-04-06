'use client';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther, Eip1193Provider } from 'ethers';
import { GOUL_DEX_ABI, GOUL_DEX_ADDRESS, GOUL_TOKEN_ADDRESS } from '../contracts';
import { ethers } from 'ethers';

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const CONFIG = {
  CONTRACT_ADDRESS: '0x2d9B53b35a186f16d6B31BA2E6150626943360f4', // Make sure this is correct
  REQUIRED_CHAIN: 56, // Binance Smart Chain Mainnet
};

export default function Liquidity() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    balance: 0,
    symbol: 'GU',
    decimals: 18,
    networkValid: false
  });

  const [bnbAmount, setBnbAmount] = useState('');
  const [goulAmount, setGoulAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [price, setPrice] = useState(0);
  const [balances, setBalances] = useState({ bnb: 0, goul: 0 });


   
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!window.ethereum) throw new Error("❌ Wallet not detected. Install MetaMask.");
  
        const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
        const network = await provider.getNetwork();
        if (network.chainId !== 56n && network.chainId !== 97n) throw new Error("❌ Wrong network!");
  
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        console.log("🚀 GOUL_TOKEN_ADDRESS:", GOUL_TOKEN_ADDRESS);
        if (!GOUL_TOKEN_ADDRESS) throw new Error("GOUL_TOKEN_ADDRESS is missing!");
  
        const contract = new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, provider);
        console.log("✅ GOUL Contract Created:", contract);
  
        const rawBalance = await contract.balanceOf(address);
        const formattedBalance = Number(ethers.formatUnits(rawBalance, 18));
  
        setState(prev => ({ ...prev, balance: formattedBalance, error: '' }));
        
      } catch (error: any) {
        console.error("❌ GOUL Balance Error:", error);
        setError(error.message || "Error fetching balance.");
      }
    };
  
    fetchBalance();
  }, []);

// Update the fetchBalances function
const fetchBalances = async () => {
  try {
    setError('');
    
    // 1. Check Ethereum provider availability
    if (!window.ethereum) {
      setError('Wallet not detected');
      return;
    }

    // 2. Create provider and check network
    const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
    const network = await provider.getNetwork();
    
    // Verify Binance Smart Chain (Mainnet or Testnet)
    if (network.chainId !== 56n && network.chainId !== 97n) {
      setError('Please connect to Binance Smart Chain');
      return;
    }

    // 3. Get user address
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("👤 User Address:", address);

    // 4. Fetch balances with improved error handling
    const [bnbBal, goulBal] = await Promise.all([
      provider.getBalance(address),
      (async () => {
        try {
          const goulContract = new Contract(
            GOUL_TOKEN_ADDRESS,
            ERC20_ABI,
            provider
          );
              console.log("✅ GOUL Contract Instance Created");
          // Verify contract connection
          console.log('GOUL Contract Instance:', {
            address: GOUL_TOKEN_ADDRESS,
            methods: Object.keys(goulContract.functions)
          });

          const balance = await goulContract.balanceOf(address);
          return Number(formatEther(balance));
        } catch (error: any) {
          console.error('GOUL Balance Error:', {
            error,
            contractAddress: GOUL_TOKEN_ADDRESS,
            userAddress: address,
           
          });
          setError(`GOUL Balance Error: ${error.shortMessage || error.message}`);
          return 0;
        }
      })()
    ]);

    setBalances({
      bnb: Number(formatEther(bnbBal)),
      goul: goulBal,
    });

  } catch (error: any) {
    console.error('Global Balance Error:', error);
    setError(`Connection Error: ${error.shortMessage || error.message}`);
    setBalances({ bnb: 0, goul: 0 });
  }
};
  const fetchPrice = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const dexContract = new Contract(GOUL_DEX_ADDRESS, GOUL_DEX_ABI, provider);
      const price = await dexContract.getPrice();
      setPrice(Number(formatEther(price)));
    } catch (error) {
      console.error('Price fetch error:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchPrice();
    fetchBalances();
  }, []);

  useEffect(() => {
    if (bnbAmount && !isNaN(Number(bnbAmount))) {
      setGoulAmount((Number(bnbAmount) * price).toFixed(6));
    }
  }, [bnbAmount, price]);

  const handlePercentageSelect = (percentage: number) => {
    const newBnbAmount = (balances.bnb * (percentage / 100)).toFixed(6);
    setBnbAmount(newBnbAmount);
  };

  const addLiquidity = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const signer = await provider.getSigner();
      
      // Approve GOUL tokens
      const goulContract = new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, signer);
      const approveTx = await goulContract.approve(GOUL_DEX_ADDRESS, parseEther(goulAmount));
      await approveTx.wait();

      // Add liquidity
      const dexContract = new Contract(GOUL_DEX_ADDRESS, GOUL_DEX_ABI, signer);
      const tx = await dexContract.addLiquidity({
        value: parseEther(bnbAmount),
        gasLimit: 500000
      });
      
      await tx.wait();
      await fetchBalances();
      setBnbAmount('');
      setGoulAmount('');
    } catch (error: any) {
      setError(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap-container">
      <h3 className="section-title">Select Token Pair</h3>
      <div className="swap-box">
        <div className="swap-info">
          <div className="pair-container">
            <div className="token-card">
              <div className="token-content">
                <img src="/assets/bnb-bnb-logo.png" alt="BNB" className="token-logo" />
                <div className="token-info">
                  <span className="token-name">BNB</span>
                  <span className="dropdown-arrow">▾</span>
                </div>
              </div>
            </div>
            <div className="plus-center">+</div>
            <div className="token-card">
              <div className="token-content">
                <img src="/assets/gouldex-logo.png" alt="GOUL" className="token-logo" />
                <div className="token-info">
                  <span className="token-name">GOUL</span>
                  <span className="dropdown-arrow">▾</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="deposit-box">
        <div className="balance-header">
          <span>Deposit BNB</span>
          <span className="balance">Balance: {balances.bnb.toFixed(4)}</span>
        </div>
        <div className="input-container">
          <input
            type="number"
            className="deposit-input"
            value={bnbAmount}
            onChange={(e) => setBnbAmount(e.target.value)}
            placeholder="0.0"
          />
          <div className="token-display">
            <img src="/assets/bnb-bnb-logo.png" alt="BNB" width={32} height={32} />
            <span>BNB</span>
          </div>
        </div>
      </div>

      <div className="percentage-buttons">
        {[25, 50, 75, 100].map((perc) => (
          <button
            key={perc}
            className="perc-btn"
            onClick={() => handlePercentageSelect(perc)}
          >
            {perc}%
          </button>
        ))}
      </div>

      <div className="deposit-box">
        <div className="balance-header">
          <span>Deposit GOUL</span>
          <span className="balance">Balance: {balances.goul.toFixed(2)}</span>
        </div>
        <div className="input-container">
          <input
            type="number"
            className="deposit-input"
            value={goulAmount}
            readOnly
            placeholder="0.0"
          />
          <div className="token-display">
            <img src="/assets/gouldex-logo.png" alt="GOUL" width={32} height={32} />
            <span>GU</span>
          </div>
        </div>
      </div>

      <button 
        className="swap-btn large-btn" 
        onClick={addLiquidity} 
        disabled={loading || !bnbAmount}
      >
        {loading ? 'Processing...' : 'Add Liquidity'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}