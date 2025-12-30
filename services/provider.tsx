'use client'

import * as React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets, darkTheme } from '@rainbow-me/rainbowkit'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains } from 'wagmi'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { ethers } from 'ethers'
import '@rainbow-me/rainbowkit/styles.css'

// Monad Mainnet Network Configuration
const monad = {
  id: 143,
  name: 'Monad',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.monad.xyz',
        'https://rpc1.monad.xyz',
        'https://rpc2.monad.xyz',
        'https://rpc3.monad.xyz',
        'https://rpc4.monad.xyz',
      ],
    },
    public: {
      http: [
        'https://rpc.monad.xyz',
        'https://rpc1.monad.xyz',
        'https://rpc2.monad.xyz',
        'https://rpc3.monad.xyz',
        'https://rpc4.monad.xyz',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://monad.blockscout.com',
    },
  },
  testnet: false,
} as const

// Monad Testnet Network Configuration
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [
        'https://testnet-rpc.monad.xyz', // QuickNode - Primary (25 rps, 100)
        'https://rpc-testnet.monadinfra.com', // Monad Foundation - Fallback (20 rps)
      ],
    },
    public: {
      http: [
        'https://testnet-rpc.monad.xyz', // QuickNode - Primary (25 rps, 100)
        'https://rpc-testnet.monadinfra.com', // Monad Foundation - Fallback (20 rps)
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet.monadvision.com',
    },
  },
  testnet: true,
} as const

const projectId = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PROJECT_ID) || ''

const { chains, publicClient } = configureChains(
  [monadTestnet, monad],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'MonFair - Mission X',
  projectId,
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const queryClient = new QueryClient()

const appInfo = {
  appName: 'MonFair',
  learnMoreUrl: 'https://monad.xyz',
}

export function Providers({
  children,
  pageProps,
}: {
  children: React.ReactNode
  pageProps: {
    session: Session | null
  }
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <RainbowKitProvider 
            chains={chains}
            theme={darkTheme()} 
            appInfo={appInfo}
            showRecentTransactions={false}
            initialChain={monad.id}
          >
            {mounted && children}
          </RainbowKitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}


