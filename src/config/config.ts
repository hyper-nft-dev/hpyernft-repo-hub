/**
 * HyperNFT - Main Configuration
 * Central configuration for the application
 */

export const CONFIG = {
  APP_NAME: 'HyperNFT',
  VERSION: '1.0.0',
  
  API: {
    HYPERNFT: {
      BASE_URL: 'https://api.hypernft.io/v1',
      GENERATION_URL: 'https://api.hypernft.io/v1/generate',
      MINTING_URL: 'https://api.hypernft.io/v1/mint',
      API_KEYS: [
        'your-hypernft-api-key-1',
        'your-hypernft-api-key-2'
      ],
      TIMEOUT: 60000,
      RETRY_ATTEMPTS: 3
    },
    
    ARWEAVE: {
      BASE_URL: 'https://arweave.net',
      GATEWAY_URL: 'https://gateway.arweave.net',
      API_KEY: 'your-arweave-api-key',
      TIMEOUT: 30000
    },
    
    IPFS: {
      BASE_URL: 'https://ipfs.io',
      GATEWAY_URL: 'https://gateway.ipfs.io',
      API_KEY: 'your-ipfs-api-key',
      TIMEOUT: 30000
    }
  },
  
  WEBSOCKET: {
    RECONNECT_INTERVAL: 5000,
    MAX_RECONNECT_ATTEMPTS: 10,
    HEARTBEAT_INTERVAL: 30000,
    MESSAGE_QUEUE_SIZE: 1000
  },
  
  GENERATION: {
    DEFAULT_STYLE: 'cyberpunk',
    DEFAULT_RESOLUTION: '1024x1024',
    MAX_BATCH_SIZE: 10,
    DEFAULT_CFG_SCALE: 7.5,
    DEFAULT_STEPS: 50,
    CACHE_DURATION: 3600000
  },
  
  UI: {
    THEME: {
      PRIMARY: '#00FF88',
      SECONDARY: '#FF00FF',
      BACKGROUND: '#0A0A0A',
      TEXT: '#FFFFFF',
      ERROR: '#FF3333',
      SUCCESS: '#00FF00',
      WARNING: '#FFAA00'
    },
    
    ANIMATIONS: {
      DURATION: 300,
      EASING: 'ease-in-out'
    },
    
    SIDEPANEL: {
      WIDTH: 400,
      POSITION: 'right'
    }
  },
  
  STORAGE: {
    PREFIX: 'hypernft_',
    ENCRYPTION_KEY: 'your-encryption-key',
    MAX_STORAGE_SIZE: 52428800 // 50MB for NFT storage
  },
  
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    MAX_CONCURRENT_REQUESTS: 5
  }
};
