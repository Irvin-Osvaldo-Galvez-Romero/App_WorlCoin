// Configuración de entorno
export const ENV = {
  // World App Configuration
  WORLD_APP: {
    APP_ID: process.env.EXPO_PUBLIC_WORLD_APP_ID || 'app_staging_1234567890abcdef',
    ACTION_NAME: process.env.EXPO_PUBLIC_WORLD_ACTION_NAME || 'verify_wld_wallet',
    SIGNAL: process.env.EXPO_PUBLIC_WORLD_SIGNAL || 'user_wallet_verification',
    ORB_ENVIRONMENT: process.env.EXPO_PUBLIC_ORB_ENVIRONMENT || 'staging', // 'staging' | 'production'
  },

  // Blockchain Configuration
  BLOCKCHAIN: {
    CHAIN_ID: parseInt(process.env.EXPO_PUBLIC_CHAIN_ID || '1'), // 1 = Ethereum Mainnet
    RPC_URL: process.env.EXPO_PUBLIC_RPC_URL || 'https://ethereum.publicnode.com',
    WLD_CONTRACT_ADDRESS: process.env.EXPO_PUBLIC_WLD_CONTRACT_ADDRESS || '0x163f8C2617924dF3bD4C9C5C3b5C5C3b5C5C3b5C5',
    EXPLORER_URL: process.env.EXPO_PUBLIC_EXPLORER_URL || 'https://etherscan.io',
  },

  // API Configuration
  API: {
    COINGECKO_BASE_URL: process.env.EXPO_PUBLIC_COINGECKO_URL || 'https://api.coingecko.com/api/v3',
    WORLD_APP_API_URL: process.env.EXPO_PUBLIC_WORLD_APP_API_URL || 'https://api.worldcoin.org',
    TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000'),
  },

  // App Configuration
  APP: {
    NAME: process.env.EXPO_PUBLIC_APP_NAME || 'WLD Wallet',
    VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development', // 'development' | 'staging' | 'production'
  },

  // Feature Flags
  FEATURES: {
    ENABLE_REAL_TRANSACTIONS: process.env.EXPO_PUBLIC_ENABLE_REAL_TRANSACTIONS === 'true',
    ENABLE_WORLD_ID_VERIFICATION: process.env.EXPO_PUBLIC_ENABLE_WORLD_ID_VERIFICATION === 'true',
    ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
    ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  // Configuración para desarrollo local
  MOCK_DATA: {
    ENABLED: __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
    WALLET_ADDRESS: '0x1234567890123456789012345678901234567890',
    MOCK_BALANCE: '100.0',
    MOCK_TRANSACTIONS: true,
  },

  // Configuración de debugging
  DEBUG: {
    ENABLED: __DEV__,
    LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
    SHOW_NETWORK_INFO: __DEV__,
  },
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  // Configuración de encriptación
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_SIZE: 32,
    IV_SIZE: 16,
  },

  // Configuración de autenticación
  AUTH: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  },

  // Configuración de transacciones
  TRANSACTIONS: {
    MAX_AMOUNT: parseFloat(process.env.EXPO_PUBLIC_MAX_TRANSACTION_AMOUNT || '10000'),
    MIN_AMOUNT: parseFloat(process.env.EXPO_PUBLIC_MIN_TRANSACTION_AMOUNT || '0.001'),
    GAS_LIMIT: parseInt(process.env.EXPO_PUBLIC_GAS_LIMIT || '21000'),
  },
};

// Configuración de redes soportadas
export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum.publicnode.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
  },
  POLYGON_MAINNET: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

// Configuración de World ID
export const WORLD_ID_CONFIG = {
  // Configuración para diferentes entornos
  STAGING: {
    APP_ID: 'app_staging_1234567890abcdef',
    ORB_ENVIRONMENT: 'staging',
    VERIFICATION_URL: 'https://developer.worldcoin.org/api/v1/verify',
  },
  PRODUCTION: {
    APP_ID: 'app_production_1234567890abcdef',
    ORB_ENVIRONMENT: 'production',
    VERIFICATION_URL: 'https://developer.worldcoin.org/api/v1/verify',
  },
};

// Función para obtener la configuración actual
export const getCurrentConfig = () => {
  const environment = ENV.APP.ENVIRONMENT;
  
  return {
    ...ENV,
    worldId: environment === 'production' ? WORLD_ID_CONFIG.PRODUCTION : WORLD_ID_CONFIG.STAGING,
    network: SUPPORTED_NETWORKS.ETHEREUM_MAINNET, // Por defecto Ethereum Mainnet
  };
};

// Función para validar configuración
export const validateConfig = () => {
  const errors: string[] = [];

  if (!ENV.WORLD_APP.APP_ID) {
    errors.push('WORLD_APP_ID is required');
  }

  if (!ENV.BLOCKCHAIN.RPC_URL) {
    errors.push('RPC_URL is required');
  }

  if (!ENV.BLOCKCHAIN.WLD_CONTRACT_ADDRESS) {
    errors.push('WLD_CONTRACT_ADDRESS is required');
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    return false;
  }

  return true;
};

// Exportar configuración por defecto
export default getCurrentConfig(); 