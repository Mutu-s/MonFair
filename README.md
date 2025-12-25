# MonFair - Mission X

A verifiably fair gaming platform built on **Monad** blockchain using VRF (Verifiable Random Functions) for provable randomness.

## Mission X: Verifiably Fair

MonFair is a hyper-casual gaming platform where randomness is **verifiable** and **transparent**. Every game outcome is powered by VRF technology, ensuring complete fairness that can be independently verified.

### Key Features

- 🎲 **VRF-Powered Randomness**: All games use verifiable random functions (block.prevrandao + Pyth ready)
- ✅ **Transparent Fairness**: Verify the randomness behind every outcome with built-in verification UI
- 🎮 **Multiple Game Modes**: FlipMatch card game and various casino games
- 🔗 **Monad Network**: Built exclusively for Monad blockchain
- 📊 **On-Chain Verification**: All randomness is verifiable on-chain
- 🔍 **VRF Verification Tool**: Built-in UI to verify game fairness
- 🔐 **Pyth Network Ready**: Contract prepared for Pyth VRF integration

## 🎮 How to Play

### FlipMatch - Memory Card Game

FlipMatch is a memory card matching game where players compete to match pairs of cards with the fewest flips.

#### Game Modes

**1. Player vs Player (Multi-Player)**
- Create or join a game with other players
- Each player plays the same card layout (determined by VRF)
- Complete the game by matching all card pairs
- Submit your flip count (number of card flips used)
- Winner is determined by the lowest final score (flip count + VRF modifier)
- Prize pool is distributed to the winner

**2. AI vs Player (Single Player)**
- Play against the AI opponent
- Same gameplay mechanics as multi-player
- Lower scores mean better performance
- Can play for free or with stakes

#### How to Play FlipMatch

1. **Create or Join a Game**
   - Click "Create Game" on the homepage
   - Choose game mode (Player vs Player or AI vs Player)
   - Set game parameters (name, player count, duration, optional password)
   - For wager games, set your stake amount (minimum 0.01 MON)

2. **Start Playing**
   - When the game starts, a grid of cards appears face down
   - Click cards to flip them and reveal their values
   - Match pairs of identical cards to remove them
   - Goal: Match all pairs with as few flips as possible

3. **Submit Your Score**
   - After completing the game, submit your flip count
   - Your final score = flip count + VRF modifier (ensures fairness)
   - In multi-player games, all players submit their scores
   - The player with the lowest final score wins

4. **Special Events**
   - **Lucky Flip** (5% chance): Reduces your score by 2 points
   - **Bonus Card** (10% chance): Grants a random card bonus
   - **Time Freeze** (3% chance): Adds time bonus to your score

### Casino Games

MonFair offers several casino-style games powered by VRF randomness:

#### 🪙 CoinFlip
- Choose Heads or Tails
- Each flip uses VRF for verifiable randomness
- Streak multipliers increase your potential winnings
- Can cash out early to secure your streak
- Supports multiplayer prize pools

#### 🎲 Dice
- Select a target number (1-100)
- Choose to roll under or over your target
- Adjustable difficulty affects payout multipliers
- Streak multipliers for consecutive wins
- VRF ensures every roll is provably fair

#### 🎯 Plinko
- Drop a ball from the top
- Ball bounces through pegs and lands in a multiplier slot
- Adjustable rows (more rows = higher risk/reward)
- Each drop uses VRF to determine the exact path
- Win multipliers based on final landing position

#### 🎰 Slots
- Classic slot machine gameplay
- Three reels with various symbols
- VRF determines each spin's outcome
- Different symbol combinations yield different payouts
- Bonus rounds and special symbols available

#### 🚀 Crash
- Watch the multiplier increase in real-time
- Cash out before it crashes to win
- Auto-cashout available for convenience
- Each crash point is determined by VRF
- High risk, high reward gameplay

#### 🏆 Jackpot
- Join the progressive jackpot pool
- Play casino games to contribute to the pool
- Random VRF-determined winners
- Larger prize pools mean bigger payouts

## 🔍 Verifying Fairness

MonFair uses **Verifiable Random Functions (VRF)** to ensure fair gameplay. Every game's randomness can be independently verified:

1. **Automatic Verification**: Visit any game result page and use the VRF Verification component
2. **Manual Verification**: Check the VRF data on-chain using the block explorer
3. **Transparent Process**: All randomness is generated on-chain and publicly verifiable

Each game includes:
- VRF request ID
- Random value used for the game
- Timestamp of when randomness was generated
- Full verification data accessible on-chain

## 🎯 Game Features

### Leaderboard
- Track top players across all games
- Weekly and all-time rankings
- Best scores and win statistics
- Player profiles and achievements

### Analytics
- View platform statistics
- Game popularity metrics
- Prize pool information
- Active player counts

### Game Invitations
- Invite friends to private games
- Password-protected game rooms
- Share game links easily
- Real-time game updates

## 📊 Monad Network

MonFair runs on the **Monad blockchain**:

- **Chain ID**: 143 (0x8f)
- **Currency**: MON
- **RPC Endpoints**: 
  - https://rpc.monad.xyz
  - https://rpc1.monad.xyz
  - https://rpc2.monad.xyz
  - https://rpc3.monad.xyz
  - https://rpc4.monad.xyz
- **Block Explorer**: https://monad.blockscout.com

### Getting Started

1. **Connect Your Wallet**
   - Use MetaMask or any Web3 wallet
   - Ensure you're connected to Monad network
   - Have some MON tokens for transactions and stakes

2. **Browse Games**
   - View active games on the homepage
   - Filter by game type (FlipMatch or Casino)
   - Join existing games or create your own

3. **Play & Win**
   - Play games to compete and win
   - Check results and verify fairness
   - View your game history and statistics

## 🏆 Tips for Success

### FlipMatch
- Practice memory and pattern recognition
- Try to minimize unnecessary flips
- In multi-player games, watch your opponents' progress
- Remember card positions to reduce flip count

### Casino Games
- Start with smaller bets to learn the games
- Understand odds and payout multipliers
- Use auto-cashout features for risk management
- Take advantage of streak multipliers

## 🔐 Security & Fairness

- **VRF Verification**: All randomness is verifiable on-chain
- **Transparent Contracts**: Open-source smart contracts
- **No Owner Control**: Game mechanics cannot be manipulated
- **Provably Fair**: Every outcome can be independently verified
- **Decentralized**: Runs entirely on Monad blockchain

## 📚 Technologies

Built with:
- **Next.js 14**: Modern React framework
- **TypeScript**: Type-safe development
- **Hardhat**: Smart contract development
- **Ethers.js v6**: Blockchain interactions
- **Wagmi v2**: React Hooks for Ethereum
- **RainbowKit v2**: Wallet connection UI
- **Redux Toolkit**: State management
- **Tailwind CSS**: Modern styling

## 🔗 Useful Links

- 🏠 [Monad Network](https://monad.xyz)
- 📖 [Monad Docs](https://docs.monad.xyz)
- 🎲 [Pyth Network](https://docs.pyth.network/)
- 🔄 [Switchboard](https://docs.switchboard.xyz/)
- ⚽ [MetaMask](https://metamask.io/)
- 🔍 [Block Explorer](https://monad.blockscout.com)

---

**Play Fair. Win Big. Verify Everything.** 🎮✨
