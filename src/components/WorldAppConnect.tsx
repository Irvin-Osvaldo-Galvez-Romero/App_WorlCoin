import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { worldAppIntegration } from '../services/worldAppIntegration';
import { formatWalletAddress } from '../utils/formatters';

interface WorldAppConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const WorldAppConnect: React.FC<WorldAppConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = worldAppIntegration.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const address = worldAppIntegration.getWalletAddress();
        setWalletAddress(address);
        
        if (address) {
          const wldBalance = await worldAppIntegration.getWLDBalance(address);
          setBalance(wldBalance);
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      Alert.alert(
        'Conectar con World App',
        '¿Deseas conectar tu wallet con World App? Esto iniciará el proceso de verificación.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Conectar',
            onPress: async () => {
              try {
                const credentials = await worldAppIntegration.connectWorldApp();
                setWalletAddress(credentials.walletAddress);
                setIsConnected(true);
                
                // Obtener balance
                const wldBalance = await worldAppIntegration.getWLDBalance(credentials.walletAddress);
                setBalance(wldBalance);
                
                onConnect?.(credentials.walletAddress);
                
                Alert.alert(
                  '¡Conectado!',
                  `Wallet conectada exitosamente.\nDirección: ${formatWalletAddress(credentials.walletAddress)}\nBalance: ${wldBalance} WLD`
                );
              } catch (error) {
                Alert.alert('Error', 'No se pudo conectar con World App. Intenta nuevamente.');
              } finally {
                setIsConnecting(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error connecting to World App:', error);
      Alert.alert('Error', 'Error al conectar con World App');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      Alert.alert(
        'Desconectar Wallet',
        '¿Estás seguro de que deseas desconectar tu wallet?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desconectar',
            style: 'destructive',
            onPress: async () => {
              await worldAppIntegration.disconnect();
              setIsConnected(false);
              setWalletAddress(null);
              setBalance('0');
              onDisconnect?.();
              
              Alert.alert('Desconectado', 'Wallet desconectada exitosamente');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      Alert.alert('Error', 'Error al desconectar la wallet');
    }
  };

  const handleRefreshBalance = async () => {
    if (walletAddress) {
      try {
        const wldBalance = await worldAppIntegration.getWLDBalance(walletAddress);
        setBalance(wldBalance);
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    }
  };

  if (isConnecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Conectando con World App...</Text>
      </View>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.connectedContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.connectedHeader}>
          <Text style={styles.connectedTitle}>Wallet Conectada</Text>
          <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
            <Text style={styles.disconnectText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>Dirección:</Text>
          <Text style={styles.walletAddress}>{formatWalletAddress(walletAddress)}</Text>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance WLD:</Text>
          <Text style={styles.balanceValue}>{parseFloat(balance).toFixed(4)} WLD</Text>
          <TouchableOpacity onPress={handleRefreshBalance} style={styles.refreshButton}>
            <Text style={styles.refreshText}>🔄</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.networkInfo}>
          <Text style={styles.networkLabel}>Red: Ethereum Mainnet</Text>
          <Text style={styles.networkLabel}>Estado: Conectado</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.connectContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.connectContent}>
        <Text style={styles.connectTitle}>Conectar con World App</Text>
        <Text style={styles.connectDescription}>
          Conecta tu wallet para acceder a todas las funcionalidades de WLD
        </Text>
        
        <TouchableOpacity onPress={handleConnect} style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Conectar Wallet</Text>
        </TouchableOpacity>
        
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>✓ Verificar identidad con World ID</Text>
          <Text style={styles.featureItem}>✓ Gestionar tokens WLD</Text>
          <Text style={styles.featureItem}>✓ Ver historial de transacciones</Text>
          <Text style={styles.featureItem}>✓ Reclamar recompensas</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  connectContainer: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  connectContent: {
    alignItems: 'center',
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  connectDescription: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  connectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 24,
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  connectedContainer: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  connectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disconnectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disconnectText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  walletInfo: {
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginRight: 8,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  refreshButton: {
    padding: 4,
  },
  refreshText: {
    fontSize: 16,
  },
  networkInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkLabel: {
    fontSize: 12,
    color: '#E0E0E0',
  },
}); 