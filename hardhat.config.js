require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

// Monad Mainnet RPC endpoints with failover support
const MONAD_RPC_URLS = [
  process.env.MONAD_RPC_URL_1 || 'https://rpc3.monad.xyz',
  process.env.MONAD_RPC_URL_2 || 'https://monad-mainnet.api.onfinality.io/public',
  process.env.MONAD_RPC_URL_3 || 'https://rpc2.monad.xyz',
  process.env.MONAD_RPC_URL_4 || 'https://monad-mainnet-rpc.spidernode.net',
];

// Monad Testnet RPC endpoints with failover support
const MONAD_TESTNET_RPC_URLS = [
  process.env.MONAD_TESTNET_RPC_URL_1 || 'https://testnet-rpc.monad.xyz',
  process.env.MONAD_TESTNET_RPC_URL_2 || 'https://rpc-testnet.monadinfra.com',
];

// Primary RPC (default to first)
const PRIMARY_RPC = process.env.MONAD_RPC_URL || MONAD_RPC_URLS[0];
const PRIMARY_TESTNET_RPC = process.env.MONAD_TESTNET_RPC_URL || MONAD_TESTNET_RPC_URLS[0];

module.exports = {
  defaultNetwork: 'monad',
  networks: {
    hardhat: {
      chainId: 143,
      // Fork Monad mainnet for testing
      forking: process.env.FORK_MONAD === 'true' ? {
        url: PRIMARY_RPC,
        blockNumber: process.env.FORK_BLOCK_NUMBER ? parseInt(process.env.FORK_BLOCK_NUMBER) : undefined,
      } : undefined,
    },
    monad: {
      url: PRIMARY_RPC,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 143,
      timeout: 120000,
      // Additional RPC endpoints for failover (used by external tools)
      rpcUrls: MONAD_RPC_URLS,
    },
    'monad-testnet': {
      url: PRIMARY_TESTNET_RPC,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 10143,
      timeout: 120000,
      // Additional RPC endpoints for failover (used by external tools)
      rpcUrls: MONAD_TESTNET_RPC_URLS,
    },
    // Alternative network configs for testing different RPC endpoints
    'monad-rpc1': {
      url: MONAD_RPC_URLS[0],
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 143,
      timeout: 120000,
    },
    'monad-rpc2': {
      url: MONAD_RPC_URLS[1],
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 143,
      timeout: 120000,
    },
  },
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for gas efficiency on Monad high-throughput EVM
      },
      viaIR: true, // Enable IR-based code generation for better optimization
      evmVersion: 'paris', // Use Paris EVM version (compatible with Monad)
    },
    // Compile both FlipMatch and Casino contracts
    sources: {
      'contracts/FlipMatch_MissionX.sol': {},
      'contracts/FlipMatch.sol': {},
      'contracts/casino/**/*.sol': {},
    },
  },
  mocha: {
    timeout: 40000,
  },
  // Gas reporting
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD',
    gasPrice: 1, // 1 gwei (adjust based on Monad network)
  },
  // Contract verification
  etherscan: {
    apiKey: {
      monad: process.env.MONAD_EXPLORER_API_KEY || '',
    },
    customChains: [
      {
        network: 'monad',
        chainId: 143,
        urls: {
          apiURL: 'https://monad.blockscout.com/api',
          browserURL: 'https://monad.blockscout.com',
        },
      },
      {
        network: 'monad-testnet',
        chainId: 10143,
        urls: {
          apiURL: 'https://monad-testnet.blockscout.com/api',
          browserURL: 'https://monad-testnet.blockscout.com',
        },
      },
    ],
  },
}
