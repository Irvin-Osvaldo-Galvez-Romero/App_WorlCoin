import { useState, useEffect } from 'react';
import { worldAppService } from '../services/api';
import { UserWallet, Transaction, Reward } from '../types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const address = await worldAppService.connectWallet();
      const transactions = await worldAppService.getTransactions(address);
      const rewards = await worldAppService.getRewards(address);
      
      const balance = transactions.reduce((total, tx) => {
        if (tx.type === 'receive') return total + tx.amount;
        if (tx.type === 'send') return total - tx.amount;
        return total;
      }, 0);

      const userWallet: UserWallet = {
        address,
        balance,
        transactions,
        rewards,
      };

      setWallet(userWallet);
    } catch (err) {
      setError('Error al conectar wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWallet = async () => {
    if (wallet) {
      try {
        const transactions = await worldAppService.getTransactions(wallet.address);
        const rewards = await worldAppService.getRewards(wallet.address);
        
        const balance = transactions.reduce((total, tx) => {
          if (tx.type === 'receive') return total + tx.amount;
          if (tx.type === 'send') return total - tx.amount;
          return total;
        }, 0);

        setWallet({
          ...wallet,
          balance,
          transactions,
          rewards,
        });
      } catch (err) {
        console.error('Error refreshing wallet:', err);
      }
    }
  };

  const getTotalFees = (): number => {
    if (!wallet) return 0;
    return wallet.transactions.reduce((total, tx) => total + tx.fee, 0);
  };

  const getTotalRewards = (): number => {
    if (!wallet) return 0;
    return wallet.rewards.reduce((total, reward) => total + reward.amount, 0);
  };

  const getClaimedRewards = (): number => {
    if (!wallet) return 0;
    return wallet.rewards
      .filter(reward => reward.claimed)
      .reduce((total, reward) => total + reward.amount, 0);
  };

  const getPendingRewards = (): number => {
    if (!wallet) return 0;
    return wallet.rewards
      .filter(reward => !reward.claimed)
      .reduce((total, reward) => total + reward.amount, 0);
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    if (!wallet) return [];
    return wallet.transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  const getTransactionsByType = (type: 'send' | 'receive' | 'swap'): Transaction[] => {
    if (!wallet) return [];
    return wallet.transactions.filter(tx => tx.type === type);
  };

  const getRewardsByType = (type: 'daily' | 'weekly' | 'referral' | 'activity'): Reward[] => {
    if (!wallet) return [];
    return wallet.rewards.filter(reward => reward.type === type);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return {
    wallet,
    loading,
    error,
    connectWallet,
    refreshWallet,
    getTotalFees,
    getTotalRewards,
    getClaimedRewards,
    getPendingRewards,
    getRecentTransactions,
    getTransactionsByType,
    getRewardsByType,
  };
}; 