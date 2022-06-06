import { ethers } from "ethers";

export interface LinkedAddress {
  ens: string,
  address: string,
}

/**
 * Get the auth linked address if it exists.  
 * If there is a linked address, returns LinkedAddress object. 
 * Otherwise returns null.
 * 
 * @param provider ethers.js provider
 * @param address  address to check
 * @returns 
 */
export async function getLinkedAddress(provider: ethers.providers.Provider, address: string): Promise<LinkedAddress | null> {
  const addressENS = await provider.lookupAddress(address);
  if (!addressENS) return null;

  const authMatch = addressENS.match(/^(auth[0-9A-Za-z]*)\.(.*)/);
  if (!authMatch) return null;

  const linkedENS = authMatch[2];
  const linkedAddress = await provider.resolveName(linkedENS);

  if (!linkedAddress) return null;

  return {
    ens: linkedENS,
    address: linkedAddress
  };
}