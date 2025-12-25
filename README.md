# MonFair - Mission X

A verifiably fair gaming platform built on **Monad** blockchain using VRF (Verifiable Random Functions) for provable randomness.

![MonFair](./screenshots/0.png)

## Mission X: Verifiably Fair

This project implements a hyper-casual gaming platform where randomness is **verifiable** and **transparent**. Players can verify the fairness of every game outcome using VRF technology.

### Key Features

- 🎲 **VRF-Powered Randomness**: Core game mechanics use verifiable random functions (block.prevrandao + Pyth ready)
- ✅ **Transparent Fairness**: Players can verify randomness behind each outcome with built-in verification UI
- 🎮 **Hyper-Casual Games**: Fun, replayable arcade-style challenges
- 🔗 **Monad Network**: Built exclusively for Monad blockchain
- 📊 **On-Chain Verification**: All randomness is verifiable on-chain
- 🔍 **VRF Verification Tool**: Built-in UI to verify game fairness
- 🔐 **Pyth Network Ready**: Contract prepared for Pyth VRF integration

## 🚀 Hızlı Başlangıç

### 1. Kurulum

```bash
# Bağımlılıkları yükle
yarn install
```

### 2. Environment Variables

Proje root dizininde `.env.local` dosyası oluşturun:

```sh
# Monad Network
MONAD_RPC_URL=https://rpc.monad.xyz
NEXT_PUBLIC_RPC_URL=https://rpc.monad.xyz

# WalletConnect (https://cloud.walletconnect.com)
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_min_32_chars

# Private Key (SADECE DEPLOY İÇİN - GÜVENLİ TUTUN!)
PRIVATE_KEY=your_private_key_without_0x_prefix
```

### 3. Local Development

```bash
# Terminal 1: Hardhat local node
yarn blockchain

# Terminal 2: Contract deploy
yarn deploy

# Terminal 3: Development server
yarn dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

### 4. Monad Network'e Deploy

```bash
# .env.local'de PRIVATE_KEY ve MON token olmalı
yarn deploy
```

📖 **Detaylı deployment rehberi için**: [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## Monad Network Configuration

- **Chain ID**: 143 (0x8f)
- **Currency**: MON
- **RPC Endpoints**: 
  - https://rpc.monad.xyz
  - https://rpc1.monad.xyz
  - https://rpc2.monad.xyz
  - https://rpc3.monad.xyz
  - https://rpc4.monad.xyz
- **Block Explorer**: https://monad.blockscout.com

## 📚 Key Technologies

- 🌐 **Next.js 14**: React framework with App Router
- 📘 **TypeScript**: Type-safe development
- 📦 **Hardhat**: Smart contract development environment
- 🌐 **Ethers.js v6**: Ethereum library for Monad
- 🔗 **Wagmi v2**: React Hooks for Ethereum
- 🌈 **RainbowKit v2**: Wallet connection UI
- 📚 **Redux Toolkit**: State management
- 🎨 **Tailwind CSS**: Utility-first styling
- 🎲 **VRF**: Verifiable Random Functions (block.prevrandao + Pyth/Switchboard ready)

## Project Structure

```
├── contracts/          # Solidity smart contracts
├── components/         # React components
├── pages/             # Next.js pages
├── services/          # Blockchain services
├── store/             # Redux store
└── utils/             # Utility functions
```

## 🔍 Verifying Fairness

MonFair uses **Verifiable Random Functions (VRF)** to ensure fair gameplay. Every game's randomness can be independently verified:

1. **Automatic Verification**: Visit any game result page and use the VRF Verification component
2. **Manual Verification**: Use the verification utilities in `utils/vrfVerification.ts`
3. **On-Chain Verification**: Check game data directly on-chain using the contract

📖 **Full Verification Guide**: See [docs/VRF_VERIFICATION.md](./docs/VRF_VERIFICATION.md)

## Useful Links

- 🏠 [Monad Network](https://monad.xyz)
- 📖 [Monad Docs](https://docs.monad.xyz)
- 🎲 [Pyth Network](https://docs.pyth.network/)
- 🔄 [Switchboard](https://docs.switchboard.xyz/)
- ⚽ [MetaMask](https://metamask.io/)
- 💡 [Hardhat](https://hardhat.org/)
- 🔥 [Next.js](https://nextjs.org/)
- 🎅 [TypeScript](https://www.typescriptlang.org/)
- 🐻 [Solidity](https://soliditylang.org/)
