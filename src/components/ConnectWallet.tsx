'use client';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { initializeConnector } from '@web3-react/core';

// Initialize connectors with proper options
const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));
const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>((actions) =>
  new WalletConnect({
    actions,
    options: {
      projectId: 'your_project_id', // Make sure you have a valid WalletConnect project ID
      chains: [56],
      rpcMap: {
        56: 'https://bsc-dataseed.binance.org/', // Binance Smart Chain RPC URL
      },
      showQrModal: true, // Required property to show QR modal
    },
  })
);

// Explicitly typed connectors as MetaMask | WalletConnect
const connectors: [MetaMask | WalletConnect, any][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];

// Create a mapping for connector names
const connectorNames = new Map<MetaMask | WalletConnect, string>([
  [metaMask, 'MetaMask'],
  [walletConnect, 'WalletConnect'],
]);

export default function ConnectWallet() {
  const { connector: activeConnector, isActive, account } = useWeb3React();

  // Ensure activeConnector is either MetaMask or WalletConnect
  const connect = async (connector: MetaMask | WalletConnect) => {
    try {
      await connector.activate();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const disconnect = async () => {
    try {
      if (activeConnector?.deactivate) {
        await activeConnector.deactivate();
      } else if (activeConnector?.resetState) {
        activeConnector.resetState(); // Alternative way to disconnect
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div>
      {isActive ? (
        <div>
          <p>Connected to {connectorNames.get(activeConnector as MetaMask | WalletConnect)}</p>
          <p>Account: {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          {connectors.map(([connector, hooks], index) => (
            <button
              key={index}
              onClick={() => connect(connector)}
              disabled={!connector}
            >
              Connect with {connectorNames.get(connector)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
