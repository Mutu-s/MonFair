const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const isTestnet = chainId === 10143;
  const networkType = isTestnet ? 'testnet' : 'mainnet';
  
  console.log(`\n🌐 Deploying to ${networkType.toUpperCase()} (Chain ID: ${chainId})\n`);

  // Read contract addresses
  const contractAddressPath = path.join(__dirname, '../contracts/contractAddress.json');
  let addresses = {};
  
  if (fs.existsSync(contractAddressPath)) {
    try {
      addresses = JSON.parse(fs.readFileSync(contractAddressPath, 'utf8'));
    } catch (e) {
      console.warn('Could not parse existing contractAddress.json, creating new structure');
    }
  }
  
  // Initialize network structure if needed
  if (!addresses.mainnet) {
    addresses.mainnet = { flipmatchContract: '', casinoTreasury: '', casinoGames: {} };
  }
  if (!addresses.testnet) {
    addresses.testnet = { flipmatchContract: '', casinoTreasury: '', casinoGames: {} };
  }
  
  // Backward compatibility: migrate old format
  if (addresses.casinoTreasury && !addresses.mainnet.casinoTreasury) {
    addresses.mainnet.casinoTreasury = addresses.casinoTreasury;
  }
  if (addresses.casinoGames && !addresses.mainnet.casinoGames) {
    addresses.mainnet.casinoGames = addresses.casinoGames;
  }

  // Deploy CasinoTreasury first
  console.log('\n=== Deploying CasinoTreasury ===');
  const CasinoTreasury = await hre.ethers.getContractFactory('CasinoTreasury');
  const treasury = await CasinoTreasury.deploy(deployer.address);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log('CasinoTreasury deployed to:', treasuryAddress);
  addresses[networkType].casinoTreasury = treasuryAddress;

  // Use native MON token (address(0))
  const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
  console.log('\n✅ Using native MON token (address(0))');

  // Get Pyth VRF address
  let PYTH_VRF_ADDRESS = process.env.PYTH_VRF_ADDRESS || process.env.NEXT_PUBLIC_PYTH_VRF_ADDRESS;
  
  if (!PYTH_VRF_ADDRESS) {
    // Try to get Mock VRF from contractAddress.json
    try {
      if (addresses[networkType] && addresses[networkType].mockPythVRF) {
        PYTH_VRF_ADDRESS = addresses[networkType].mockPythVRF;
        console.log('✅ Using Mock Pyth VRF from contractAddress.json:', PYTH_VRF_ADDRESS);
      }
    } catch (error) {
      console.warn('Could not read Mock VRF from contractAddress.json:', error.message);
    }
  }
  
  if (!PYTH_VRF_ADDRESS) {
    console.warn('⚠️  WARNING: PYTH_VRF_ADDRESS not set. Deploying Mock VRF first...');
    const MockPythVRF = await hre.ethers.getContractFactory('MockPythVRF');
    const mockVRF = await MockPythVRF.deploy();
    await mockVRF.waitForDeployment();
    PYTH_VRF_ADDRESS = await mockVRF.getAddress();
    console.log('✅ Mock Pyth VRF deployed to:', PYTH_VRF_ADDRESS);
    if (!addresses[networkType]) {
      addresses[networkType] = {};
    }
    addresses[networkType].mockPythVRF = PYTH_VRF_ADDRESS;
  }
  
  console.log('🔮 Pyth VRF Address:', PYTH_VRF_ADDRESS);

  // Deploy Casino Games
  const games = [
    { name: 'CoinFlip', contract: 'CoinFlip' },
    { name: 'Dice', contract: 'Dice' },
    { name: 'Plinko', contract: 'Plinko' },
    { name: 'Crash', contract: 'Crash' },
    { name: 'Slots', contract: 'Slots' },
  ];

  const gameAddresses = {};

  for (const game of games) {
    console.log(`\n=== Deploying ${game.name} ===`);
    try {
      const GameContract = await hre.ethers.getContractFactory(game.contract);
      const gameInstance = await GameContract.deploy(deployer.address, TOKEN_ADDRESS, PYTH_VRF_ADDRESS);
      await gameInstance.waitForDeployment();
      const gameAddress = await gameInstance.getAddress();
      console.log(`${game.name} deployed to:`, gameAddress);
      gameAddresses[game.name] = gameAddress;

      // Initialize game with default config
      const minBet = hre.ethers.parseEther('0.01'); // 0.01 MON
      const maxBet = hre.ethers.parseEther('100'); // 100 MON
      const houseEdgeBps = 250; // 2.5%

      console.log(`Initializing ${game.name}...`);
      const initTx = await gameInstance.initialize(treasuryAddress, minBet, maxBet, houseEdgeBps);
      await initTx.wait();
      console.log(`${game.name} initialized`);

      // Authorize game in treasury
      console.log(`Authorizing ${game.name} in treasury...`);
      const authTx = await treasury.authorizeGame(gameAddress);
      await authTx.wait();
      console.log(`${game.name} authorized in treasury`);
    } catch (error) {
      console.error(`Error deploying ${game.name}:`, error.message);
    }
  }

  // Deploy Jackpot
  console.log('\n=== Deploying Jackpot ===');
  try {
    const Jackpot = await hre.ethers.getContractFactory('Jackpot');
    const jackpot = await Jackpot.deploy(deployer.address, TOKEN_ADDRESS, PYTH_VRF_ADDRESS);
    await jackpot.waitForDeployment();
    const jackpotAddress = await jackpot.getAddress();
    console.log('Jackpot deployed to:', jackpotAddress);
    gameAddresses.Jackpot = jackpotAddress;
    
    // Initialize Jackpot (if initialize function exists)
    try {
      const rakeBps = 500; // 5% rake
      console.log('Initializing Jackpot...');
      const jackpotInitTx = await jackpot.initialize(rakeBps);
      await jackpotInitTx.wait();
      console.log('Jackpot initialized');
    } catch (error) {
      console.warn('Jackpot initialize not available or already initialized:', error.message);
    }
    
    // Authorize Jackpot in treasury
    console.log('Authorizing Jackpot in treasury...');
    const jackpotAuthTx = await treasury.authorizeGame(jackpotAddress);
    await jackpotAuthTx.wait();
    console.log('Jackpot authorized in treasury');
  } catch (error) {
    console.error('Error deploying Jackpot:', error.message);
  }

  // Save addresses to appropriate network
  addresses[networkType].casinoGames = gameAddresses;
  
  fs.writeFileSync(contractAddressPath, JSON.stringify(addresses, null, 2));
  console.log(`\n✅ Contract addresses saved to ${networkType} in:`, contractAddressPath);

  console.log('\n=== Deployment Summary ===');
  console.log('CasinoTreasury:', treasuryAddress);
  console.log('Games:', JSON.stringify(gameAddresses, null, 2));
  console.log('\n⚠️  Remember to fund the treasury with tokens before games can pay out!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
