const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Parse command line arguments
    let amountStr = null;
    
    for (let i = 0; i < process.argv.length; i++) {
      if (process.argv[i].startsWith('--amount=')) {
        amountStr = process.argv[i].split('=')[1];
        break;
      }
      if (process.argv[i] === '--amount' && i + 1 < process.argv.length) {
        amountStr = process.argv[i + 1];
        break;
      }
    }
    
    if (!amountStr) {
      amountStr = process.env.AMOUNT;
    }
    
    if (!amountStr) {
      console.error('❌ Error: Amount is required');
      console.log('\nUsage:');
      console.log('  yarn hardhat run scripts/deposit-casino-treasury.js --network <network> -- --amount <AMOUNT_IN_MON>');
      console.log('  OR: AMOUNT=2 yarn hardhat run scripts/deposit-casino-treasury.js --network <network>');
      process.exit(1);
    }
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.error('❌ Error: Invalid amount. Must be a positive number.');
      process.exit(1);
    }
    
    // Get network info
    const network = await hre.ethers.provider.getNetwork();
    const chainId = Number(network.chainId);
    const isTestnet = chainId === 10143;
    const networkType = isTestnet ? 'testnet' : 'mainnet';
    
    console.log(`\n💰 Depositing to Casino Treasury on ${networkType.toUpperCase()} (Chain ID: ${chainId})...\n`);
    
    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log(`👤 Deployer Address: ${deployer.address}`);
    
    // Check deployer balance
    const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
    const deployerBalanceFormatted = hre.ethers.formatEther(deployerBalance);
    console.log(`💼 Deployer Balance: ${deployerBalanceFormatted} MON`);
    
    // Read contract addresses
    const contractAddressPath = path.join(__dirname, '../contracts/contractAddress.json');
    let addresses = {};
    
    if (fs.existsSync(contractAddressPath)) {
      try {
        addresses = JSON.parse(fs.readFileSync(contractAddressPath, 'utf8'));
      } catch (e) {
        console.error('Could not parse contractAddress.json');
        process.exit(1);
      }
    }
    
    const treasuryAddress = addresses[networkType]?.casinoTreasury;
    
    if (!treasuryAddress) {
      console.error(`❌ CasinoTreasury address not found for ${networkType}`);
      console.log('   Please deploy casino contracts first: yarn hardhat run scripts/deploy-casino.js --network <network>');
      process.exit(1);
    }
    
    console.log(`📋 CasinoTreasury Contract: ${treasuryAddress}\n`);
    
    // Get CasinoTreasury contract
    const CasinoTreasury = await hre.ethers.getContractFactory('CasinoTreasury');
    const treasury = CasinoTreasury.attach(treasuryAddress);
    
    // Check if deployer is owner
    const owner = await treasury.owner();
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.error(`❌ Error: Deployer address (${deployer.address}) is not the contract owner!`);
      console.log(`   Contract owner: ${owner}`);
      process.exit(1);
    }
    
    // Get current treasury balance
    const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'; // Native MON
    const currentBalance = await treasury.getBalance(TOKEN_ADDRESS);
    const currentBalanceFormatted = hre.ethers.formatEther(currentBalance);
    console.log(`🏦 Current Treasury Balance: ${currentBalanceFormatted} MON`);
    
    // Convert amount to wei
    const amountWei = hre.ethers.parseEther(amount.toString());
    
    // Check if deployer has enough balance (including gas)
    const gasReserve = hre.ethers.parseEther('0.01'); // Reserve 0.01 MON for gas
    if (deployerBalance < amountWei + gasReserve) {
      console.error(`❌ Error: Insufficient balance!`);
      console.log(`   Required: ${hre.ethers.formatEther(amountWei + gasReserve)} MON (${amount} MON + 0.01 MON gas)`);
      console.log(`   Available: ${deployerBalanceFormatted} MON`);
      process.exit(1);
    }
    
    console.log(`\n💸 Depositing: ${amount} MON`);
    console.log(`   Amount in Wei: ${amountWei.toString()}\n`);
    
    // Deposit to treasury
    console.log('📤 Sending transaction...');
    const tx = await treasury.deposit(TOKEN_ADDRESS, amountWei, {
      value: amountWei,
    });
    
    console.log(`⏳ Transaction Hash: ${tx.hash}`);
    console.log('⏳ Waiting for confirmation...\n');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}\n`);
    
    // Get updated treasury balance
    const newBalance = await treasury.getBalance(TOKEN_ADDRESS);
    const newBalanceFormatted = hre.ethers.formatEther(newBalance);
    
    console.log('📊 Updated Balance:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏦 Treasury Balance: ${newBalanceFormatted} MON`);
    console.log(`   (Increased by ${amount} MON)\n`);
    
    // Explorer link
    const explorerBase = isTestnet 
      ? 'https://testnet.monadvision.com'
      : 'https://monad.blockscout.com';
    
    console.log(`🔗 Transaction: ${explorerBase}/tx/${tx.hash}`);
    console.log(`🔗 Contract: ${explorerBase}/address/${treasuryAddress}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
    console.log('\n⚠️  Make sure:');
    console.log('1. You are the contract owner');
    console.log('2. You have sufficient balance (amount + gas)');
    console.log('3. You are connected to the correct network');
    console.log('4. Casino contracts are deployed');
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


