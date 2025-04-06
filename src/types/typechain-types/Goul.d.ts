import { ethers } from "ethers";
import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result } from "ethers";

export interface Goul extends BaseContract {
  balanceOf(account: string): Promise<ethers.BigNumber>;
  totalSupply(): Promise<ethers.BigNumber>;
  transfer(recipient: string, amount: BigNumberish): Promise<boolean>;
  allowance(owner: string, spender: string): Promise<ethers.BigNumber>;
  approve(spender: string, amount: BigNumberish): Promise<boolean>;
  transferFrom(sender: string, recipient: string, amount: BigNumberish): Promise<boolean>;
  
  // Custom functions
  setBlacklist(target: string, status: boolean): Promise<void>;
  setFrozenAccount(target: string, status: boolean): Promise<void>;
  burn(amount: BigNumberish): Promise<void>;
  availableBalance(account: string): Promise<ethers.BigNumber>;

  // Events
  filters: {
    Transfer(from: string | null, to: string | null, value: null): ethers.EventFilter;
    Approval(owner: string | null, spender: string | null, value: null): ethers.EventFilter;
    AddressBlacklisted(account: string | null, isBlacklisted: null): ethers.EventFilter;
    AccountFrozen(account: string | null, isFrozen: null): ethers.EventFilter;
  };

  interface: {
    functions: {
      "balanceOf(address)": FunctionFragment;
      "totalSupply()": FunctionFragment;
      "transfer(address,uint256)": FunctionFragment;
      // ... other function fragments
    };
  };
}

export declare type GoulInterface = Goul["interface"];