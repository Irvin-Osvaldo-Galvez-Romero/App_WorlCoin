// Configuración de variables de entorno para la aplicación WLD Wallet
// Estas variables se pueden configurar en el archivo .env o en las variables de entorno del sistema

export const ENV = {
  WORLD_APP: {
    APP_ID: process.env.EXPO_PUBLIC_WORLD_APP_ID || 'app_a7e97318974ea00c54d4efa63e4e9ffb',
    ACTION_NAME: process.env.EXPO_PUBLIC_WORLD_ACTION_NAME || 'verify_wld_wallet',
    SIGNAL: process.env.EXPO_PUBLIC_WORLD_SIGNAL || 'user_wallet_verification',
    ORB_ENVIRONMENT: process.env.EXPO_PUBLIC_ORB_ENVIRONMENT || 'staging',
  },
  BLOCKCHAIN: {
    WLD_CONTRACT_ADDRESS: process.env.EXPO_PUBLIC_WLD_CONTRACT_ADDRESS || '0x163f8C2617924c0E3C0b4C8C0C0C0C0C0C0C0C0C0',
    RPC_URL: process.env.EXPO_PUBLIC_RPC_URL || 'https://ethereum.publicnode.com',
    CHAIN_ID: process.env.EXPO_PUBLIC_CHAIN_ID || '1', // Ethereum Mainnet
    EXPLORER_URL: process.env.EXPO_PUBLIC_EXPLORER_URL || 'https://etherscan.io',
  },
  API: {
    COINGECKO_BASE_URL: process.env.EXPO_PUBLIC_COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
    AI_PREDICTION_URL: process.env.EXPO_PUBLIC_AI_PREDICTION_URL || 'https://api.example.com/predictions',
    WORLD_APP_API_URL: process.env.EXPO_PUBLIC_WORLD_APP_API_URL || 'https://developer.worldcoin.org/api/v1',
    WORLD_ID_VERIFIER_URL: process.env.EXPO_PUBLIC_WORLD_ID_VERIFIER_URL || 'https://developer.worldcoin.org/api/v1/verify',
    GITHUB_REPO_URL: process.env.EXPO_PUBLIC_GITHUB_REPO_URL || 'https://github.com/tu-usuario/App_WorlCoin',
  },
  APP: {
    NAME: 'WLD Wallet',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    BUNDLE_ID: 'com.yourcompany.wldwallet',
  },
  FEATURES: {
    ENABLE_REAL_WORLD_APP: process.env.EXPO_PUBLIC_ENABLE_REAL_WORLD_APP === 'true' || true,
    ENABLE_AI_PREDICTIONS: process.env.EXPO_PUBLIC_ENABLE_AI_PREDICTIONS === 'true' || true,
    ENABLE_PRICE_ALERTS: process.env.EXPO_PUBLIC_ENABLE_PRICE_ALERTS === 'true' || true,
    ENABLE_TRANSACTIONS: process.env.EXPO_PUBLIC_ENABLE_TRANSACTIONS === 'true' || true,
    ENABLE_REWARDS: process.env.EXPO_PUBLIC_ENABLE_REWARDS === 'true' || true,
  },
  DEVELOPMENT: {
    DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true' || false,
    LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
    MOCK_DATA: process.env.EXPO_PUBLIC_MOCK_DATA === 'true' || false,
  },
  SECURITY: {
    ENCRYPTION_KEY: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'your-encryption-key-here',
    API_KEY_HEADER: process.env.EXPO_PUBLIC_API_KEY_HEADER || 'X-API-Key',
  },
};

// Configuración específica por entorno
export const getCurrentConfig = () => {
  const isDevelopment = __DEV__;
  const isProduction = !isDevelopment;
  
  return {
    ...ENV,
    isDevelopment,
    isProduction,
    // Configuraciones específicas por entorno
    development: {
      ...ENV.DEVELOPMENT,
      DEBUG_MODE: true,
      LOG_LEVEL: 'debug',
    },
    production: {
      ...ENV.DEVELOPMENT,
      DEBUG_MODE: false,
      LOG_LEVEL: 'error',
    },
  };
};

// Función para validar la configuración
export const validateConfig = () => {
  const requiredFields = [
    'WORLD_APP.APP_ID',
    'BLOCKCHAIN.WLD_CONTRACT_ADDRESS',
    'BLOCKCHAIN.RPC_URL',
  ];

  const missingFields = requiredFields.filter(field => {
    const keys = field.split('.');
    let value = ENV;
    for (const key of keys) {
      value = value[key];
      if (!value) return true;
    }
    return false;
  });

  if (missingFields.length > 0) {
    console.warn('⚠️ Configuración incompleta. Campos faltantes:', missingFields);
    return false;
  }

  return true;
};

// Función para obtener configuración específica
export const getConfig = (path: string) => {
  const keys = path.split('.');
  let value = ENV;
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  return value;
};

export default getCurrentConfig(); 