// contracts/index.ts
import { Contract } from "ethers";
import { CONTRACT_ADDRESSES } from "./addresses";
import GOUL_JSON from "../abis/Goul.json";

// Ensure we correctly extract the ABI from JSON
export const GOUL_ABI = GOUL_JSON.abi;
export const getContracts = (signer: any) => ({
  goul: new Contract(CONTRACT_ADDRESSES.GOUL_TOKEN_ADDRESS, GOUL_ABI, signer),
  dex: new Contract(CONTRACT_ADDRESSES.GOUL_DEX_ADDRESS, GOUL_DEX_ABI, signer),
});

export * from './addresses';
export * from './abis';

export const GOUL_DEX_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "minAmountOut","type": "uint256"}],
    "name": "swapBNBforGoul",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "fromToken","type": "address"},
      {"internalType": "uint256","name": "amountIn","type": "uint256"},
      {"internalType": "uint256","name": "minAmountOut","type": "uint256"}
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ERC-20 Standard ABI (with added transfer function)
export const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance","type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender","type": "address"},
      {"name": "_value","type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "success","type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner","type": "address"},
      {"name": "_spender","type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "remaining","type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to","type": "address"},
      {"name": "_value","type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "success","type": "bool"}],
    "type": "function"
  }
];