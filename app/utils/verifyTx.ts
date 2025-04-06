// utils/verifyTx.ts
import { BrowserProvider } from 'ethers';

export const verifyTransaction = async (txHash: string) => {
  const provider = new BrowserProvider(window.ethereum as any);
  const receipt = await provider.getTransactionReceipt(txHash);
  const network = await provider.getNetwork();
  
  return {
    confirmed: receipt?.status === 1,
    blockNumber: receipt?.blockNumber,
    explorerUrl: `https://${network.chainId === 97n ? 'testnet.' : ''}bscscan.com/tx/${txHash}`
  };
};