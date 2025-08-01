import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PriceCard } from '../components/PriceCard';
import { PriceChart } from '../components/PriceChart';
import { wldService, aiPredictionService } from '../services/api';
import { WLDToken, Prediction, Recommendation } from '../types';

export const HomeScreen: React.FC = () => {
  const [tokenData, setTokenData] = useState<WLDToken | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del token
      const token = await wldService.getTokenData();
      setTokenData(token);
      
      // Cargar predicción de IA
      const pred = await aiPredictionService.getPricePrediction('24h');
      setPrediction(pred);
      
      // Cargar recomendación de trading
      const rec = await aiPredictionService.getTradingRecommendation();
      setRecommendation(rec);
      
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'buy':
        return '#4CAF50';
      case 'sell':
        return '#F44336';
      case 'hold':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getRecommendationText = (action: string) => {
    switch (action) {
      case 'buy':
        return 'COMPRAR';
      case 'sell':
        return 'VENDER';
      case 'hold':
        return 'MANTENER';
      default:
        return 'ANALIZAR';
    }
  };

  if (loading && !tokenData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos de WLD...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>WLD Wallet</Text>
          <Text style={styles.subtitle}>Tu wallet complementaria de Worldcoin</Text>
        </View>

        {/* Token Price Card */}
        {tokenData && (
          <PriceCard token={tokenData} />
        )}

        {/* Price Chart */}
        <PriceChart days={30} />

        {/* AI Prediction */}
        {prediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.sectionTitle}>Predicción IA (24h)</Text>
            <View style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionPrice}>
                  ${prediction.predictedPrice.toFixed(4)}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confianza:</Text>
                  <Text style={styles.confidenceValue}>
                    {(prediction.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.predictionReasoning}>
                {prediction.reasoning}
              </Text>
            </View>
          </View>
        )}

        {/* Trading Recommendation */}
        {recommendation && (
          <View style={styles.recommendationContainer}>
            <Text style={styles.sectionTitle}>Recomendación de Trading</Text>
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: getRecommendationColor(recommendation.action) }
                  ]}
                >
                  <Text style={styles.actionText}>
                    {getRecommendationText(recommendation.action)}
                  </Text>
                </TouchableOpacity>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confianza:</Text>
                  <Text style={styles.confidenceValue}>
                    {(recommendation.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationReasoning}>
                {recommendation.reasoning}
              </Text>
              {recommendation.targetPrice && (
                <View style={styles.targetPriceContainer}>
                  <Text style={styles.targetPriceLabel}>Precio objetivo:</Text>
                  <Text style={styles.targetPriceValue}>
                    ${recommendation.targetPrice.toFixed(4)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionItemIcon}>📊</Text>
              <Text style={styles.actionItemText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionItemIcon}>🔔</Text>
              <Text style={styles.actionItemText}>Alertas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionItemIcon}>💰</Text>
              <Text style={styles.actionItemText}>Recompensas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionItemIcon}>⚙️</Text>
              <Text style={styles.actionItemText}>Config</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
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
    alignItems: 'center',
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
    textAlign: 'center',
  },
  predictionContainer: {
    marginVertical: 16,
  },
  recommendationContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  predictionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  predictionReasoning: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
  },
  recommendationCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recommendationReasoning: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
    marginBottom: 8,
  },
  targetPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetPriceLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginRight: 8,
  },
  targetPriceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  quickActionsContainer: {
    marginVertical: 16,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  actionItem: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
  },
  actionItemIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionItemText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
}); 