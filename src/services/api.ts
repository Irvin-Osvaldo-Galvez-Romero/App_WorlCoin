import axios from 'axios';
import { ethers } from 'ethers';
import { WLDToken, Transaction, Reward, Prediction, Recommendation } from '../types';

// Configuración de la API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const WORLD_APP_API_URL = 'https://api.worldcoin.org';

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Servicio para obtener datos de WLD
export const wldService = {
  // Obtener precio actual de WLD
  async getCurrentPrice(): Promise<number> {
    try {
      const response = await apiClient.get('/simple/price', {
        params: {
          ids: 'worldcoin',
          vs_currencies: 'usd',
        },
      });
      return response.data.worldcoin.usd;
    } catch (error) {
      console.error('Error fetching WLD price:', error);
      return 0;
    }
  },

  // Obtener datos completos del token WLD
  async getTokenData(): Promise<WLDToken> {
    try {
      const response = await apiClient.get('/coins/worldcoin');
      const data = response.data;
      
      return {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        currentPrice: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_24h,
        priceChangePercentage24h: data.market_data.price_change_percentage_24h,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd,
        circulatingSupply: data.market_data.circulating_supply,
        totalSupply: data.market_data.total_supply,
      };
    } catch (error) {
      console.error('Error fetching WLD token data:', error);
      throw error;
    }
  },

  // Obtener historial de precios
  async getPriceHistory(days: number = 30): Promise<{ prices: [number, number][] }> {
    try {
      const response = await apiClient.get('/coins/worldcoin/market_chart', {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  },
};

// Servicio para conectar con World App
export const worldAppService = {
  // Conectar wallet de World App
  async connectWallet(): Promise<string> {
    try {
      const { worldAppIntegration } = await import('./worldAppIntegration');
      const credentials = await worldAppIntegration.connectWorldApp();
      return credentials.walletAddress;
    } catch (error) {
      console.error('Error connecting to World App:', error);
      throw error;
    }
  },

  // Obtener transacciones del usuario
  async getTransactions(address: string): Promise<Transaction[]> {
    try {
      const { worldAppIntegration } = await import('./worldAppIntegration');
      const realTransactions = await worldAppIntegration.getRealTransactions(address);
      
      // Convertir transacciones reales al formato de la app
      return realTransactions.map((tx, index) => ({
        id: tx.hash,
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive',
        amount: parseFloat(tx.value),
        timestamp: new Date(tx.timestamp * 1000),
        hash: tx.hash,
        status: tx.status,
        fee: parseFloat(ethers.utils.formatEther(
          ethers.BigNumber.from(tx.gasUsed).mul(tx.gasPrice)
        )),
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback a datos de ejemplo si hay error
      return [
        {
          id: '1',
          type: 'receive',
          amount: 10.5,
          timestamp: new Date(),
          hash: '0xabc123...',
          status: 'confirmed',
          fee: 0.001,
        },
        {
          id: '2',
          type: 'send',
          amount: 5.2,
          timestamp: new Date(Date.now() - 86400000),
          hash: '0xdef456...',
          status: 'confirmed',
          fee: 0.001,
        },
      ];
    }
  },

  // Obtener recompensas del usuario
  async getRewards(address: string): Promise<Reward[]> {
    try {
      // Aquí implementarías la lógica para obtener recompensas reales
      return [
        {
          id: '1',
          type: 'daily',
          amount: 0.1,
          timestamp: new Date(),
          description: 'Daily login reward',
          claimed: false,
        },
        {
          id: '2',
          type: 'referral',
          amount: 1.0,
          timestamp: new Date(Date.now() - 86400000),
          description: 'Referral bonus',
          claimed: true,
        },
      ];
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw error;
    }
  },
};

// Servicio para predicciones de IA
export const aiPredictionService = {
  // Obtener predicción de precio
  async getPricePrediction(timeframe: '1h' | '24h' | '7d' | '30d'): Promise<Prediction> {
    try {
      // Aquí implementarías la lógica de IA real
      // Por ahora retornamos una predicción de ejemplo
      const currentPrice = await wldService.getCurrentPrice();
      const predictedPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1);
      
      return {
        id: Date.now().toString(),
        predictedPrice,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        timeframe,
        createdAt: new Date(),
        reasoning: 'Análisis basado en tendencias de mercado y volumen de trading',
      };
    } catch (error) {
      console.error('Error getting price prediction:', error);
      throw error;
    }
  },

  // Obtener recomendación de trading
  async getTradingRecommendation(): Promise<Recommendation> {
    try {
      // Aquí implementarías la lógica de IA real
      const actions: ('buy' | 'sell' | 'hold')[] = ['buy', 'sell', 'hold'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      return {
        id: Date.now().toString(),
        action,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        reasoning: action === 'buy' 
          ? 'Indicadores técnicos sugieren una tendencia alcista'
          : action === 'sell'
          ? 'Se detecta resistencia en niveles clave'
          : 'Mercado en consolidación, esperar mejor entrada',
        targetPrice: action === 'buy' ? 2.5 : action === 'sell' ? 2.0 : undefined,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting trading recommendation:', error);
      throw error;
    }
  },
}; 