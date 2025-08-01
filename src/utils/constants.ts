// Colores de la aplicación
export const COLORS = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2a2a2a',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#808080',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

// Configuración de la API
export const API_CONFIG = {
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  WORLD_APP_BASE_URL: 'https://api.worldcoin.org',
  TIMEOUT: 10000,
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'WLD Wallet',
  VERSION: '1.0.0',
  DESCRIPTION: 'Wallet complementaria de Worldcoin con análisis inteligente',
  SUPPORT_EMAIL: 'support@wldwallet.com',
  WEBSITE: 'https://wldwallet.com',
};

// Configuración de gráficas
export const CHART_CONFIG = {
  COLORS: {
    line: '#667eea',
    background: '#1e1e1e',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#FFFFFF',
  },
  HEIGHT: 220,
  DECIMAL_PLACES: 4,
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  PRICE_ALERT_CHANNEL: 'price-alerts',
  TRANSACTION_CHANNEL: 'transactions',
  REWARD_CHANNEL: 'rewards',
};

// Tipos de transacciones
export const TRANSACTION_TYPES = {
  SEND: 'send',
  RECEIVE: 'receive',
  SWAP: 'swap',
} as const;

// Tipos de recompensas
export const REWARD_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  REFERRAL: 'referral',
  ACTIVITY: 'activity',
} as const;

// Estados de transacciones
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const;

// Timeframes para predicciones
export const PREDICTION_TIMEFRAMES = {
  ONE_HOUR: '1h',
  ONE_DAY: '24h',
  ONE_WEEK: '7d',
  ONE_MONTH: '30d',
} as const;

// Acciones de trading
export const TRADING_ACTIONS = {
  BUY: 'buy',
  SELL: 'sell',
  HOLD: 'hold',
} as const;

// Configuración de almacenamiento
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'wallet_address',
  WALLET_PRIVATE_KEY: 'wallet_private_key',
  WORLD_APP_CREDENTIALS: 'world_app_credentials',
  USER_PREFERENCES: 'user_preferences',
  PRICE_ALERTS: 'price_alerts',
  TRANSACTION_HISTORY: 'transaction_history',
  REWARD_HISTORY: 'reward_history',
};

// Configuración de límites
export const LIMITS = {
  MAX_TRANSACTIONS_PER_PAGE: 50,
  MAX_REWARDS_PER_PAGE: 20,
  MAX_PRICE_ALERTS: 10,
  MIN_WLD_AMOUNT: 0.0001,
  MAX_WLD_AMOUNT: 1000000,
};

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  API_ERROR: 'Error al obtener datos del servidor.',
  WALLET_CONNECTION_ERROR: 'Error al conectar con la wallet.',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente para esta transacción.',
  INVALID_ADDRESS: 'Dirección de wallet inválida.',
  TRANSACTION_FAILED: 'La transacción falló. Intenta nuevamente.',
  REWARD_ALREADY_CLAIMED: 'Esta recompensa ya fue reclamada.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet conectada exitosamente.',
  TRANSACTION_SENT: 'Transacción enviada exitosamente.',
  REWARD_CLAIMED: 'Recompensa reclamada exitosamente.',
  PRICE_ALERT_SET: 'Alerta de precio configurada.',
  SETTINGS_SAVED: 'Configuración guardada.',
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'ease-in-out',
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  WALLET_ADDRESS_REGEX: /^0x[a-fA-F0-9]{40}$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
}; 