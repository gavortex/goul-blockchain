'use client';

import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { walletConnect } from '../../lib/walletconnect';

export default function WalletConnectButton() {
  const { isActive, connector, account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleActivation = async () => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Reset any existing connections first
      if (walletConnect.deactivate) {
        await walletConnect.deactivate();
      } else {
        walletConnect.resetState();
      }

      // Activate with specific chain ID (BSC mainnet)
      await walletConnect.activate(56);
    } catch (error) {
      console.error('WalletConnect Error:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      alert('Connection failed. Please check your WalletConnect connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivation = async () => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (connector?.deactivate) {
        await connector.deactivate();
      } else {
        connector?.resetState();
      }
      
      // Force cleanup of WalletConnect sessions
      if (walletConnect.provider?.disconnect) {
        await walletConnect.provider.disconnect();
      }
    } catch (error) {
      console.error('Disconnect Error:', error);
      setError(error instanceof Error ? error.message : 'Disconnection failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="wallet-connect-container">
      {error && <div className="error-message">Error: {error}</div>}
      
      {isActive ? (
        <div className="connected-wallet">
          <p className="account-info">Connected: {`${account?.slice(0, 6)}...${account?.slice(-4)}`}</p>
          <button 
            onClick={handleDeactivation} 
            disabled={loading}
            className="disconnect-button"
          >
            {loading ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        </div>
      ) : (
        <button 
          onClick={handleActivation} 
          disabled={loading}
          className="connect-button"
        >
          {loading ? 'Connecting via WalletConnect...' : 'Connect with WalletConnect'}
        </button>
      )}
    </div>
  );
}