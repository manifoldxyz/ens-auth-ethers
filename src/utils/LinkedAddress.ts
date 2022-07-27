import { ethers } from 'ethers';

export interface LinkedAddress {
  ens: string,
  address: string,
}

export async function getLinkedAddress(
  provider: ethers.providers.EnsProvider, address: string
): Promise<LinkedAddress | null> {
  const addressENS = await provider.lookupAddress(address);
  if (!addressENS) return null;

  const vaultInfo = await (await provider.getResolver(addressENS))?.getText('eip5131:vault');
  if (!vaultInfo) return null;

  const vaultInfoArray = vaultInfo.split(':');
  if (vaultInfoArray.length !== 3 || vaultInfoArray[0] != 'eip5131') {
    throw new Error('EIP5131: Authkey and vault address not configured correctly.');
  }

  const [ _, authKey, vaultAddress ] = vaultInfoArray;

  const vaultENS = await provider.lookupAddress(vaultAddress);
  if (!vaultENS) {
    throw new Error(`EIP5131: No ENS domain with reverse record set for vault.`);
  };

  const expectedSigningAddress = await (
    await provider.getResolver(vaultENS)
  )?.getText(`eip5131:${authKey}`);

  if (expectedSigningAddress?.toLowerCase() !== address.toLowerCase()) {
    throw new Error(`EIP5131: Authentication mismatch.`);
  };

  return {
    ens: vaultENS,
    address: vaultAddress
  };
}