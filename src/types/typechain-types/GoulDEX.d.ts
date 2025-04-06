import { ethers } from "ethers";
import type { BaseContract, BigNumberish, PayableOverrides, CallOverrides } from "ethers";

export interface GoulDEX extends BaseContract {
  // Core DEX functions
  addLiquidity(tokenAmount: BigNumberish): Promise<ethers.ContractTransaction>;
  removeLiquidity(lpAmount: BigNumberish): Promise<ethers.ContractTransaction>;
  swapBNBForGoul(overrides?: PayableOverrides): Promise<ethers.ContractTransaction>;
  swapGoulForBNB(amount: BigNumberish): Promise<ethers.ContractTransaction>;
  getPrice(overrides?: CallOverrides): Promise<ethers.BigNumber>;

  // Management functions
  setLockedAddress(target: string, status: boolean): Promise<void>;
  updateFeeRecipient(newRecipient: string): Promise<void>;
  setAntiSniping(enabled: boolean): Promise<void>;
  setAntiFrontRunning(enabled: boolean): Promise<void>;

  // View functions
  token(): Promise<string>;
  feeRecipient(): Promise<string>;
  totalLiquidity(): Promise<ethers.BigNumber>;
  balanceOf(account: string): Promise<ethers.BigNumber>;

  // Events
  filters: {
    LiquidityAdded(provider: string | null, tokenAmount: null, lpTokens: null): ethers.EventFilter;
    LiquidityRemoved(provider: string | null, tokenAmount: null, lpTokens: null): ethers.EventFilter;
    SwapExecuted(sender: string | null, inputAmount: null, outputAmount: null): ethers.EventFilter;
    FeeRecipientUpdated(newRecipient: string | null): ethers.EventFilter;
  };

  interface: {
    functions: {
      "addLiquidity(uint256)": FunctionFragment;
      "removeLiquidity(uint256)": FunctionFragment;
      "swapBNBForGoul()": FunctionFragment;
      "swapGoulForBNB(uint256)": FunctionFragment;
      "getPrice()": FunctionFragment;
      // ... other function fragments
    };
  };
}

export declare type GoulDEXInterface = GoulDEX["interface"];