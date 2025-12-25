import { MONAD_MAINNET_CHAIN_ID, MONAD_TESTNET_CHAIN_ID } from './network'

/**
 * Network-specific configuration
 * This ensures mainnet and testnet settings never conflict
 */

export interface NetworkConfig {
  chainId: number
  rpcUrl: string
  name: string
  isTestnet: boolean
}

export const MAINNET_CONFIG: NetworkConfig = {
  chainId: MONAD_MAINNET_CHAIN_ID,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc3.monad.xyz',
  name: 'Monad Mainnet',
  isTestnet: false,
}

export const TESTNET_CONFIG: NetworkConfig = {
  chainId: MONAD_TESTNET_CHAIN_ID,
  rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || 'https://testnet-rpc.monad.xyz',
  name: 'Monad Testnet',
  isTestnet: true,
}

/**
 * Get network configuration based on chainId
 */
export const getNetworkConfig = (chainId: number): NetworkConfig => {
  if (chainId === MONAD_TESTNET_CHAIN_ID) {
    return TESTNET_CONFIG
  }
  return MAINNET_CONFIG
}

/**
 * Get network configuration from window.ethereum
 */
export const getCurrentNetworkConfig = async (): Promise<NetworkConfig> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      return getNetworkConfig(chainId)
    } catch (error) {
      console.warn('Failed to get chainId from ethereum provider:', error)
    }
  }
  return MAINNET_CONFIG
}

/**
 * Validate that we're on the correct network
 */
export const validateNetwork = async (expectedChainId: number): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      return chainId === expectedChainId
    } catch (error) {
      console.warn('Failed to validate network:', error)
      return false
    }
  }
  return false
}

