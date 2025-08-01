import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { wldService } from '../services/api';

const screenWidth = Dimensions.get('window').width;

interface PriceChartProps {
  days?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ days = 30 }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChartData();
  }, [days]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const priceHistory = await wldService.getPriceHistory(days);
      const prices = priceHistory.prices;
      
      // Procesar datos para la gráfica
      const labels: string[] = [];
      const data: number[] = [];
      
      // Tomar puntos de datos espaciados uniformemente
      const step = Math.max(1, Math.floor(prices.length / 7));
      
      prices.forEach((price, index) => {
        if (index % step === 0 || index === prices.length - 1) {
          const date = new Date(price[0]);
          labels.push(date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          }));
          data.push(price[1]);
        }
      });

      setChartData({
        labels,
        datasets: [{ data }],
      });
    } catch (err) {
      setError('Error al cargar datos de precios');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando gráfica...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Precios WLD</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#1e1e1e',
          backgroundGradientFrom: '#1e1e1e',
          backgroundGradientTo: '#1e1e1e',
          decimalPlaces: 4,
          color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#667eea',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        bezier
        style={styles.chart}
        withDots={false}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    padding: 40,
  },
}); 