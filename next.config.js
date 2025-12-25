/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs')
    
    // Fix for MetaMask SDK React Native dependency warning
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        buffer: false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig
