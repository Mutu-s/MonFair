import address from '@/contracts/contractAddress.json'

// Network types
export type NetworkType = 'mainnet' | 'testnet'

// Chain IDs
export const MONAD_MAINNET_CHAIN_ID = 143
export const MONAD_TESTNET_CHAIN_ID = 10143

/**
 * Get current network type based on chain ID
 * @param chainId - The chain ID (defaults to mainnet if not provided)
 * @returns Network type ('mainnet' or 'testnet')
 */
export const getNetworkType = async (chainId?: number): Promise<NetworkType> => {
  // If chainId is provided, use it
  if (chainId !== undefined) {
    return chainId === MONAD_TESTNET_CHAIN_ID ? 'testnet' : 'mainnet'
  }

  // Try to get chainId from window.ethereum
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      return chainId === MONAD_TESTNET_CHAIN_ID ? 'testnet' : 'mainnet'
    } catch (error) {
      console.warn('Failed to get chainId from ethereum provider:', error)
    }
  }

  // Default to mainnet
  return 'mainnet'
}

/**
 * Get contract addresses for the current network
 * @param networkType - Network type ('mainnet' or 'testnet')
 * @returns Contract addresses object
 */
export const getContractAddresses = (networkType: NetworkType = 'mainnet') => {
  const addresses = address as any
  const networkAddresses = addresses[networkType] || addresses.mainnet

  // Backward compatibility: if old format exists, use it
  if (addresses.flipmatchContract && !networkAddresses) {
    return {
      flipmatchContract: addresses.flipmatchContract || addresses.monfairContract,
      casinoTreasury: addresses.casinoTreasury || '',
      casinoGames: addresses.casinoGames || {},
    }
  }

  return {
    flipmatchContract: networkAddresses?.flipmatchContract || networkAddresses?.monfairContract || '',
    casinoTreasury: networkAddresses?.casinoTreasury || '',
    casinoGames: networkAddresses?.casinoGames || {},
  }
}

/**
 * Get FlipMatch contract address for current network
 */
export const getFlipMatchAddress = async (chainId?: number): Promise<string> => {
  const networkType = await getNetworkType(chainId)
  const addresses = getContractAddresses(networkType)
  return addresses.flipmatchContract
}

/**
 * Get Casino Treasury address for current network
 */
export const getCasinoTreasuryAddress = async (chainId?: number): Promise<string> => {
  const networkType = await getNetworkType(chainId)
  const addresses = getContractAddresses(networkType)
  return addresses.casinoTreasury
}

/**
 * Get Casino Game address for current network
 */
export const getCasinoGameAddress = async (gameType: string, chainId?: number): Promise<string> => {
  const networkType = await getNetworkType(chainId)
  const addresses = getContractAddresses(networkType)
  return addresses.casinoGames[gameType] || ''
}








