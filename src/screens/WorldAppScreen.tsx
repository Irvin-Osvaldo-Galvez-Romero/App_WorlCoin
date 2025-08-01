import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldAppConnect } from '../components/WorldAppConnect';
import { worldAppIntegration } from '../services/worldAppIntegration';
import { formatWalletAddress, formatPrice } from '../utils/formatters';

export const WorldAppScreen: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    loadNetworkInfo();
    checkConnectionStatus();
  }, []);

  const loadNetworkInfo = async () => {
    try {
      const info = await worldAppIntegration.getNetworkInfo();
      setNetworkInfo(info);
    } catch (error) {
      console.error('Error loading network info:', error);
    }
  };

  const checkConnectionStatus = () => {
    const connected = worldAppIntegration.isConnected();
    setIsConnected(connected);
    
    if (connected) {
      const address = worldAppIntegration.getWalletAddress();
      setWalletAddress(address);
    }
  };

  const handleConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  const handleSendTestTransaction = async () => {
    if (!walletAddress) {
      Alert.alert('Error', 'No hay wallet conectada');
      return;
    }

    Alert.alert(
      'Enviar Transacción de Prueba',
      '¿Deseas enviar una transacción de prueba de 0.001 WLD a tu propia dirección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              const txHash = await worldAppIntegration.sendWLDTransaction(
                walletAddress,
                '0.001'
              );
              Alert.alert(
                'Transacción Enviada',
                `Hash: ${txHash}\n\nLa transacción está siendo procesada en la blockchain.`
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo enviar la transacción. Verifica tu balance.');
            }
          },
        },
      ]
    );
  };

  const handleExportWallet = async () => {
    if (!walletAddress) {
      Alert.alert('Error', 'No hay wallet conectada');
      return;
    }

    Alert.alert(
      'Exportar Wallet',
      '¿Deseas exportar la información de tu wallet? (Solo para desarrollo)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Exportar',
          onPress: () => {
            Alert.alert(
              'Información de Wallet',
              `Dirección: ${walletAddress}\n\n⚠️ En producción, nunca compartas información privada.`
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>World App Integration</Text>
          <Text style={styles.subtitle}>
            Conecta tu wallet con World App para gestionar tokens WLD
          </Text>
        </View>

        {/* World App Connect Component */}
        <WorldAppConnect
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Network Information */}
        {networkInfo && (
          <View style={styles.networkContainer}>
            <Text style={styles.sectionTitle}>Información de Red</Text>
            <View style={styles.networkCard}>
              <View style={styles.networkItem}>
                <Text style={styles.networkLabel}>Red:</Text>
                <Text style={styles.networkValue}>{networkInfo.name}</Text>
              </View>
              <View style={styles.networkItem}>
                <Text style={styles.networkLabel}>Chain ID:</Text>
                <Text style={styles.networkValue}>{networkInfo.chainId}</Text>
              </View>
              <View style={styles.networkItem}>
                <Text style={styles.networkLabel}>Gas Price:</Text>
                <Text style={styles.networkValue}>{networkInfo.gasPrice} Gwei</Text>
              </View>
            </View>
          </View>
        )}

        {/* Wallet Actions */}
        {isConnected && walletAddress && (
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Acciones de Wallet</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSendTestTransaction}
            >
              <Text style={styles.actionIcon}>💸</Text>
              <Text style={styles.actionTitle}>Enviar Transacción de Prueba</Text>
              <Text style={styles.actionDescription}>
                Envía 0.001 WLD a tu propia dirección
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExportWallet}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionTitle}>Exportar Información</Text>
              <Text style={styles.actionDescription}>
                Ver información de la wallet (solo desarrollo)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Características de World App</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔐</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Verificación de Identidad</Text>
              <Text style={styles.featureDescription}>
                Verifica tu identidad usando World ID y Orb
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💰</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Gestión de Tokens WLD</Text>
              <Text style={styles.featureDescription}>
                Envía, recibe y gestiona tus tokens WLD de forma segura
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Análisis en Tiempo Real</Text>
              <Text style={styles.featureDescription}>
                Monitorea precios, transacciones y rendimiento de WLD
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎁</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sistema de Recompensas</Text>
              <Text style={styles.featureDescription}>
                Gana WLD completando actividades y referidos
              </Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityContainer}>
          <Text style={styles.securityTitle}>🔒 Seguridad</Text>
          <Text style={styles.securityText}>
            • Las claves privadas se almacenan de forma segura en tu dispositivo
          </Text>
          <Text style={styles.securityText}>
            • Nunca compartas tu información privada
          </Text>
          <Text style={styles.securityText}>
            • Las transacciones se ejecutan en la blockchain de Ethereum
          </Text>
          <Text style={styles.securityText}>
            • Verifica siempre las direcciones antes de enviar
          </Text>
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
    lineHeight: 22,
  },
  networkContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  networkCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  networkLabel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  networkValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsContainer: {
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    flex: 1,
  },
  featuresContainer: {
    marginVertical: 16,
  },
  featureCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  securityContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    marginBottom: 32,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 