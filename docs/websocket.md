# 🔌 WebSocket Implementation Guide

## Overview

The Lemora WebSocket API provides real-time, bidirectional communication for instant wallet updates, transaction notifications, and live market data. This guide covers implementation, best practices, and advanced features.

## 🚀 Quick Start

### Connection URL

```
Production: wss://ws.lemora.io/v1
Staging: wss://staging-ws.lemora.io/v1
Development: ws://localhost:8080/v1
```

### Basic Connection

```javascript
// JavaScript/TypeScript
const ws = new WebSocket('wss://ws.lemora.io/v1');

ws.onopen = () => {
  console.log('Connected to Lemora WebSocket');
  
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    apiKey: 'your_api_key'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket');
};
```

## 📋 Message Protocol

### Message Structure

All messages follow this structure:

```typescript
interface WebSocketMessage {
  id?: string;        // Unique message ID
  type: string;       // Message type
  action?: string;    // Action to perform
  data?: any;         // Payload
  timestamp: number;  // Unix timestamp
  sequence?: number;  // Message sequence number
}
```

### Authentication

```javascript
// Initial authentication
{
  "type": "auth",
  "apiKey": "your_api_key",
  "timestamp": 1703090400
}

// Response
{
  "type": "auth_success",
  "sessionId": "session_abc123",
  "permissions": ["read", "write", "subscribe"],
  "rateLimits": {
    "messagesPerMinute": 100,
    "subscriptionsMax": 50
  }
}
```

## 📊 Subscription Types

### 1. Wallet Tracking

```javascript
// Subscribe to wallet updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'wallet',
  data: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    chains: ['ethereum', 'bsc', 'polygon'],
    events: ['transaction', 'balance', 'token_transfer']
  }
}));

// Receive updates
{
  "type": "wallet_update",
  "channel": "wallet",
  "data": {
    "address": "0x742d35Cc...",
    "event": "transaction",
    "transaction": {
      "hash": "0xabc...",
      "from": "0x742d35Cc...",
      "to": "0x9f8c...",
      "value": "1000000000000000000",
      "timestamp": 1703090500
    }
  }
}
```

### 2. Price Feeds

```javascript
// Subscribe to price updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'prices',
  data: {
    tokens: ['ETH', 'BTC', 'BNB'],
    interval: 1000 // milliseconds
  }
}));

// Price update
{
  "type": "price_update",
  "channel": "prices",
  "data": {
    "ETH": {
      "usd": 2250.45,
      "change24h": 5.2,
      "volume24h": 12500000000
    },
    "BTC": {
      "usd": 43250.80,
      "change24h": 3.1,
      "volume24h": 25000000000
    }
  }
}
```

### 3. Alert Notifications

```javascript
// Subscribe to alerts
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'alerts',
  data: {
    severity: ['high', 'critical'],
    types: ['whale_movement', 'unusual_activity', 'smart_money']
  }
}));

// Alert notification
{
  "type": "alert",
  "channel": "alerts",
  "data": {
    "id": "alert_123",
    "severity": "high",
    "type": "whale_movement",
    "title": "Large Transfer Detected",
    "description": "500 ETH moved from Binance to unknown wallet",
    "metadata": {
      "amount": "500",
      "token": "ETH",
      "value_usd": 1125000,
      "from": "Binance",
      "to": "0x9f8c..."
    }
  }
}
```

## 🛠️ Advanced Features

### Heartbeat & Keep-Alive

```javascript
// Client heartbeat
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'ping',
      timestamp: Date.now()
    }));
  }
}, 30000); // Every 30 seconds

// Server response
{
  "type": "pong",
  "timestamp": 1703090400,
  "serverTime": 1703090400
}
```

### Request-Response Pattern

```javascript
// Request with ID
const requestId = generateUUID();
ws.send(JSON.stringify({
  id: requestId,
  type: 'request',
  action: 'get_wallet_info',
  data: {
    address: '0x742d35Cc...'
  }
}));

// Response with matching ID
{
  "id": "same_request_id",
  "type": "response",
  "success": true,
  "data": {
    "address": "0x742d35Cc...",
    "balance": "145.5",
    "transactionCount": 1523,
    "riskScore": 35
  }
}
```

### Batch Operations

```javascript
// Batch subscribe
ws.send(JSON.stringify({
  type: 'batch',
  operations: [
    {
      type: 'subscribe',
      channel: 'wallet',
      data: { address: '0x111...' }
    },
    {
      type: 'subscribe',
      channel: 'wallet',
      data: { address: '0x222...' }
    },
    {
      type: 'subscribe',
      channel: 'prices',
      data: { tokens: ['ETH', 'BTC'] }
    }
  ]
}));
```

## 🔄 Connection Management

### Reconnection Strategy

```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.reconnectInterval = 1000;
    this.maxReconnectInterval = 30000;
    this.reconnectDecay = 1.5;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.reconnectInterval = 1000;
    };
    
    this.ws.onclose = () => {
      console.log('Disconnected');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('Error:', error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const timeout = Math.min(
      this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts),
      this.maxReconnectInterval
    );
    
    console.log(`Reconnecting in ${timeout}ms...`);
    
    setTimeout(() => {
      this.connect();
    }, timeout);
  }
}
```

### Connection States

```javascript
// Monitor connection state
const connectionStates = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

function getConnectionState(ws) {
  switch(ws.readyState) {
    case WebSocket.CONNECTING:
      return 'Connecting...';
    case WebSocket.OPEN:
      return 'Connected';
    case WebSocket.CLOSING:
      return 'Closing...';
    case WebSocket.CLOSED:
      return 'Disconnected';
    default:
      return 'Unknown';
  }
}
```

## 📊 Data Streaming

### Real-time Transaction Stream

```javascript
// Subscribe to transaction stream
ws.send(JSON.stringify({
  type: 'stream',
  channel: 'transactions',
  filters: {
    minValue: '1000000000000000000', // 1 ETH
    chains: ['ethereum'],
    includeInternal: false
  }
}));

// Streaming data
{
  "type": "stream_data",
  "channel": "transactions",
  "data": {
    "hash": "0xabc...",
    "from": "0x111...",
    "to": "0x222...",
    "value": "5000000000000000000",
    "gasPrice": "30000000000",
    "timestamp": 1703090400
  }
}
```

### Aggregated Data Feeds

```javascript
// Subscribe to aggregated metrics
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'metrics',
  data: {
    interval: '1m', // 1 minute aggregation
    metrics: ['volume', 'transaction_count', 'gas_average']
  }
}));
```

## 🔒 Security

### Secure Connection

```javascript
// Always use WSS in production
const ws = new WebSocket('wss://ws.lemora.io/v1', {
  headers: {
    'Authorization': 'Bearer your_token',
    'X-API-Key': 'your_api_key'
  }
});
```

### Message Validation

```javascript
function validateMessage(message) {
  // Check message structure
  if (!message.type || !message.timestamp) {
    throw new Error('Invalid message structure');
  }
  
  // Verify timestamp (prevent replay attacks)
  const currentTime = Date.now();
  const messageTime = message.timestamp * 1000;
  const maxAge = 60000; // 60 seconds
  
  if (Math.abs(currentTime - messageTime) > maxAge) {
    throw new Error('Message timestamp out of range');
  }
  
  // Validate signature if present
  if (message.signature) {
    const isValid = verifySignature(message);
    if (!isValid) {
      throw new Error('Invalid message signature');
    }
  }
  
  return true;
}
```

## 📈 Performance Optimization

### Message Compression

```javascript
// Enable compression
const ws = new WebSocket('wss://ws.lemora.io/v1', {
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    threshold: 1024 // Compress messages > 1KB
  }
});
```

### Buffering & Throttling

```javascript
class MessageBuffer {
  constructor(ws, maxSize = 100, flushInterval = 100) {
    this.ws = ws;
    this.buffer = [];
    this.maxSize = maxSize;
    this.flushInterval = flushInterval;
    
    setInterval(() => this.flush(), flushInterval);
  }
  
  send(message) {
    this.buffer.push(message);
    
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
  }
  
  flush() {
    if (this.buffer.length === 0) return;
    
    if (this.ws.readyState === WebSocket.OPEN) {
      const batch = {
        type: 'batch',
        messages: this.buffer
      };
      
      this.ws.send(JSON.stringify(batch));
      this.buffer = [];
    }
  }
}
```

## 🐛 Error Handling

### Error Types

```javascript
// Error message format
{
  "type": "error",
  "error": {
    "code": "SUBSCRIPTION_LIMIT_EXCEEDED",
    "message": "Maximum subscription limit reached",
    "details": {
      "current": 50,
      "maximum": 50
    }
  }
}

// Error codes
const ErrorCodes = {
  AUTH_FAILED: 'Authentication failed',
  RATE_LIMIT: 'Rate limit exceeded',
  INVALID_MESSAGE: 'Invalid message format',
  SUBSCRIPTION_FAILED: 'Subscription failed',
  PERMISSION_DENIED: 'Permission denied',
  INTERNAL_ERROR: 'Internal server error'
};
```

### Error Recovery

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'error') {
    handleError(message.error);
  }
};

function handleError(error) {
  switch(error.code) {
    case 'AUTH_FAILED':
      // Re-authenticate
      reauthenticate();
      break;
    case 'RATE_LIMIT':
      // Back off and retry
      setTimeout(() => retryLastRequest(), 5000);
      break;
    case 'SUBSCRIPTION_FAILED':
      // Retry subscription with different parameters
      retrySubscription(error.details);
      break;
    default:
      console.error('Unhandled error:', error);
  }
}
```

## 📚 Client Libraries

### JavaScript/TypeScript

```bash
npm install @lemora/websocket-client
```

```javascript
import { LemoraWebSocket } from '@lemora/websocket-client';

const client = new LemoraWebSocket({
  apiKey: 'your_api_key',
  autoReconnect: true,
  debug: true
});

client.on('wallet_update', (data) => {
  console.log('Wallet updated:', data);
});

client.subscribeToWallet('0x742d35Cc...');
```

### Python

```python
pip install lemora-websocket
```

```python
from lemora_websocket import LemoraWebSocket

def on_wallet_update(data):
    print(f"Wallet updated: {data}")

client = LemoraWebSocket(api_key="your_api_key")
client.on("wallet_update", on_wallet_update)
client.subscribe_to_wallet("0x742d35Cc...")
client.connect()
```

## 🔧 Testing

### WebSocket Testing Tool

```javascript
// Test client for debugging
class WebSocketTester {
  constructor(url) {
    this.url = url;
    this.messageLog = [];
  }
  
  async test() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      const startTime = Date.now();
      
      ws.onopen = () => {
        console.log(`✅ Connected in ${Date.now() - startTime}ms`);
        
        // Test authentication
        ws.send(JSON.stringify({
          type: 'auth',
          apiKey: 'test_key'
        }));
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messageLog.push(message);
        console.log(`📥 Received: ${message.type}`);
        
        if (message.type === 'auth_success') {
          // Test subscription
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel: 'test'
          }));
        }
      };
      
      ws.onerror = (error) => {
        console.error(`❌ Error: ${error}`);
        reject(error);
      };
      
      ws.onclose = () => {
        console.log(`🔌 Disconnected`);
        resolve(this.messageLog);
      };
      
      // Close after 10 seconds
      setTimeout(() => ws.close(), 10000);
    });
  }
}
```

## 📊 Monitoring & Metrics

### Connection Metrics

```javascript
class WebSocketMetrics {
  constructor() {
    this.metrics = {
      messagesReceived: 0,
      messagesSent: 0,
      bytesReceived: 0,
      bytesSent: 0,
      errors: 0,
      reconnections: 0,
      latency: []
    };
  }
  
  trackMessage(direction, data) {
    const bytes = new Blob([data]).size;
    
    if (direction === 'sent') {
      this.metrics.messagesSent++;
      this.metrics.bytesSent += bytes;
    } else {
      this.metrics.messagesReceived++;
      this.metrics.bytesReceived += bytes;
    }
  }
  
  trackLatency(ms) {
    this.metrics.latency.push(ms);
    if (this.metrics.latency.length > 100) {
      this.metrics.latency.shift();
    }
  }
  
  getAverageLatency() {
    const sum = this.metrics.latency.reduce((a, b) => a + b, 0);
    return sum / this.metrics.latency.length || 0;
  }
  
  report() {
    return {
      ...this.metrics,
      averageLatency: this.getAverageLatency()
    };
  }
}
```

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Connection drops frequently | Check network stability, implement reconnection logic |
| High latency | Use regional endpoints, enable compression |
| Messages out of order | Check sequence numbers, implement ordering |
| Authentication fails | Verify API key, check expiration |
| Rate limiting | Implement backoff, upgrade plan |

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('ws_debug', 'true');

// Debug wrapper
class DebugWebSocket extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);
    
    const originalSend = this.send.bind(this);
    this.send = (data) => {
      console.log('📤 Sending:', data);
      originalSend(data);
    };
    
    this.addEventListener('message', (event) => {
      console.log('📥 Received:', event.data);
    });
  }
}
```

## 📚 Resources

- [WebSocket API Reference](https://docs.lemora.io/websocket)
- [Example Applications](https://github.com/lemora/websocket-examples)
- [Performance Best Practices](https://docs.lemora.io/websocket/performance)
- [Security Guidelines](https://docs.lemora.io/websocket/security)

---

*Last updated: December 2024*
*WebSocket API Version: 2.0.0*

[Back to API Docs](./api/README.md) | [Home](../README.md)
