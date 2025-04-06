import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect-v2';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;


if (!walletConnectProjectId) {
  throw new Error("❌ Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local");
}

// Binance Smart Chain Mainnet and Testnet configurations
const BSC_MAINNET_ID = 56;
const BSC_TESTNET_ID = 97;

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) => new WalletConnect({
    actions,
    options: {
      projectId: walletConnectProjectId,
      chains: [BSC_MAINNET_ID, BSC_TESTNET_ID],
      optionalChains: [BSC_MAINNET_ID, BSC_TESTNET_ID],
      rpcMap: { 
        [BSC_MAINNET_ID]: 'https://bsc-dataseed.binance.org/',
        [BSC_TESTNET_ID]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        1: 'https://cloudflare-eth.com' // Ethereum mainnet fallback
      },
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '9999'
        }
      }
    },
  })
);