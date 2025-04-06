'use client';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseUnits, formatUnits, Eip1193Provider } from 'ethers';
import { GOUL_TOKEN_ADDRESS, ERC20_ABI } from '../contracts/';


export default function SendGoul() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');

  const MIN_AMOUNT = 0.000001; // Minimum 0.000001 GU
  const DECIMALS = 18; // GU token decimals

  const isValidAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);


const fetchBalance = async () => {
  try {
    let provider;

    if ((window as any).rabby) {
      console.log("Using Rabby Wallet provider");
      provider = new BrowserProvider((window as any).rabby as Eip1193Provider);
    } else if (window.ethereum) {
      console.log("Using MetaMask provider");
      provider = new BrowserProvider(window.ethereum as Eip1193Provider);
    } else {
      throw new Error("No wallet detected");
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    console.log("Connected Wallet Address:", address);

    const goulContract = new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, provider);
    const balance = await goulContract.balanceOf(address);
    
    console.log("Raw Balance:", balance.toString());

    setBalance(formatUnits(balance, DECIMALS));
    setConnected(true);
    setAccount(address);

  } catch (error) {
    console.error("Balance fetch error:", error);
    setConnected(false);
  }
};
  const handlePercentage = (percent: number) => {
    const calculatedAmount = (parseFloat(balance) * (percent / 100)).toFixed(6);
    setAmount(calculatedAmount);
  };

  const handleSend = async () => { 
    if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
    }

    try {
        const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
        const accounts = await (window.ethereum as any).request({ method: "eth_accounts" });

        if (!accounts || accounts.length === 0) {
            throw new Error("No wallet connected. Please connect your wallet.");
        }

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress(); // Ensure signer is actually retrieved
        
        if (!userAddress) {
            throw new Error("Failed to retrieve wallet address. Please reconnect.");
        }

        const network = await provider.getNetwork();
        if (network.chainId !== 56n) {
            throw new Error("Please connect to Binance Smart Chain");
        }

        if (!isValidAddress(recipient)) {
            throw new Error("Invalid recipient address");
        }

        if (parseFloat(amount) < MIN_AMOUNT) {
            throw new Error(`Minimum send amount is ${MIN_AMOUNT} GU`);
        }

        setLoading(true);
        setError(null);

        const goulContract = new Contract(GOUL_TOKEN_ADDRESS, ERC20_ABI, signer);
        const amountInUnits = parseUnits(amount, DECIMALS);

        const tx = await goulContract.transfer(recipient, amountInUnits);
        const receipt = await tx.wait();
        
        if (!receipt.status) throw new Error("Transaction failed");

        await fetchBalance();
        setAmount('');
        alert(`Successfully sent ${amount} GU to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);

    } catch (error: any) {
        console.error("Send Error:", error);
        const message = error.code === 'ACTION_REJECTED' 
            ? "Transaction rejected" 
            : error.shortMessage || error.message;
        setError(message);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    if (window.ethereum) {
      fetchBalance();
      (window.ethereum as any).on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setConnected(false);
          setAccount('');
        } else {
          setAccount(accounts[0]);
          setConnected(true);
          fetchBalance();
        }
      });
    }
  }, []);



  useEffect(() => {
    const connectWallet = async () => {
      let provider: BrowserProvider | null = null;

      if ((window as any).rabby) {
        console.log("Using Rabby Wallet provider");
        provider = new BrowserProvider((window as any).rabby as Eip1193Provider);
      } else if (window.ethereum) {
        console.log("Using MetaMask provider");
        provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      } else {
        console.error("No wallet detected");
        return;
      }

      try {
        const accounts = await (provider.provider as any).request({ method: "eth_requestAccounts" });

        if (accounts.length > 0) {
          console.log("Connected Account:", accounts[0]);
          fetchBalance();
        } else {
          console.warn("Wallet connected but no accounts found");
        }
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    };

    connectWallet();

    if (window.ethereum) {
      (window.ethereum as any).on("accountsChanged", connectWallet);
    }

    return () => {
      if (window.ethereum) {
        (window.ethereum as any).removeListener("accountsChanged", connectWallet);
      }
    };
  }, []);

  return (
    <div className="swap-container">
      {/* Connection Status */}
      {connected ? (
        <div className="swap-info text-center text-sm text-green-400 mb-4">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}<br />
          Balance: {balance} GU
        </div>
      ) : (
        <div className="swap-info text-center text-sm text-red-400 mb-4">
          Not connected to BSC
        </div>
      )}

      {/* Amount Input Section */}
      <div className="swap-box">
        <div className="swap-info">
          <img 
            src="/assets/gouldex-logo.png" 
            alt="GU" 
            width={24} 
            height={24} 
          />
          <span>GU</span>
        </div>
        
        <div className="flex flex-col w-full">
          <input
            type="number"
            className="swap-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">Balance: {balance}</span>
            <div className="flex gap-1">
              {[25, 50, 75, 100].map((perc) => (
                <button
                  key={perc}
                  className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => handlePercentage(perc)}
                >
                  {perc}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Input Section */}
      <div className="swap-box mt-4">
        <div className="swap-info">
          <span className="text-gray-300">To Address</span>
        </div>
        <input
          type="text"
          className="swap-input"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
       
      <button 
        className="swap-btn" 
        onClick={handleSend} 
        disabled={loading || !amount || !recipient}
      >
        {loading ? "Sending..." : "Send GU"}
      </button>
    </div>
  );
}