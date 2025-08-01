import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WLDToken } from '../types';

interface PriceCardProps {
  token: WLDToken;
  onPress?: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({ token, onPress }) => {
  const isPositive = token.priceChangePercentage24h >= 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    return `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    }
    return formatPrice(marketCap);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{token.name}</Text>
            <Text style={styles.tokenSymbol}>{token.symbol}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{formatPrice(token.currentPrice)}</Text>
            <View style={[styles.changeContainer, { backgroundColor: isPositive ? '#4CAF50' : '#F44336' }]}>
              <Text style={styles.changeText}>{formatPercentage(token.priceChangePercentage24h)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>{formatMarketCap(token.marketCap)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>24h Volume</Text>
            <Text style={styles.statValue}>{formatMarketCap(token.volume24h)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Circulating</Text>
            <Text style={styles.statValue}>{token.circulatingSupply.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tokenSymbol: {
    fontSize: 14,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 