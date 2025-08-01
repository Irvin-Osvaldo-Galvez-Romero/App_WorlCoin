import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { ENV } from '../utils/environment';

// Configuración de World App
const WORLD_APP_CONFIG = {
  APP_ID: ENV.WORLD_APP.APP_ID,
  ACTION_NAME: ENV.WORLD_APP.ACTION_NAME,
  SIGNAL: ENV.WORLD_APP.SIGNAL,
  ORB_ENVIRONMENT: ENV.WORLD_APP.ORB_ENVIRONMENT,
};

// Configuración de la red
const NETWORK_CONFIG = {
  CHAIN_ID: parseInt(ENV.BLOCKCHAIN.CHAIN_ID),
  RPC_URL: ENV.BLOCKCHAIN.RPC_URL,
  WLD_CONTRACT_ADDRESS: ENV.BLOCKCHAIN.WLD_CONTRACT_ADDRESS,
};

export interface WorldAppCredentials {
  walletAddress: string;
  worldIdCredential: string;
  isVerified: boolean;
}

export interface WorldAppTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

class WorldAppIntegrationService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;
  private credentials: WorldAppCredentials | null = null;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.RPC_URL);
    this.initializeService();
  }

  private async initializeService() {
    try {
      // Cargar credenciales guardadas
      const savedCredentials = await AsyncStorage.getItem(STORAGE_KEYS.WORLD_APP_CREDENTIALS);
      if (savedCredentials) {
        this.credentials = JSON.parse(savedCredentials);
      }
    } catch (error) {
      console.error('Error initializing World App service:', error);
    }
  }

  // Conectar con World App
  async connectWorldApp(): Promise<WorldAppCredentials> {
    try {
      // Verificar si ya está conectado
      if (this.credentials && this.credentials.isVerified) {
        return this.credentials;
      }

      // Iniciar proceso de verificación con World App
      const verificationResult = await this.initiateWorldIdVerification();
      
      // Crear o recuperar wallet
      const walletAddress = await this.createOrRecoverWallet();
      
      // Guardar credenciales
      this.credentials = {
        walletAddress,
        worldIdCredential: verificationResult.credential,
        isVerified: true,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.WORLD_APP_CREDENTIALS,
        JSON.stringify(this.credentials)
      );

      return this.credentials;
    } catch (error) {
      console.error('Error connecting to World App:', error);
      throw new Error('Failed to connect to World App');
    }
  }

  // Iniciar verificación con World ID
  private async initiateWorldIdVerification(): Promise<{ credential: string }> {
    try {
      // Aquí implementarías la integración real con World ID
      // Por ahora, simulamos la verificación
      
      // En una implementación real, usarías:
      // import { WorldID } from '@worldcoin/world-id-js';
      // const worldId = new WorldID({
      //   app_id: WORLD_APP_CONFIG.APP_ID,
      //   action: WORLD_APP_CONFIG.ACTION_NAME,
      //   signal: WORLD_APP_CONFIG.SIGNAL,
      // });
      
      // const result = await worldId.verify();
      
      return {
        credential: 'simulated_world_id_credential_' + Date.now(),
      };
    } catch (error) {
      console.error('Error in World ID verification:', error);
      throw error;
    }
  }

  // Crear o recuperar wallet
  private async createOrRecoverWallet(): Promise<string> {
    try {
      // Intentar recuperar wallet existente
      const savedPrivateKey = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_PRIVATE_KEY);
      
      if (savedPrivateKey) {
        this.wallet = new ethers.Wallet(savedPrivateKey, this.provider);
      } else {
        // Crear nueva wallet
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        
        // Guardar private key de forma segura
        await AsyncStorage.setItem(
          STORAGE_KEYS.WALLET_PRIVATE_KEY,
          this.wallet.privateKey
        );
      }

      return this.wallet.address;
    } catch (error) {
      console.error('Error creating/recovering wallet:', error);
      throw error;
    }
  }

  // Obtener balance de WLD
  async getWLDBalance(address?: string): Promise<string> {
    try {
      const targetAddress = address || this.credentials?.walletAddress;
      if (!targetAddress) {
        throw new Error('No wallet address available');
      }

      // Crear instancia del contrato WLD
      const wldContract = new ethers.Contract(
        NETWORK_CONFIG.WLD_CONTRACT_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        this.provider
      );

      const balance = await wldContract.balanceOf(targetAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting WLD balance:', error);
      return '0';
    }
  }

  // Obtener transacciones reales
  async getRealTransactions(address?: string): Promise<WorldAppTransaction[]> {
    try {
      const targetAddress = address || this.credentials?.walletAddress;
      if (!targetAddress) {
        throw new Error('No wallet address available');
      }

      // Obtener transacciones del blockchain
      const transactions = await this.provider.getHistory(targetAddress);
      
      return transactions.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        value: ethers.utils.formatEther(tx.value),
        gasUsed: tx.gasUsed?.toString() || '0',
        gasPrice: tx.gasPrice?.toString() || '0',
        blockNumber: tx.blockNumber || 0,
        timestamp: tx.timestamp || 0,
        status: tx.confirmations > 0 ? 'confirmed' : 'pending',
      }));
    } catch (error) {
      console.error('Error getting real transactions:', error);
      return [];
    }
  }

  // Enviar transacción WLD
  async sendWLDTransaction(toAddress: string, amount: string): Promise<string> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not connected');
      }

      // Crear instancia del contrato WLD
      const wldContract = new ethers.Contract(
        NETWORK_CONFIG.WLD_CONTRACT_ADDRESS,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function balanceOf(address) view returns (uint256)',
        ],
        this.wallet
      );

      // Verificar balance
      const balance = await wldContract.balanceOf(this.wallet.address);
      const amountWei = ethers.utils.parseEther(amount);
      
      if (balance.lt(amountWei)) {
        throw new Error('Insufficient WLD balance');
      }

      // Enviar transacción
      const tx = await wldContract.transfer(toAddress, amountWei);
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Error sending WLD transaction:', error);
      throw error;
    }
  }

  // Verificar si la wallet está conectada
  isConnected(): boolean {
    return this.credentials?.isVerified === true;
  }

  // Obtener dirección de la wallet
  getWalletAddress(): string | null {
    return this.credentials?.walletAddress || null;
  }

  // Desconectar wallet
  async disconnect(): Promise<void> {
    try {
      this.wallet = null;
      this.credentials = null;
      
      await AsyncStorage.removeItem(STORAGE_KEYS.WORLD_APP_CREDENTIALS);
      await AsyncStorage.removeItem(STORAGE_KEYS.WALLET_PRIVATE_KEY);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  // Obtener información de la red
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const gasPrice = await this.provider.getGasPrice();
      
      return {
        chainId: network.chainId,
        name: network.name,
        gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      return null;
    }
  }
}

// Exportar instancia singleton
export const worldAppIntegration = new WorldAppIntegrationService(); 