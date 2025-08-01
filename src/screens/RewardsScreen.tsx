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
import { LinearGradient } from 'expo-linear-gradient';
import { worldAppService } from '../services/api';
import { Reward } from '../types';

export const RewardsScreen: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      
      // Conectar wallet si no está conectada
      if (!walletAddress) {
        const address = await worldAppService.connectWallet();
        setWalletAddress(address);
      }
      
      // Obtener recompensas
      const userRewards = await worldAppService.getRewards(walletAddress || '');
      setRewards(userRewards);
      
    } catch (error) {
      console.error('Error loading rewards:', error);
      Alert.alert('Error', 'No se pudieron cargar las recompensas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  };

  const handleClaimReward = (reward: Reward) => {
    if (reward.claimed) {
      Alert.alert('Recompensa ya reclamada', 'Esta recompensa ya fue reclamada anteriormente.');
      return;
    }

    Alert.alert(
      'Reclamar Recompensa',
      `¿Deseas reclamar ${reward.amount} WLD?\n\n${reward.description}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reclamar', 
          onPress: () => {
            // Aquí implementarías la lógica para reclamar la recompensa
            Alert.alert('Éxito', 'Recompensa reclamada exitosamente');
          }
        }
      ]
    );
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      case 'referral':
        return '👥';
      case 'activity':
        return '🎯';
      default:
        return '🎁';
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'daily':
        return ['#4CAF50', '#45a049'];
      case 'weekly':
        return ['#2196F3', '#1976D2'];
      case 'referral':
        return ['#FF9800', '#F57C00'];
      case 'activity':
        return ['#9C27B0', '#7B1FA2'];
      default:
        return ['#9E9E9E', '#757575'];
    }
  };

  const getTotalClaimed = () => {
    return rewards
      .filter(reward => reward.claimed)
      .reduce((total, reward) => total + reward.amount, 0);
  };

  const getTotalPending = () => {
    return rewards
      .filter(reward => !reward.claimed)
      .reduce((total, reward) => total + reward.amount, 0);
  };

  const renderReward = ({ item }: { item: Reward }) => (
    <TouchableOpacity
      onPress={() => handleClaimReward(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getRewardColor(item.type)}
        style={[styles.rewardCard, item.claimed && styles.claimedCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.rewardHeader}>
          <View style={styles.rewardIcon}>
            <Text style={styles.iconText}>{getRewardIcon(item.type)}</Text>
          </View>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardType}>
              {item.type === 'daily' ? 'Recompensa Diaria' :
               item.type === 'weekly' ? 'Recompensa Semanal' :
               item.type === 'referral' ? 'Recompensa por Referido' :
               'Recompensa por Actividad'}
            </Text>
            <Text style={styles.rewardDescription}>{item.description}</Text>
          </View>
          <View style={styles.rewardAmount}>
            <Text style={styles.amountText}>{item.amount.toFixed(4)} WLD</Text>
            <View style={[styles.statusBadge, { backgroundColor: item.claimed ? '#4CAF50' : '#FF9800' }]}>
              <Text style={styles.statusText}>
                {item.claimed ? 'Reclamada' : 'Pendiente'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rewardFooter}>
          <Text style={styles.rewardDate}>
            {item.timestamp.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {!item.claimed && (
            <TouchableOpacity style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Reclamar</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Recompensas</Text>
      <Text style={styles.subtitle}>Gana WLD completando actividades</Text>
      
      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Reclamado</Text>
          <Text style={styles.statValue}>{getTotalClaimed().toFixed(4)} WLD</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pendiente</Text>
          <Text style={styles.statValue}>{getTotalPending().toFixed(4)} WLD</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{rewards.length}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionText}>Actividades</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionText}>Referidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎁</Text>
      <Text style={styles.emptyTitle}>No hay recompensas</Text>
      <Text style={styles.emptySubtitle}>
        Completa actividades diarias y semanales para ganar recompensas en WLD
      </Text>
    </View>
  );

  if (loading && rewards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando recompensas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rewards}
        renderItem={renderReward}
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  rewardCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  claimedCard: {
    opacity: 0.7,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  rewardAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardDate: {
    fontSize: 12,
    color: '#E0E0E0',
  },
  claimButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  claimButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
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