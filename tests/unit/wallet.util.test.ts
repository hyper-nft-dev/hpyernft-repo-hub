/**
 * Unit tests for wallet utility functions
 */

import {
  isValidSolanaAddress,
  formatWalletAddress,
  calculateWalletMetrics,
  analyzeWalletRisk,
  clusterWalletsByBehavior,
  identifyTradingStrategy
} from '../../src/utils/wallet.util';

describe('Wallet Utilities', () => {
  describe('isValidSolanaAddress', () => {
    it('should validate correct Solana addresses', () => {
      const validAddress = '7VJsBtJzgTftYzEeooSDYyjKXvYRWJHdwvdfwpz8NLR6';
      expect(isValidSolanaAddress(validAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidSolanaAddress('invalid')).toBe(false);
      expect(isValidSolanaAddress('')).toBe(false);
      expect(isValidSolanaAddress('0x123')).toBe(false);
    });
  });

  describe('formatWalletAddress', () => {
    it('should format addresses correctly', () => {
      const address = '7VJsBtJzgTftYzEeooSDYyjKXvYRWJHdwvdfwpz8NLR6';
      expect(formatWalletAddress(address)).toBe('7VJs...NLR6');
      expect(formatWalletAddress(address, 6)).toBe('7VJsBt...z8NLR6');
    });

    it('should handle edge cases', () => {
      expect(formatWalletAddress('')).toBe('');
      expect(formatWalletAddress('short')).toBe('short');
    });
  });

  describe('calculateWalletMetrics', () => {
    it('should calculate metrics correctly', () => {
      const transactions = [
        { type: 'buy', amount: 1000, timestamp: 1000 },
        { type: 'sell', amount: 1200, profit: 200, timestamp: 2000 },
        { type: 'buy', amount: 2000, timestamp: 3000 },
        { type: 'sell', amount: 1800, profit: -200, timestamp: 4000 }
      ];

      const metrics = calculateWalletMetrics(transactions);
      
      expect(metrics.totalTransactions).toBe(4);
      expect(metrics.avgTransactionSize).toBe(1500);
      expect(metrics.winRate).toBe(0.5);
      expect(metrics.profitFactor).toBe(1);
    });

    it('should handle empty transactions', () => {
      const metrics = calculateWalletMetrics([]);
      
      expect(metrics.totalTransactions).toBe(0);
      expect(metrics.winRate).toBe(0);
      expect(metrics.profitFactor).toBe(0);
    });
  });

  describe('analyzeWalletRisk', () => {
    it('should identify high-risk wallets', () => {
      const recentActivity = Array(150).fill({
        volume: 10000,
        amount: 200000,
        timestamp: Date.now()
      });

      const risk = analyzeWalletRisk('wallet1', recentActivity);
      
      expect(risk.category).toBe('high');
      expect(risk.factors.highFrequency).toBe(true);
      expect(risk.factors.largePositions).toBe(true);
    });

    it('should identify low-risk wallets', () => {
      const recentActivity = [
        { volume: 100, amount: 50, timestamp: Date.now() },
        { volume: 200, amount: 100, timestamp: Date.now() + 10000 }
      ];

      const risk = analyzeWalletRisk('wallet2', recentActivity);
      
      expect(risk.category).toBe('low');
      expect(risk.factors.volumeSpike).toBe(false);
      expect(risk.factors.highFrequency).toBe(false);
    });
  });

  describe('identifyTradingStrategy', () => {
    it('should identify scalpers', () => {
      const transactions = [
        { type: 'buy', token: 'TOKEN1', timestamp: 1000 },
        { type: 'sell', token: 'TOKEN1', timestamp: 1000 + 1800000 } // 30 minutes
      ];

      const strategy = identifyTradingStrategy(transactions);
      expect(strategy).toBe('scalper');
    });

    it('should identify day traders', () => {
      const transactions = [
        { type: 'buy', token: 'TOKEN1', timestamp: 1000 },
        { type: 'sell', token: 'TOKEN1', timestamp: 1000 + 14400000 } // 4 hours
      ];

      const strategy = identifyTradingStrategy(transactions);
      expect(strategy).toBe('day-trader');
    });

    it('should identify swing traders', () => {
      const transactions = [
        { type: 'buy', token: 'TOKEN1', timestamp: 1000 },
        { type: 'sell', token: 'TOKEN1', timestamp: 1000 + 259200000 } // 3 days
      ];

      const strategy = identifyTradingStrategy(transactions);
      expect(strategy).toBe('swing-trader');
    });
  });

  describe('clusterWalletsByBehavior', () => {
    it('should cluster wallets correctly', () => {
      const wallets = ['wallet1', 'wallet2', 'wallet3'];
      const activities = new Map([
        ['wallet1', [
          { type: 'sell', profit: 1000 },
          { type: 'sell', profit: 500 },
          { type: 'sell', profit: -100 }
        ]],
        ['wallet2', [
          { type: 'sell', profit: -500 },
          { type: 'sell', profit: -300 }
        ]],
        ['wallet3', [
          { type: 'sell', profit: 100 },
          { type: 'sell', profit: 50 }
        ]]
      ]);

      const clusters = clusterWalletsByBehavior(wallets, activities);
      
      expect(clusters.has('high-performers')).toBe(true);
      expect(clusters.has('low-performers')).toBe(true);
      expect(clusters.get('high-performers')).toContain('wallet1');
    });
  });
});
