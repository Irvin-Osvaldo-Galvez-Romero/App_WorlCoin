// Configuración centralizada de URLs para la aplicación WLD Wallet

export const URLS = {
  // URLs de Worldcoin
  WORLDCOIN: {
    DEVELOPER_PORTAL: 'https://developer.worldcoin.org',
    API_BASE: 'https://developer.worldcoin.org/api/v1',
    VERIFIER: 'https://developer.worldcoin.org/api/v1/verify',
    DOCUMENTATION: 'https://docs.worldcoin.org',
    WORLD_APP: 'https://worldcoin.org/world-app',
  },

  // URLs de APIs externas
  APIS: {
    COINGECKO: 'https://api.coingecko.com/api/v3',
    ETHERSCAN: 'https://etherscan.io',
    ETHPLORER: 'https://api.ethplorer.io',
  },

  // URLs de Blockchain
  BLOCKCHAIN: {
    ETHEREUM_MAINNET: 'https://ethereum.publicnode.com',
    ETHERSCAN_API: 'https://api.etherscan.io/api',
    ETHPLORER_API: 'https://api.ethplorer.io',
  },

  // URLs de la aplicación
  APP: {
    GITHUB_REPO: process.env.EXPO_PUBLIC_GITHUB_REPO_URL || 'https://github.com/tu-usuario/App_WorlCoin',
    WEBSITE: process.env.EXPO_PUBLIC_APP_WEBSITE || 'https://wld-wallet.com',
    SUPPORT: process.env.EXPO_PUBLIC_SUPPORT_URL || 'https://github.com/tu-usuario/App_WorlCoin/issues',
  },

  // URLs de recursos
  RESOURCES: {
    WLD_CONTRACT: '0x163f8C2617924c0E3C0b4C8C0C0C0C0C0C0C0C0C0',
    WLD_WHITEPAPER: 'https://whitepaper.worldcoin.org',
    WLD_TOKEN_INFO: 'https://coinmarketcap.com/currencies/worldcoin/',
  },
};

// Función para obtener URL completa
export const getFullUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl}${endpoint}`;
};

// Función para validar URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Función para obtener URL de transacción en Etherscan
export const getEtherscanTxUrl = (txHash: string): string => {
  return `${URLS.APIS.ETHERSCAN}/tx/${txHash}`;
};

// Función para obtener URL de dirección en Etherscan
export const getEtherscanAddressUrl = (address: string): string => {
  return `${URLS.APIS.ETHERSCAN}/address/${address}`;
};

// Función para obtener URL de token en Etherscan
export const getEtherscanTokenUrl = (tokenAddress: string): string => {
  return `${URLS.APIS.ETHERSCAN}/token/${tokenAddress}`;
};

export default URLS; 