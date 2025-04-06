// app/Web3Provider.tsx
'use client';
import { Web3ReactProvider } from '@web3-react/core';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect';
import type { Web3ReactHooks } from '@web3-react/core';

const BSC_TESTNET_RPC = process.env.NEXT_PUBLIC_BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const CHAIN_ID = 97;

// Initialize connectors with proper typing
export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

export const [coinbaseWallet, coinbaseHooks] = initializeConnector<CoinbaseWallet>(
  (actions) => new CoinbaseWallet({
    actions,
    options: {
      url: BSC_TESTNET_RPC,
      appName: 'Goul Dex Exchange TestNet',
      reloadOnDisconnect: false
    }
  })
);

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) => new WalletConnect({
    actions,
    options: {
      rpc: { [CHAIN_ID]: BSC_TESTNET_RPC },
      qrcode: true
    }
  })
);

// Create properly typed connectors array
const connectors = [
  [metaMask, metaMaskHooks],
  [coinbaseWallet, coinbaseHooks],
  [walletConnect, walletConnectHooks],
].filter(([connector]) => Boolean(connector)) as Array<[any, Web3ReactHooks]>;

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ReactProvider 
      connectors={connectors}
      lookupENS={false}
    >
      {children}
    </Web3ReactProvider>
  );
}