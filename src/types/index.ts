export interface WLDToken {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
}

export interface UserWallet {
  address: string;
  balance: number;
  transactions: Transaction[];
  rewards: Reward[];
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: number;
  timestamp: Date;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  fee: number;
}

export interface Reward {
  id: string;
  type: 'daily' | 'weekly' | 'referral' | 'activity';
  amount: number;
  timestamp: Date;
  description: string;
  claimed: boolean;
}

export interface PriceAlert {
  id: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: Date;
}

export interface Prediction {
  id: string;
  predictedPrice: number;
  confidence: number;
  timeframe: '1h' | '24h' | '7d' | '30d';
  createdAt: Date;
  reasoning: string;
}

export interface Recommendation {
  id: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  targetPrice?: number;
  createdAt: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface NavigationProps {
  navigation: any;
  route: any;
} 