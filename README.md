# WLD Wallet - Wallet Complementaria de Worldcoin

Una aplicación móvil complementaria a la World App que te permite visualizar y gestionar tus tokens WLD con análisis detallado, predicciones de IA y recomendaciones de trading.

## 🚀 Características

### 📊 **Análisis de Mercado**
- Precio en tiempo real de WLD
- Gráficas de precios históricos
- Estadísticas de mercado (Market Cap, Volumen, etc.)
- Cambios de precio en 24h

### 🤖 **Inteligencia Artificial**
- Predicciones de precios a corto plazo
- Recomendaciones de trading (Comprar/Vender/Mantener)
- Análisis de tendencias de mercado
- Indicadores de confianza

### 💰 **Gestión de Wallet**
- Conexión con World App
- Historial completo de transacciones
- Balance de tokens WLD
- Seguimiento de fees

### 🎁 **Sistema de Recompensas**
- Recompensas diarias y semanales
- Recompensas por referidos
- Recompensas por actividades
- Sistema de reclamación

### 🔔 **Alertas y Notificaciones**
- Alertas de precio personalizables
- Notificaciones de transacciones
- Recordatorios de recompensas

## 📱 Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo y despliegue
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación entre pantallas
- **React Native Chart Kit** - Gráficas de precios
- **Axios** - Cliente HTTP para APIs
- **Expo Linear Gradient** - Efectos visuales

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu dispositivo móvil

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd App_WorlCoin
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

4. **Ejecutar en tu dispositivo**
   - Abre Expo Go en tu dispositivo móvil
   - Escanea el código QR que aparece en la terminal
   - La aplicación se cargará automáticamente

## 📱 Cómo Usar la Aplicación

### 1. **Pantalla de Inicio**
- Visualiza el precio actual de WLD
- Revisa la gráfica de precios históricos
- Consulta predicciones de IA
- Obtén recomendaciones de trading

### 2. **Transacciones**
- Conecta tu wallet de World App
- Revisa el historial de transacciones
- Monitorea tu balance total
- Filtra transacciones por tipo

### 3. **Recompensas**
- Completa actividades diarias
- Reclama recompensas pendientes
- Revisa estadísticas de recompensas
- Invita amigos y gana recompensas

## 🔧 Configuración de APIs

### CoinGecko API
La aplicación utiliza la API gratuita de CoinGecko para obtener datos de precios de WLD. No se requiere API key.

### World App Integration
La aplicación ya está configurada con tu ID de World App: `app_a7e97318974ea00c54d4efa63e4e9ffb`

### URLs Importantes
- **Worldcoin Developer Portal**: https://developer.worldcoin.org
- **World App**: https://worldcoin.org/world-app
- **Documentación**: https://docs.worldcoin.org
- **GitHub Repository**: https://github.com/tu-usuario/App_WorlCoin

Para configurar las variables de entorno:

1. **Crear archivo `.env` en la raíz del proyecto:**
   ```bash
   # Configuración de World App
   EXPO_PUBLIC_WORLD_APP_ID=app_a7e97318974ea00c54d4efa63e4e9ffb
   EXPO_PUBLIC_WORLD_ACTION_NAME=verify_wld_wallet
   EXPO_PUBLIC_WORLD_SIGNAL=user_wallet_verification
   EXPO_PUBLIC_ORB_ENVIRONMENT=staging

   # Configuración de Blockchain
   EXPO_PUBLIC_WLD_CONTRACT_ADDRESS=0x163f8C2617924c0E3C0b4C8C0C0C0C0C0C0C0C0C0
   EXPO_PUBLIC_RPC_URL=https://ethereum.publicnode.com
   EXPO_PUBLIC_CHAIN_ID=1
   EXPO_PUBLIC_EXPLORER_URL=https://etherscan.io

   # Configuración de URLs
   EXPO_PUBLIC_GITHUB_REPO_URL=https://github.com/tu-usuario/App_WorlCoin
   EXPO_PUBLIC_APP_WEBSITE=https://wld-wallet.com
   EXPO_PUBLIC_SUPPORT_URL=https://github.com/tu-usuario/App_WorlCoin/issues

   # Configuración de Features
   EXPO_PUBLIC_ENABLE_REAL_WORLD_APP=true
   EXPO_PUBLIC_ENABLE_AI_PREDICTIONS=true
   EXPO_PUBLIC_ENABLE_PRICE_ALERTS=true
   EXPO_PUBLIC_ENABLE_TRANSACTIONS=true
   EXPO_PUBLIC_ENABLE_REWARDS=true
   ```

2. **Reiniciar la aplicación después de crear el archivo `.env`**
   ```bash
   npx expo start --clear
   ```

## 🎨 Personalización

### Temas y Colores
La aplicación utiliza un tema oscuro moderno con:
- Color principal: `#667eea` (azul/púrpura)
- Fondo: `#121212` (gris muy oscuro)
- Tarjetas: `#2a2a2a` (gris oscuro)

### Modificar Estilos
Los estilos están organizados en archivos separados por componente. Puedes modificar los colores y estilos en:
- `src/components/` - Componentes reutilizables
- `src/screens/` - Pantallas principales

## 🚀 Despliegue

### Para Producción
1. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env
   EXPO_PUBLIC_API_URL=tu_api_url
   EXPO_PUBLIC_WORLD_APP_ID=tu_world_app_id
   ```

2. **Construir para producción**
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

3. **Publicar en stores**
   - Google Play Store (Android)
   - App Store (iOS)

## 🔒 Seguridad

### Mejores Prácticas
- Nunca almacenes claves privadas en el dispositivo
- Utiliza encriptación para datos sensibles
- Implementa autenticación biométrica
- Valida todas las transacciones

### Integración con World App
- Utiliza el SDK oficial de World App
- Implementa autenticación segura
- Maneja errores de conexión
- Valida transacciones antes de ejecutarlas

## 📈 Roadmap

### Versión 1.1
- [ ] Integración completa con World App
- [ ] Notificaciones push
- [ ] Más indicadores técnicos
- [ ] Exportar datos

### Versión 1.2
- [ ] Soporte para múltiples wallets
- [ ] Análisis de portafolio
- [ ] Integración con DEX
- [ ] Soporte para más tokens

### Versión 2.0
- [ ] Trading automático
- [ ] Análisis avanzado de IA
- [ ] Social trading
- [ ] Marketplace de estrategias

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de Expo

## 🙏 Agradecimientos

- Worldcoin Foundation por el proyecto
- CoinGecko por la API de precios
- Comunidad de React Native
- Contribuidores del proyecto

---

**¡Disfruta gestionando tus tokens WLD con análisis inteligente! 🚀** 