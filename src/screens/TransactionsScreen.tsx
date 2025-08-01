import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionItem } from '../components/TransactionItem';
import { worldAppService } from '../services/api';
import { Transaction } from '../types';

export const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      // Conectar wallet si no está conectada
      if (!walletAddress) {
        const address = await worldAppService.connectWallet();
        setWalletAddress(address);
      }
      
      // Obtener transacciones
      const txs = await worldAppService.getTransactions(walletAddress || '');
      setTransactions(txs);
      
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'No se pudieron cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      'Detalles de Transacción',
      `Hash: ${transaction.hash}\nCantidad: ${transaction.amount} WLD\nFee: ${transaction.fee} WLD\nEstado: ${transaction.status}`,
      [{ text: 'OK' }]
    );
  };

  const getTotalBalance = () => {
    return transactions.reduce((total, tx) => {
      if (tx.type === 'receive') return total + tx.amount;
      if (tx.type === 'send') return total - tx.amount;
      return total;
    }, 0);
  };

  const getTotalFees = () => {
    return transactions.reduce((total, tx) => total + tx.fee, 0);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onPress={() => handleTransactionPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Transacciones</Text>
      <Text style={styles.subtitle}>Historial de actividad de tu wallet</Text>
      
      {/* Wallet Info */}
      <View style={styles.walletInfo}>
        <Text style={styles.walletLabel}>Dirección:</Text>
        <Text style={styles.walletAddress}>
          {walletAddress ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}` : 'Conectando...'}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Balance Total</Text>
          <Text style={styles.statValue}>{getTotalBalance().toFixed(4)} WLD</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Fees Totales</Text>
          <Text style={styles.statValue}>{getTotalFees().toFixed(6)} WLD</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total TX</Text>
          <Text style={styles.statValue}>{transactions.length}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.filterText}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Recibidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Enviadas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No hay transacciones</Text>
      <Text style={styles.emptySubtitle}>
        Las transacciones aparecerán aquí una vez que realices operaciones con tu wallet
      </Text>
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 20,
  },
  walletInfo: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 