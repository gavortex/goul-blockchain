'use client';
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, Eip1193Provider, parseEther, parseUnits, formatUnits } from "ethers";
import PANCAKE_ROUTER_ABI from "../contracts/PANCAKE_ROUTER_ABI.json";
import ERC20_ABI from "../contracts/ERC20_ABI.json";
import { getBNBPrice } from "../../lib/pancakeSwap"; 

const PANCAKE_ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const PancakeSwap = () => {
    const [showTokenList, setShowTokenList] = useState(false);
    const [selectedTokenType, setSelectedTokenType] = useState<"input" | "output">("input");
    const [searchQuery, setSearchQuery] = useState("");
    const [amountIn, setAmountIn] = useState("");
   const [inputToken, setInputToken] = useState("BNB");
  const [outputToken, setOutputToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [inputBalance, setInputBalance] = useState("0");
  const [outputBalance, setOutputBalance] = useState("0");
  const [slippage, setSlippage] = useState(1); // Slippage percentage
  const [currentPrice, setCurrentPrice] = useState<string>("0");
  const [txHash, setTxHash] = useState<string | null>(null);


  const getTokenDetails = (tokenIdentifier: string) => {
    if (tokenIdentifier === "BNB") return commonTokens.find(t => t.symbol === "BNB");
    return commonTokens.find(t => t.address === tokenIdentifier);
  };

  const commonTokens = [
    {
      symbol: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      logo: "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
    },
    {
      symbol: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      logo: "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png"
    },
    {
      symbol: "Goul",
      address: "0xb0BF53a9A91AD4E3A27d4c53B6134B072622FC76",
      logo: "https://azure-healthy-guan-201.mypinata.cloud/ipfs/bafybeihxrx4k4m4hjxd5fsopxzobt5y4a4s6gsnaqmv4k5eennh35bkxie"
    },

    {
      symbol: "CAKE",
      address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      logo: "https://azure-healthy-guan-201.mypinata.cloud/ipfs/bafkreibq4tz5ytkykeiq5itlymaou5fzh6bkko7ol4tkqs3vy2ak7z52rq"
    },

    {
      symbol: "ADA",
      address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
      logo: "https://tokens.pancakeswap.finance/images/0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47.png"
    },
   
    {
      symbol: "APE",
      address: "0xC762043E211571eB34f1ef377e5e8e76914962f9",
      logo: "https://tokens.pancakeswap.finance/images/0xC762043E211571eB34f1ef377e5e8e76914962f9.png"
    },

    {
      symbol: "AAVE",
      address: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
      logo: "https://assets.coingecko.com/coins/images/12645/thumb/aave-token-round.png?1720472354"
    },


    {
      symbol: "AVAX",
      address: "0x1CE0c2827e2eF14D5C4f29a091d735A204794041",
      logo: "https://tokens.pancakeswap.finance/images/0x1CE0c2827e2eF14D5C4f29a091d735A204794041.png"
    },

];





useEffect(() => {
  const checkConnection = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setConnected(true);
        fetchBalances(address, provider);
      } catch {
        setConnected(false);
      }
    }
  };
  checkConnection();
}, []);

  useEffect(() => {
    const loadPrice = async () => {
      if (outputToken) {
        // Convert BNB to WBNB address for price check
        const tokenAddress = outputToken === "BNB" ? WBNB : outputToken;
        const priceData = await getBNBPrice(tokenAddress);
        if (priceData) setCurrentPrice(priceData.price);
      }
    };
    loadPrice();
  }, [outputToken]); // Update price when output token changes

  const calculateOutputAmount = () => {
    if (amountIn && currentPrice && outputToken) {
      return (parseFloat(amountIn) * parseFloat(currentPrice)).toFixed(6);
    }
    return "0.0";
  };


  const fetchBalances = async (userAddress: string, provider: BrowserProvider) => {
    try {
      // Fetch input token balance
      const inputBal = inputToken === "BNB" 
        ? await provider.getBalance(userAddress)
        : await new Contract(inputToken, ERC20_ABI, provider).balanceOf(userAddress);
      
      const formattedInput = await formatBalance(inputBal, inputToken, provider);
      setInputBalance(formattedInput);
  
      // Fetch output token balance
      if (outputToken) {
        const outputBal = outputToken === "BNB" 
          ? await provider.getBalance(userAddress)
          : await new Contract(outputToken, ERC20_ABI, provider).balanceOf(userAddress);
        
        const formattedOutput = await formatBalance(outputBal, outputToken, provider);
        setOutputBalance(formattedOutput);
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
      setInputBalance("Error");
      setOutputBalance("Error");
    }
  };
  
  const formatBalance = async (balance: bigint, tokenIdentifier: string, provider: BrowserProvider) => {
    try {
      let decimals = 18;
      
      if (tokenIdentifier !== "BNB") {
        const tokenContract = new Contract(tokenIdentifier, ERC20_ABI, provider);
        decimals = await tokenContract.decimals();
      }
  
      return parseFloat(formatUnits(balance, decimals)).toLocaleString(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 2
      });
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0.00";
    }
  };

  const handlePercentage = (percent: number) => {
    if (inputBalance) {
        const calculatedAmount = (parseFloat(inputBalance) * percent).toFixed(6);
        setAmountIn(calculatedAmount);
    }
};


  // Update token selection in modal
  const handleTokenSelect = (token: { symbol: string; address: string }) => {
    const selectedAddress = token.symbol === "BNB" ? "BNB" : token.address;
    const otherToken = selectedTokenType === "input" ? outputToken : inputToken;
    
    if (selectedAddress === otherToken) {
      alert("Can't select the same token for both input and output");
      return;
    }
  
    if (selectedTokenType === "input") {
      setInputToken(selectedAddress);
    } else {
      setOutputToken(selectedAddress);
    }
    setShowTokenList(false);
  };
  
  const handleSwap = async () => {
    if (!window.ethereum || !connected || !outputToken) {
      alert("Please connect wallet and select tokens");
      return;
    }

    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const router = new Contract(PANCAKE_ROUTER_ADDRESS, PANCAKE_ROUTER_ABI, signer);

      // Validate amount
      if (!amountIn || isNaN(parseFloat(amountIn))) {
        throw new Error("Invalid input amount");
      }

      // Convert amount to wei
      let amountInWei: bigint;
      if (inputToken === "BNB") {
        amountInWei = parseEther(amountIn);
      } else {
        const tokenContract = new Contract(inputToken, ERC20_ABI, provider);
        const decimals = await tokenContract.decimals();
        amountInWei = parseUnits(amountIn, decimals);
      }

      // Construct path
      const path = [];
      if (inputToken === "BNB") path.push(WBNB);
      else path.push(inputToken);
      
      if (outputToken === "BNB") path.push(WBNB);
      else path.push(outputToken);

      // Get amounts out
      const amountsOut = await router.getAmountsOut(amountInWei, path);
      const expectedOut = amountsOut[amountsOut.length - 1];
      const amountOutMin = expectedOut * BigInt(100 - slippage) / BigInt(100);

      // Execute swap
      let tx;
      if (inputToken === "BNB") {
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          [WBNB, outputToken === "BNB" ? WBNB : outputToken], // Ensure proper path
          userAddress,
          Math.floor(Date.now() / 1000) + 600,
          { value: amountInWei }
        );
      } else {
        const tokenContract = new Contract(inputToken, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(userAddress, PANCAKE_ROUTER_ADDRESS);
        
        if (allowance < amountInWei) {
          const approveTx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountInWei);
          await approveTx.wait();
        }

        tx = outputToken === "BNB"
          ? await router.swapExactTokensForETH(
              amountInWei,
              amountOutMin,
              path,
              userAddress,
              Math.floor(Date.now() / 1000) + 600
            )
          : await router.swapExactTokensForTokens(
              amountInWei,
              amountOutMin,
              path,
              userAddress,
              Math.floor(Date.now() / 1000) + 600
            );
      }

      const receipt = await tx.wait();
      if (!receipt.status) throw new Error("Transaction failed");
      
      setTxHash(receipt.hash);
      await fetchBalances(userAddress, provider);
      alert("Swap successful!");

    } catch (error: any) {
      console.error("Swap error:", error);
      alert(`Swap failed: ${error.reason || error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };


const TokenModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-4 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select a Token</h3>
          <button 
            onClick={() => setShowTokenList(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search name or paste address"
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="border-b border-gray-700 mb-4" />

        <div className="max-h-60 overflow-y-auto">
          {commonTokens.map((token) => (
          <div
          key={token.address}
          onClick={() => handleTokenSelect(token)}
          className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
        >
              <img src={token.logo} alt={token.symbol} className="w-6 h-6 mr-2 rounded-full" />
              <span className="font-medium">{token.symbol}</span>
            </div>
          ))}

 {/* Add custom token entry */}
 {searchQuery && (
            <div
              onClick={() => handleTokenSelect({
                symbol: "CUSTOM",
                address: searchQuery
              })}
              className="flex items-center p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              <div className="w-6 h-6 bg-gray-500 rounded-full mr-2" />
              <span className="font-medium">Custom Token</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="swap-container max-w-md mx-auto p-4">
      {/* From Section */}
      <span className="text-gray-300">From</span>
<div className="swap-box bg-gray-800 p-4 rounded-lg mb-4">

  <div className="swap-info flex justify-between items-center mb-2">
   
    <span className="text-sm text-gray-400">Balance: {inputBalance}</span>
  </div>



  <div className="flex gap-2 w-full">
  <button
  onClick={() => {
    setSelectedTokenType("input");
    setShowTokenList(true);
  }}
  className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
>
  {getTokenDetails(inputToken) ? (
    <img
      src={getTokenDetails(inputToken)!.logo}
      alt={getTokenDetails(inputToken)!.symbol}
      className="w-6 h-6 rounded-full"
    />
  ) : (
    <div className="w-6 h-6 bg-gray-500 rounded-full" />
  )}
  <span className="font-medium">
    {getTokenDetails(inputToken)?.symbol || "Select Token"}
  </span>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg> 
</button>
    <input
      type="number"
      className="swap-input w-1/3 p-2 rounded bg-gray-700 text-white text-right"
      value={calculateOutputAmount()}
      onChange={(e) => setAmountIn(e.target.value)}
      placeholder="0.0"
    />   
  </div> 
</div> 

     {/* Percentage Selection */}
     <div className="flex flex-row gap-2 text-xs text-gray-400 items-start w-full h-0">
    <button onClick={() => setAmountIn((parseFloat(inputBalance) * 0.25).toFixed(6))} className="hover:text-white">25%</button>
    <button onClick={() => setAmountIn((parseFloat(inputBalance) * 0.50).toFixed(6))} className="hover:text-white">50%</button>
    <button onClick={() => setAmountIn((parseFloat(inputBalance) * 0.75).toFixed(6))} className="hover:text-white">75%</button>
    <button onClick={() => setAmountIn(inputBalance)} className="hover:text-white">MAX</button>
  </div>
  
      {/* Swap Toggle */}
      <div className="swap-toggle-container relative my-2">
        <button className="swap-toggle absolute left-1/2 -translate-x-1/2 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
          <img src="/assets/arrow.png" alt="Swap" className="w-4 h-4" />
        </button>

     
     
      </div>
      <span className="text-gray-300">To</span>

      {/* To Section */}
      
      <div className="swap-box bg-gray-800 p-4 rounded-lg mb-4">
        <div className="swap-info flex justify-between items-center mb-2">
          
          <span className="text-sm text-gray-400">Balance: {outputBalance}</span>
        </div>
        <div className="flex gap-2 ml-8">
        <button
  onClick={() => {
    setSelectedTokenType("output");
    setShowTokenList(true);
  }}
  className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
>
  {getTokenDetails(outputToken) ? (
    <img
      src={getTokenDetails(outputToken)!.logo}
      alt={getTokenDetails(outputToken)!.symbol}
      className="w-6 h-6 rounded-full"
    />
  ) : outputToken ? (
    <div className="w-6 h-6 bg-gray-500 rounded-full" />
  ) : (
    <span className="font-medium">Select Token</span>
  )}
  <span className="font-medium">
    {getTokenDetails(outputToken)?.symbol || (outputToken ? "Token" : "")}
  </span>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
</button>
          <input
            type="text"
            className="swap-input w-1/3 p-2 rounded bg-gray-700 text-gray-400 text-right"
            value={amountIn}
            readOnly
            placeholder="0.0"
          />
        </div>
      </div>

      {showTokenList && <TokenModal />}

      {/* Slippage Settings */}
      <div className="swap-box bg-gray-800 p-4 rounded-lg mb-4">
        <div className="swap-info flex justify-between items-center">
          <span className="text-gray-300">Slippage</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="swap-input w-20 p-1 rounded bg-gray-700 text-white text-right"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
            />
            <span className="text-gray-400">%</span>
          </div>
        </div>
      </div>
         {/* Add Transaction Status Here */}
    {txHash && (
      <div className="mt-4 text-sm text-blue-400">
        Transaction: 
        <a 
          href={`https://bscscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-2"
        >
          View on BscScan
        </a>
      </div>
    )}
  
      {/* Connection Status */}
      {connected ? (
        <div className="swap-info text-center text-sm text-green-400 mb-4">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <div className="swap-info text-center text-sm text-red-400 mb-4">
          Not connected
        </div>
      )}
  
      {/* Swap Button */}
      <button
  className={`swap-btn w-full py-3 rounded-lg text-white font-semibold transition-colors
    ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
  onClick={handleSwap}
  disabled={loading || !outputToken}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      Swapping...
    </div>
  ) : (
    "Swap"
  )}
</button>
    </div>
  );
}

export default PancakeSwap;