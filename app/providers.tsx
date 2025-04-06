'use client'; // Mark as a Client Component
import { Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { BrowserProvider } from 'ethers'; // Use BrowserProvider for ethers.js v6
import { initializeConnector } from '@web3-react/core';
import { ThemeProvider } from './context/ThemeContext';


const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

// Define the getProvider function for BrowserProvider
function getProvider(provider: any) {
  return new BrowserProvider(provider); // Ensure the provider is compatible with ethers.js
}

// Define the Providers component for setting up the Web3ReactProvider with multiple connectors
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
    <Web3ReactProvider connectors={[[metaMask, metaMaskHooks]]}>
      {children}
    </Web3ReactProvider>
    </ThemeProvider>
  );
}
