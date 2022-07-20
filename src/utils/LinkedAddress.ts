import { ethers } from "ethers";

export interface LinkedAddress {
  ens: string,
  address: string,
}

async function getLinkedAddress(provider: ethers.providers.EnsProvider, address: string): Promise<LinkedAddress | null> {
  const addressENS = await provider.lookupAddress(address);
  if (!addressENS) return null;

  const vaultInfo = await (await provider.getResolver(addressENS))?.getText("vault");
  if (!vaultInfo) return null;

  const vaultInfoArray = vaultInfo.split(':');
  if (vaultInfoArray.length != 3 || vaultInfoArray[0] != 'eip5131') return null;
  const authKey = vaultInfoArray[1];
  const vaultAddress = vaultInfoArray[2];

  const vaultENS = await provider.lookupAddress(vaultAddress);
  if (!vaultENS) return null;

  const expectedSigningAddress = await (await provider.getResolver(vaultENS))?.getText(authKey);

  if (expectedSigningAddress != address) return null;

  return {
    ens: vaultENS,
    address: vaultAddress
  };
}