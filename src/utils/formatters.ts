// Formatear precio en USD
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
};

// Formatear porcentaje
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

// Formatear market cap
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  }
  return formatPrice(marketCap);
};

// Formatear volumen
export const formatVolume = (volume: number): string => {
  return formatMarketCap(volume);
};

// Formatear fecha
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Formatear fecha y hora
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formatear dirección de wallet
export const formatWalletAddress = (address: string): string => {
  if (address.length <= 12) return address;
  return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
};

// Formatear hash de transacción
export const formatTransactionHash = (hash: string): string => {
  if (hash.length <= 16) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
};

// Formatear cantidad de WLD
export const formatWLDAmount = (amount: number): string => {
  return `${amount.toFixed(4)} WLD`;
};

// Formatear número con separadores de miles
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number);
};

// Obtener color basado en el cambio de precio
export const getPriceChangeColor = (change: number): string => {
  return change >= 0 ? '#4CAF50' : '#F44336';
};

// Obtener icono de cambio de precio
export const getPriceChangeIcon = (change: number): string => {
  return change >= 0 ? '↗️' : '↘️';
};

// Calcular tiempo transcurrido
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace un momento';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else {
    return formatDate(date);
  }
}; 