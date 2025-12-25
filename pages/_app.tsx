import '@/styles/global.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import { Providers } from '@/services/provider'
import type { AppProps } from 'next/app'
import Header from '@/components/Header'
import { Provider } from 'react-redux'
import { store } from '@/store'
import Chat from '@/components/Chat'
import '@/utils/clearAllGames' // Import to make clearAllGames available in console

export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (
      <Providers pageProps={pageProps}>
        <Provider store={store}>
          <div className="bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 min-h-screen">
            <Header />
            <Component {...pageProps} />
            <Chat />
          </div>
        </Provider>
      </Providers>
    )
  }
}
