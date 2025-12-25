import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import ConnectBtn from './ConnectBtn'
import Logo from './Logo'
import { FaTrophy, FaDice } from 'react-icons/fa'
import { useAccount, useChainId } from 'wagmi'
import { hasNickname, getNickname } from '@/services/nickname'
import NicknameModal from './NicknameModal'
import { MONAD_MAINNET_CHAIN_ID, MONAD_TESTNET_CHAIN_ID } from '@/utils/network'

const Header: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  
  const isMainnet = chainId === MONAD_MAINNET_CHAIN_ID
  const isTestnet = chainId === MONAD_TESTNET_CHAIN_ID
  
  const handleSwitchNetwork = async (targetChainId: number) => {
    if (chainId !== targetChainId) {
      try {
        // Use window.ethereum directly for chain switching
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
          })
        }
      } catch (switchError: any) {
        // If chain doesn't exist, add it
        if (switchError.code === 4902) {
          console.error('Chain not added to wallet')
        } else {
          console.error('Failed to switch network:', switchError)
        }
      }
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      // Check if user has nickname, if not show modal
      if (!hasNickname(address)) {
        // Small delay to ensure wallet is fully connected
        const timer = setTimeout(() => {
          setShowNicknameModal(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [isConnected, address])

  const handleNicknameSave = () => {
    setShowNicknameModal(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-dark-900/95 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border-b-2 border-dark-700/80 shadow-2xl">
      <main className="lg:w-4/5 w-full mx-auto flex justify-between items-center px-6 py-4">
        <Link href={'/'} className="hover:opacity-80 transition-opacity duration-300">
          <Logo size={40} />
        </Link>

        <nav className="hidden md:flex items-center gap-3">
          <Link 
            href={'/flip-match'} 
            className="text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/20 border border-transparent hover:border-primary-500/30"
          >
            <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent font-extrabold">
              Flip & Match
            </span>
          </Link>
          <Link 
            href={'/casino'} 
            className="text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-secondary-500/20 hover:to-secondary-600/20 border border-transparent hover:border-secondary-500/30"
          >
            <FaDice size={16} className="text-secondary-400" />
            <span>Casino</span>
          </Link>
          <Link 
            href={'/leaderboard'} 
            className="text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-accent-500/20 hover:to-accent-600/20 border border-transparent hover:border-accent-500/30"
          >
            <FaTrophy size={16} className="text-accent-400" />
            <span>Leaderboard</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Network Switcher */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/50 border border-dark-700/50">
            <button
              onClick={() => handleSwitchNetwork(MONAD_MAINNET_CHAIN_ID)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isMainnet
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-700/50'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => handleSwitchNetwork(MONAD_TESTNET_CHAIN_ID)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isTestnet
                  ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-700/50'
              }`}
            >
              Testnet
            </button>
          </div>
          
          {isConnected && address && hasNickname(address) && (
            <button
              onClick={() => setShowNicknameModal(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 transition-all cursor-pointer"
              title="Change nickname"
            >
              <span className="text-primary-400 text-xs md:text-sm font-bold">
                👤 {getNickname(address)}
              </span>
            </button>
          )}
          <ConnectBtn />
        </div>
      </main>
      
      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        onSave={handleNicknameSave}
      />
    </header>
  )
}

export default Header
