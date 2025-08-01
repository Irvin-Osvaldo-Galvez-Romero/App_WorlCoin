import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'receive':
        return '↓';
      case 'send':
        return '↑';
      case 'swap':
        return '↔';
      default:
        return '•';
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'receive':
        return '#4CAF50';
      case 'send':
        return '#F44336';
      case 'swap':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const formatAmount = (amount: number) => {
    return `${transaction.type === 'send' ? '-' : '+'}${amount.toFixed(4)} WLD`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: getTransactionColor() }]}>
            {getTransactionIcon()}
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.type}>
              {transaction.type === 'receive' ? 'Recibido' : 
               transaction.type === 'send' ? 'Enviado' : 'Intercambio'}
            </Text>
            <Text style={[styles.amount, { color: getTransactionColor() }]}>
              {formatAmount(transaction.amount)}
            </Text>
          </View>
          
          <View style={styles.details}>
            <Text style={styles.date}>{formatDate(transaction.timestamp)}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.status, { color: getStatusColor() }]}>
                {transaction.status === 'confirmed' ? 'Confirmado' :
                 transaction.status === 'pending' ? 'Pendiente' : 'Fallido'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.hash}>{formatHash(transaction.hash)}</Text>
          
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Fee:</Text>
            <Text style={styles.fee}>{transaction.fee.toFixed(6)} WLD</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  hash: {
    fontSize: 11,
    color: '#808080',
    marginBottom: 4,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginRight: 4,
  },
  fee: {
    fontSize: 12,
    color: '#FFFFFF',
  },
}); 