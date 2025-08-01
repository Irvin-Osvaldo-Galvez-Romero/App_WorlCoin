# Integración con World App - Guía Completa

Esta guía te ayudará a configurar la integración real con World App para tu aplicación WLD Wallet.

## 🚀 Configuración Inicial

### 1. Obtener Credenciales de World App

Para integrar con World App, necesitas:

1. **Registrarte en Worldcoin Developer Portal**
   - Ve a [developer.worldcoin.org](https://developer.worldcoin.org)
   - Crea una cuenta de desarrollador
   - Solicita acceso a la API

2. **Crear una Aplicación**
   - Crea una nueva aplicación en el portal
   - Obtén tu `APP_ID` único
   - Configura los permisos necesarios

3. **Configurar Orb**
   - Decide si usarás Orb en modo `staging` o `production`
   - Configura los parámetros de verificación

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# World App Configuration
EXPO_PUBLIC_WORLD_APP_ID=app_staging_1234567890abcdef
EXPO_PUBLIC_WORLD_ACTION_NAME=verify_wld_wallet
EXPO_PUBLIC_WORLD_SIGNAL=user_wallet_verification
EXPO_PUBLIC_ORB_ENVIRONMENT=staging

# Blockchain Configuration
EXPO_PUBLIC_CHAIN_ID=1
EXPO_PUBLIC_RPC_URL=https://ethereum.publicnode.com
EXPO_PUBLIC_WLD_CONTRACT_ADDRESS=0x163f8C2617924dF3bD4C9C5C3b5C5C3b5C5C3b5C5
EXPO_PUBLIC_EXPLORER_URL=https://etherscan.io

# Feature Flags
EXPO_PUBLIC_ENABLE_REAL_TRANSACTIONS=true
EXPO_PUBLIC_ENABLE_WORLD_ID_VERIFICATION=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
```

## 🔧 Implementación de World ID

### 1. Instalar Dependencias

```bash
npm install @worldcoin/world-id-js
```

### 2. Configurar World ID

Actualiza el archivo `src/services/worldAppIntegration.ts`:

```typescript
import { WorldID } from '@worldcoin/world-id-js';

// Reemplaza la función simulateWorldIdVerification con:
private async initiateWorldIdVerification(): Promise<{ credential: string }> {
  try {
    const worldId = new WorldID({
      app_id: ENV.WORLD_APP.APP_ID,
      action: ENV.WORLD_APP.ACTION_NAME,
      signal: ENV.WORLD_APP.SIGNAL,
    });

    const result = await worldId.verify();
    
    return {
      credential: result.credential,
    };
  } catch (error) {
    console.error('Error in World ID verification:', error);
    throw error;
  }
}
```

### 3. Configurar Orb

Para usar Orb en producción:

1. **Configurar Orb Device**
   - Sigue la guía de configuración de Orb
   - Configura la cámara y sensores
   - Verifica la conectividad

2. **Configurar Verificación**
   ```typescript
   const worldId = new WorldID({
     app_id: ENV.WORLD_APP.APP_ID,
     action: ENV.WORLD_APP.ACTION_NAME,
     signal: ENV.WORLD_APP.SIGNAL,
     orb_environment: ENV.WORLD_APP.ORB_ENVIRONMENT,
   });
   ```

## 💰 Integración con Blockchain

### 1. Configurar Contrato WLD

El token WLD tiene la siguiente dirección en Ethereum Mainnet:
```
0x163f8C2617924dF3bD4C9C5C3b5C5C3b5C5C3b5C5
```

### 2. ABI del Contrato WLD

```typescript
const WLD_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];
```

### 3. Configurar Provider

```typescript
// Para Ethereum Mainnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://ethereum.publicnode.com'
);

// Para usar Infura (recomendado para producción)
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`
);
```

## 🔐 Seguridad

### 1. Almacenamiento Seguro de Claves

```typescript
import * as SecureStore from 'expo-secure-store';

// Guardar clave privada de forma segura
await SecureStore.setItemAsync('wallet_private_key', privateKey);

// Recuperar clave privada
const privateKey = await SecureStore.getItemAsync('wallet_private_key');
```

### 2. Validación de Transacciones

```typescript
// Validar dirección antes de enviar
const isValidAddress = ethers.utils.isAddress(toAddress);
if (!isValidAddress) {
  throw new Error('Invalid address');
}

// Validar cantidad
const amountWei = ethers.utils.parseEther(amount);
if (amountWei.lte(0)) {
  throw new Error('Amount must be greater than 0');
}
```

### 3. Manejo de Errores

```typescript
try {
  const tx = await contract.transfer(toAddress, amountWei);
  const receipt = await tx.wait();
  
  if (receipt.status === 0) {
    throw new Error('Transaction failed');
  }
  
  return receipt.transactionHash;
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    throw new Error('Insufficient WLD balance');
  }
  throw error;
}
```

## 📱 Configuración de la App

### 1. Configurar Permisos

En `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera for World ID verification."
        }
      ]
    ]
  }
}
```

### 2. Configurar Deep Links

```json
{
  "expo": {
    "scheme": "wldwallet",
    "ios": {
      "bundleIdentifier": "com.yourcompany.wldwallet"
    },
    "android": {
      "package": "com.yourcompany.wldwallet"
    }
  }
}
```

## 🧪 Testing

### 1. Modo de Desarrollo

```typescript
// En desarrollo, puedes usar datos simulados
if (__DEV__ && ENV.FEATURES.ENABLE_MOCK_DATA) {
  return {
    credential: 'mock_credential_' + Date.now(),
  };
}
```

### 2. Testing con Sepolia

```typescript
// Usar Sepolia testnet para testing
const SEPOLIA_CONFIG = {
  CHAIN_ID: 11155111,
  RPC_URL: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  WLD_CONTRACT_ADDRESS: '0x...', // Contrato WLD en Sepolia
};
```

### 3. Testing de Transacciones

```typescript
// Enviar transacción de prueba
const testTransaction = async () => {
  try {
    const txHash = await worldAppIntegration.sendWLDTransaction(
      walletAddress,
      '0.001'
    );
    console.log('Test transaction sent:', txHash);
  } catch (error) {
    console.error('Test transaction failed:', error);
  }
};
```

## 🚀 Despliegue

### 1. Configuración de Producción

```bash
# Variables de entorno para producción
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_ORB_ENVIRONMENT=production
EXPO_PUBLIC_WORLD_APP_ID=app_production_1234567890abcdef
EXPO_PUBLIC_ENABLE_REAL_TRANSACTIONS=true
```

### 2. Construir para Producción

```bash
# Android
npx expo build:android --release-channel production

# iOS
npx expo build:ios --release-channel production
```

### 3. Publicar en Stores

1. **Google Play Store**
   - Subir APK/AAB
   - Configurar descripción
   - Agregar capturas de pantalla

2. **App Store**
   - Subir IPA
   - Configurar metadatos
   - Revisión de Apple

## 🔍 Monitoreo y Analytics

### 1. Configurar Analytics

```typescript
import analytics from '@react-native-firebase/analytics';

// Track eventos importantes
await analytics.logEvent('wallet_connected', {
  wallet_address: walletAddress,
  world_id_verified: true,
});

await analytics.logEvent('transaction_sent', {
  amount: amount,
  to_address: toAddress,
});
```

### 2. Monitoreo de Errores

```typescript
import crashlytics from '@react-native-firebase/crashlytics';

// Reportar errores
crashlytics().recordError(error);
```

## 📞 Soporte

### Recursos Útiles

- [Worldcoin Developer Portal](https://developer.worldcoin.org)
- [World ID Documentation](https://docs.worldcoin.org/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Expo Documentation](https://docs.expo.dev/)

### Contacto

- **Worldcoin Support**: [support@worldcoin.org](mailto:support@worldcoin.org)
- **Developer Community**: [Discord](https://discord.gg/worldcoin)

---

**¡Con esta configuración tendrás una integración completa y segura con World App! 🚀** 