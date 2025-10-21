/**
 * Wallet Utility Functions
 * Advanced validation, analysis and formatting utilities for Solana wallets
 */

import { PublicKey } from '@solana/web3.js';

export interface WalletMetrics {
  totalTransactions: number;
  avgTransactionSize: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface WalletRiskScore {
  score: number;
  category: 'low' | 'medium' | 'high' | 'extreme';
  factors: {
    volumeSpike: boolean;
    unusualActivity: boolean;
    highFrequency: boolean;
    largePositions: boolean;
  };
}

/**
 * Validates if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey);
  } catch {
    return false;
  }
}

/**
 * Formats wallet address for display
 */
export function formatWalletAddress(address: string, chars: number = 4): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Calculates wallet performance metrics
 */
export function calculateWalletMetrics(transactions: any[]): WalletMetrics {
  const profits = transactions
    .filter(tx => tx.type === 'sell')
    .map(tx => tx.profit || 0);
  
  const winningTrades = profits.filter(p => p > 0).length;
  const losingTrades = profits.filter(p => p < 0).length;
  
  const totalProfit = profits.reduce((sum, p) => sum + p, 0);
  const totalLoss = profits.filter(p => p < 0).reduce((sum, p) => sum + Math.abs(p), 0);
  
  return {
    totalTransactions: transactions.length,
    avgTransactionSize: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / transactions.length,
    winRate: winningTrades / (winningTrades + losingTrades) || 0,
    profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit,
    sharpeRatio: calculateSharpeRatio(profits),
    maxDrawdown: calculateMaxDrawdown(profits)
  };
}

/**
 * Calculates Sharpe ratio for risk-adjusted returns
 */
function calculateSharpeRatio(returns: number[]): number {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev > 0 ? avgReturn / stdDev : 0;
}

/**
 * Calculates maximum drawdown from peak
 */
function calculateMaxDrawdown(profits: number[]): number {
  if (profits.length === 0) return 0;
  
  let peak = 0;
  let maxDrawdown = 0;
  let runningTotal = 0;
  
  for (const profit of profits) {
    runningTotal += profit;
    if (runningTotal > peak) {
      peak = runningTotal;
    }
    const drawdown = (peak - runningTotal) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}

/**
 * Analyzes wallet behavior for risk scoring
 */
export function analyzeWalletRisk(
  wallet: string,
  recentActivity: any[]
): WalletRiskScore {
  const volumeThreshold = 1000000; // $1M USD
  const frequencyThreshold = 100; // transactions per hour
  
  const totalVolume = recentActivity.reduce((sum, a) => sum + (a.volume || 0), 0);
  const txFrequency = recentActivity.length;
  
  const factors = {
    volumeSpike: totalVolume > volumeThreshold,
    unusualActivity: detectUnusualPatterns(recentActivity),
    highFrequency: txFrequency > frequencyThreshold,
    largePositions: recentActivity.some(a => a.amount > volumeThreshold / 10)
  };
  
  const riskFactorCount = Object.values(factors).filter(Boolean).length;
  
  let score = riskFactorCount * 25;
  let category: WalletRiskScore['category'] = 'low';
  
  if (score >= 75) category = 'extreme';
  else if (score >= 50) category = 'high';
  else if (score >= 25) category = 'medium';
  
  return { score, category, factors };
}

/**
 * Detects unusual trading patterns
 */
function detectUnusualPatterns(activity: any[]): boolean {
  // Implement pattern detection logic
  const timestamps = activity.map(a => a.timestamp).sort();
  
  // Check for rapid-fire transactions
  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i] - timestamps[i-1] < 1000) { // Less than 1 second apart
      return true;
    }
  }
  
  // Check for round number patterns
  const amounts = activity.map(a => a.amount);
  const roundNumbers = amounts.filter(a => a % 100 === 0);
  if (roundNumbers.length / amounts.length > 0.8) {
    return true;
  }
  
  return false;
}

/**
 * Groups wallets by trading similarity
 */
export function clusterWalletsByBehavior(wallets: string[], activities: Map<string, any[]>): Map<string, string[]> {
  const clusters = new Map<string, string[]>();
  
  // Simple clustering based on trading patterns
  for (const wallet of wallets) {
    const activity = activities.get(wallet) || [];
    const metrics = calculateWalletMetrics(activity);
    
    // Determine cluster based on win rate and profit factor
    let clusterKey = 'unknown';
    if (metrics.winRate > 0.7 && metrics.profitFactor > 2) {
      clusterKey = 'high-performers';
    } else if (metrics.winRate > 0.5) {
      clusterKey = 'moderate-performers';
    } else {
      clusterKey = 'low-performers';
    }
    
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(wallet);
  }
  
  return clusters;
}

/**
 * Estimates wallet's trading strategy
 */
export function identifyTradingStrategy(transactions: any[]): string {
  const holdTimes = calculateHoldTimes(transactions);
  const avgHoldTime = holdTimes.reduce((sum, t) => sum + t, 0) / holdTimes.length;
  
  if (avgHoldTime < 3600000) { // Less than 1 hour
    return 'scalper';
  } else if (avgHoldTime < 86400000) { // Less than 1 day
    return 'day-trader';
  } else if (avgHoldTime < 604800000) { // Less than 1 week
    return 'swing-trader';
  } else {
    return 'position-trader';
  }
}

/**
 * Calculates holding times between buy and sell
 */
function calculateHoldTimes(transactions: any[]): number[] {
  const holdTimes: number[] = [];
  const openPositions = new Map<string, number>();
  
  for (const tx of transactions) {
    if (tx.type === 'buy') {
      openPositions.set(tx.token, tx.timestamp);
    } else if (tx.type === 'sell' && openPositions.has(tx.token)) {
      const buyTime = openPositions.get(tx.token)!;
      holdTimes.push(tx.timestamp - buyTime);
      openPositions.delete(tx.token);
    }
  }
  
  return holdTimes;
}

export default {
  isValidSolanaAddress,
  formatWalletAddress,
  calculateWalletMetrics,
  analyzeWalletRisk,
  clusterWalletsByBehavior,
  identifyTradingStrategy
};
