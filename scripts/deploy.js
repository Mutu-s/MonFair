const hre = require('hardhat')
const fs = require('fs')

async function main() {
  try {
    // Get signers
    const signers = await hre.ethers.getSigners()
    
    if (!signers || signers.length === 0) {
      throw new Error('No signers available. Please check your network configuration and PRIVATE_KEY in .env.local')
    }
    
    const deployer = signers[0]
    
    console.log('Deploying contracts with account:', deployer.address)
    
    const balance = await hre.ethers.provider.getBalance(deployer.address)
    console.log('Account balance:', hre.ethers.formatEther(balance), 'ETH')

    // Check if balance is sufficient
    if (balance === 0n) {
      console.warn('Warning: Account balance is 0. Make sure you have MON tokens for deployment.')
    }

    // Get the contract factory (Mission X version)
    console.log('Getting contract factory...')
    const FlipMatch = await hre.ethers.getContractFactory('contracts/FlipMatch.sol:FlipMatch')
    
    // AI address (immutable, set in constructor)
    const AI_ADDRESS = '0x1111111111111111111111111111111111111111'
    
    // Pyth VRF address (MANDATORY for Mission X)
    // Priority: 1) Environment variable, 2) Mock VRF from contractAddress.json, 3) Placeholder
    let PYTH_VRF_ADDRESS = process.env.PYTH_VRF_ADDRESS || process.env.NEXT_PUBLIC_PYTH_VRF_ADDRESS
    
    if (!PYTH_VRF_ADDRESS) {
      // Try to get Mock VRF from contractAddress.json
      try {
        const contractAddressPath = './contracts/contractAddress.json'
        if (fs.existsSync(contractAddressPath)) {
          const contractAddresses = JSON.parse(fs.readFileSync(contractAddressPath, 'utf8'))
          const networkKey = hre.network.name === 'monad-testnet' ? 'testnet' : 'mainnet'
          if (contractAddresses[networkKey] && contractAddresses[networkKey].mockPythVRF) {
            PYTH_VRF_ADDRESS = contractAddresses[networkKey].mockPythVRF
            console.log('✅ Using Mock Pyth VRF from contractAddress.json:', PYTH_VRF_ADDRESS)
          }
        }
      } catch (error) {
        console.warn('Could not read contractAddress.json for Mock VRF:', error.message)
      }
    }
    
    if (!PYTH_VRF_ADDRESS) {
      console.warn('⚠️  WARNING: PYTH_VRF_ADDRESS not set in .env.local and no Mock VRF found')
      console.warn('⚠️  Using placeholder address for deployment (contract will need real VRF to work)')
      console.warn('⚠️  For production, add: PYTH_VRF_ADDRESS=0x... to .env.local')
      console.warn('⚠️  Or deploy Mock VRF first: yarn hardhat run scripts/deploy-mock-vrf.js --network <network>')
      // Placeholder address (different from AI_ADDRESS)
      PYTH_VRF_ADDRESS = '0x2222222222222222222222222222222222222222'
    }
    
    // Deploy the contract
    console.log('Deploying FlipMatch Mission X contract...')
    console.log('AI Address:', AI_ADDRESS)
    console.log('Pyth VRF Address:', PYTH_VRF_ADDRESS)
    const deployOptions = {}
    
    // For testnet, use appropriate gas settings
    if (hre.network.name === 'monad-testnet') {
      // Try to get current gas price and add 20% buffer
      try {
        const feeData = await hre.ethers.provider.getFeeData()
        if (feeData.gasPrice) {
          deployOptions.gasPrice = feeData.gasPrice * 120n / 100n // 20% buffer
          console.log('Using gas price:', hre.ethers.formatUnits(deployOptions.gasPrice, 'gwei'), 'gwei')
        }
      } catch (e) {
        console.warn('Could not get fee data, using default')
      }
    }
    
    const contract = await FlipMatch.deploy(AI_ADDRESS, PYTH_VRF_ADDRESS, deployOptions)
    console.log('Waiting for deployment confirmation...')
    await contract.waitForDeployment()

    const address = await contract.getAddress()
    console.log('FlipMatch contract deployed successfully!')
    console.log('Contract address:', address)
    
    // Get network info
    const network = await hre.ethers.provider.getNetwork()
    const chainId = Number(network.chainId)
    const isTestnet = chainId === 10143
    const networkType = isTestnet ? 'testnet' : 'mainnet'
    
    console.log(`Deploying to ${networkType} (Chain ID: ${chainId})`)

    // Read existing addresses or create new structure
    let addressData = {}
    const addressPath = './contracts/contractAddress.json'
    if (fs.existsSync(addressPath)) {
      try {
        addressData = JSON.parse(fs.readFileSync(addressPath, 'utf8'))
      } catch (e) {
        console.warn('Could not parse existing contractAddress.json, creating new structure')
      }
    }
    
    // Initialize network structure if needed
    if (!addressData.mainnet) {
      addressData.mainnet = { flipmatchContract: '', casinoTreasury: '', casinoGames: {} }
    }
    if (!addressData.testnet) {
      addressData.testnet = { flipmatchContract: '', casinoTreasury: '', casinoGames: {} }
    }
    
    // Save contract address to appropriate network
    addressData[networkType].flipmatchContract = address
    
    // Backward compatibility: if old format exists, preserve it
    if (addressData.flipmatchContract && !addressData.mainnet.flipmatchContract) {
      addressData.mainnet.flipmatchContract = addressData.flipmatchContract
    }

    fs.writeFileSync(addressPath, JSON.stringify(addressData, null, 2), 'utf8')
    console.log(`Contract address saved to contracts/contractAddress.json (${networkType})`)

    // Wait for block confirmations on real networks
    if (hre.network.name !== 'hardhat') {
      console.log('Waiting for block confirmations...')
      const deploymentTx = contract.deploymentTransaction()
      if (deploymentTx) {
        await deploymentTx.wait(3)
        console.log('Deployment confirmed!')
      }
    }

    console.log('Contract deployment completed successfully!')
  } catch (error) {
    console.error('Error deploying contract:', error.message)
    if (error.message.includes('signers')) {
      console.error('\nTroubleshooting:')
      console.error('1. Make sure PRIVATE_KEY is set in .env.local')
      console.error('2. Make sure MONAD_RPC_URL is set in .env.local')
      console.error('3. Make sure your account has MON tokens')
      console.error('4. Make sure PYTH_VRF_ADDRESS is set in .env.local')
      console.error('5. For local testing, use: yarn deploy (uses hardhat network)')
    }
    if (error.message.includes('PYTH_VRF_ADDRESS')) {
      console.error('\nPyth VRF Setup:')
      console.error('1. Get Pyth VRF contract address')
      console.error('2. Add to .env.local: PYTH_VRF_ADDRESS=0x...')
      console.error('3. Same address can be used for both mainnet and testnet')
    }
    process.exitCode = 1
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
