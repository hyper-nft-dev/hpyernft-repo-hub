# 🌐 Lemora Chrome Extension Guide

## Overview

The Lemora Chrome Extension is your gateway to real-time wallet tracking and AI-powered crypto insights directly from your browser. This comprehensive guide covers installation, configuration, and advanced features.

## 🚀 Installation

### System Requirements

- **Chrome Browser**: Version 100 or higher
- **Operating System**: Windows 10+, macOS 10.14+, Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Internet**: Stable connection required

### Installation Steps

1. **Chrome Web Store Method** (Recommended)
   ```
   1. Visit: https://chromewebstore.google.com/detail/lemora
   2. Click "Add to Chrome"
   3. Confirm "Add Extension" in popup
   4. Extension icon appears in toolbar
   ```

2. **Manual Installation** (Developer Mode)
   ```bash
   # Clone repository
   git clone https://github.com/lemora/chrome-extension
   
   # Install dependencies
   cd chrome-extension
   npm install
   
   # Build extension
   npm run build
   
   # Load in Chrome:
   1. Open chrome://extensions/
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select the 'dist' folder
   ```

## 🎯 Core Features

### Wallet Tracking Dashboard

The main dashboard provides:

- **Real-time Balance Updates**: Live wallet balances across all chains
- **Transaction Feed**: Instant transaction notifications
- **Portfolio Analytics**: Total value, P&L, distribution charts
- **AI Risk Scores**: 0-100 risk assessment for each wallet
- **Quick Actions**: One-click to view on explorer, copy address, etc.

### Smart Notifications System

Configure intelligent alerts:

```javascript
// Notification Configuration Example
{
  "enabled": true,
  "types": {
    "largeTransfer": {
      "threshold": 10000,  // USD value
      "sound": true,
      "priority": "high"
    },
    "newToken": {
      "enabled": true,
      "excludeSpam": true
    },
    "whaleActivity": {
      "minValue": 100000,
      "chains": ["ethereum", "bsc"]
    }
  }
}
```

### AI-Powered Analysis

Our ML models analyze:

- **Behavior Patterns**: Trading strategies, accumulation/distribution
- **Risk Assessment**: Rug pull detection, suspicious activity flags
- **Smart Money Tracking**: Follow institutional wallets
- **Predictive Insights**: Potential next moves based on history

## 🔧 Configuration

### Initial Setup

1. **Account Creation**
   ```
   Extension Icon → Sign Up → Enter Details → Verify Email
   ```

2. **API Key Configuration** (Optional for Pro Features)
   ```
   Settings → API → Enter Key → Test Connection
   ```

3. **Network Selection**
   ```
   Settings → Networks → Select Chains → Configure RPCs
   ```

### Advanced Settings

#### Performance Optimization

```json
{
  "performance": {
    "updateInterval": 5000,      // milliseconds
    "maxConcurrentRequests": 5,
    "cacheTimeout": 300000,      // 5 minutes
    "backgroundSync": true,
    "reduceAnimations": false
  }
}
```

#### Privacy & Security

```json
{
  "privacy": {
    "hideBalances": false,
    "blurAddresses": false,
    "disableAnalytics": false,
    "clearDataOnClose": false,
    "encryptLocalStorage": true
  }
}
```

## 📊 User Interface

### Main Components

#### 1. Popup Window (400x600px)

```
┌─────────────────────────────┐
│  🔍 Search Bar              │
├─────────────────────────────┤
│  Portfolio: $125,432.50     │
│  24h: +5.2% ▲               │
├─────────────────────────────┤
│  Tracked Wallets (5)        │
│  ┌───────────────────────┐  │
│  │ 0x742d... | $45,231   │  │
│  │ Risk: 35 | ▲ +2.1%    │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 0x9f8c... | $32,100   │  │
│  │ Risk: 72 | ▼ -1.5%    │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  [+ Add Wallet] [Settings]  │
└─────────────────────────────┘
```

#### 2. Options Page (Full Screen)

- **Dashboard Tab**: Complete portfolio overview
- **Wallets Tab**: Manage tracked addresses
- **Alerts Tab**: Configure notifications
- **Analytics Tab**: Charts and insights
- **Settings Tab**: Preferences and configuration

#### 3. Content Scripts

Injects features into supported sites:

- **Etherscan Enhancement**: Quick track button on addresses
- **DEX Integration**: Track wallets from Uniswap, PancakeSwap
- **Twitter Integration**: Detect and track mentioned addresses

## 🛠️ Advanced Features

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + L` | Open Lemora popup |
| `Alt + T` | Quick track wallet |
| `Alt + A` | View all alerts |
| `Alt + S` | Search transactions |
| `Ctrl + Shift + L` | Open options page |

### Command Palette

Access via `Ctrl+Shift+P`:

```
> track wallet 0x742d35Cc...
> analyze risk
> export data csv
> clear cache
> toggle notifications
```

### Context Menu Integration

Right-click options:

- **On any Ethereum address**: "Track with Lemora"
- **On transaction hash**: "Analyze Transaction"
- **On token symbol**: "Track Token Holders"

## 🔌 API & Webhooks

### Extension API

```javascript
// Interact with extension programmatically
chrome.runtime.sendMessage(
  extensionId,
  {
    action: 'trackWallet',
    data: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      chain: 'ethereum',
      label: 'Whale Wallet'
    }
  },
  response => console.log(response)
);
```

### Webhook Configuration

```javascript
// Set up webhooks for external integrations
{
  "webhooks": [
    {
      "url": "https://your-server.com/webhook",
      "events": ["large_transfer", "new_wallet", "high_risk"],
      "secret": "your-webhook-secret",
      "retryPolicy": {
        "maxAttempts": 3,
        "backoffMultiplier": 2
      }
    }
  ]
}
```

## 📈 Data Management

### Export Options

- **CSV Export**: Transaction history, portfolio snapshots
- **JSON Export**: Complete data with metadata
- **PDF Reports**: Professional analysis reports
- **API Access**: Programmatic data retrieval

### Backup & Sync

```javascript
// Automatic backup configuration
{
  "backup": {
    "enabled": true,
    "frequency": "daily",
    "encryption": true,
    "destinations": ["google_drive", "local"]
  }
}
```

## 🎨 Customization

### Theme Customization

```css
/* Custom CSS for extension */
:root {
  --primary-color: #6B46C1;
  --background: #1a1a1a;
  --text-primary: #ffffff;
  --alert-high: #ff4444;
  --alert-medium: #ffaa00;
  --alert-low: #00ff00;
}
```

### Custom Indicators

Create your own tracking indicators:

```javascript
// Custom indicator example
const customIndicator = {
  name: "Accumulation Score",
  calculate: (wallet) => {
    const buyCount = wallet.transactions.filter(tx => tx.type === 'buy').length;
    const sellCount = wallet.transactions.filter(tx => tx.type === 'sell').length;
    return (buyCount / (buyCount + sellCount)) * 100;
  },
  threshold: 70,
  alertOnCross: true
};
```

## 🔒 Security Features

### Data Protection

- **End-to-end encryption** for sensitive data
- **Local storage encryption** with AES-256
- **No private keys stored** or transmitted
- **OAuth 2.0** for API authentication
- **2FA support** for account access

### Permissions Explained

| Permission | Purpose |
|------------|---------|
| `storage` | Save settings and tracked wallets |
| `notifications` | Send alert notifications |
| `alarms` | Schedule periodic updates |
| `tabs` | Inject tracking buttons on websites |
| `contextMenus` | Right-click functionality |

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Extension not updating | Clear cache: Settings → Clear Data |
| High memory usage | Reduce update frequency in settings |
| Notifications not showing | Check Chrome notification settings |
| Sync issues | Re-authenticate in settings |
| Slow performance | Disable unused chains |

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// In extension console
localStorage.setItem('debug', 'true');
location.reload();
```

### Performance Monitoring

```javascript
// Check extension performance
chrome.runtime.getBackgroundPage(bg => {
  console.log('Memory:', bg.performance.memory);
  console.log('CPU:', bg.performance.now());
});
```

## 📚 Resources

### Documentation
- [API Reference](https://docs.lemora.io/api)
- [Video Tutorials](https://youtube.com/lemora)
- [GitHub Repository](https://github.com/lemora/chrome-extension)

### Support
- 📧 Email: extension@lemora.io
- 💬 Discord: [discord.gg/lemora](https://discord.gg/lemora)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/lemora/chrome-extension/issues)

### Updates
- Follow [@LemoraAI](https://twitter.com/LemoraAI) for updates
- Join our [Telegram](https://t.me/lemora) for announcements
- Check [Changelog](https://github.com/lemora/chrome-extension/blob/main/CHANGELOG.md)

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Dec 2024 | AI integration, multi-chain support |
| 1.5.0 | Oct 2024 | Performance improvements, new UI |
| 1.0.0 | Jul 2024 | Initial release |

---

*Last updated: December 2024*
*Extension Version: 2.0.0*

[Back to User Guide](./user-guide.md) | [Telegram Bot Guide](./telegram-bot.md) | [Home](../README.md)
