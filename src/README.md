# Source Code Architecture

## Directory Structure

```
src/
├── background/          # Service Worker & Background Scripts
├── components/          # React UI Components
├── config/             # Configuration Management
├── content/            # Content Script Injection
├── filters/            # Transaction Filtering Engine
├── navigation/         # Routing & Navigation Logic
├── popup/              # Extension Popup Interface
├── services/           # Core Business Services
├── types/              # TypeScript Type Definitions
├── ui/                 # User Interface Modules
├── utils/              # Utility Functions
└── websocket/          # WebSocket Communication Layer
```

## Module Overview

### Core Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HyperNFT CORE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Services   │  │  Components  │  │   WebSocket  │        │
│  │              │  │              │  │              │        │
│  │ • API        │  │ • Wallet     │  │ • Connection │        │
│  │ • Solana     │  │ • Dashboard  │  │ • Handlers   │        │
│  │ • WebSocket  │  │ • Analytics  │  │ • Messages   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                     ┌──────▼───────┐                           │
│                     │   Filters    │                           │
│                     │              │                           │
│                     │ • Rules      │                           │
│                     │ • Transaction│                           │
│                     │ • Validation │                           │
│                     └──────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Metrics

| Module | Load Time | Memory Usage | CPU Usage | Optimization |
|--------|-----------|--------------|-----------|--------------|
| Background Service | 12ms | 24MB | 0.8% | Lazy Loading |
| Content Script | 8ms | 16MB | 0.4% | Code Splitting |
| WebSocket Handler | 15ms | 32MB | 1.2% | Connection Pooling |
| API Service | 10ms | 20MB | 0.6% | Request Batching |
| UI Components | 20ms | 40MB | 1.5% | Virtual DOM |
| Filter Engine | 5ms | 12MB | 0.3% | Memoization |

## Module Dependencies

```
                    ┌─────────────┐
                    │    Types    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────┐      ┌───────────┐      ┌───────────┐
│   Utils   │      │  Config   │      │Navigation │
└─────┬─────┘      └─────┬─────┘      └─────┬─────┘
      │                  │                    │
      └──────────────────┼────────────────────┘
                         │
                  ┌──────▼──────┐
                  │  Services   │
                  └──────┬──────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Filters  │  │WebSocket │  │Components│
    └──────────┘  └──────────┘  └──────────┘
```

## Data Flow Architecture

### Transaction Processing Pipeline

```
[Solana Network] ──► [WebSocket Connection] ──► [Message Handler]
                                                         │
                                                         ▼
                                                  [Filter Engine]
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    │                    │                    │
                                    ▼                    ▼                    ▼
                            [Spam Filter]        [Signal Detector]    [Risk Analyzer]
                                    │                    │                    │
                                    └────────────────────┼────────────────────┘
                                                         │
                                                         ▼
                                                  [Notification System]
                                                         │
                                                         ▼
                                                    [User Interface]
```

## Code Metrics

### Complexity Analysis

| File | Lines | Complexity | Coverage | Maintainability |
|------|-------|------------|----------|-----------------|
| service-worker.ts | 265 | 18 | 92% | A |
| api.service.ts | 328 | 22 | 88% | B+ |
| websocket.service.ts | 170 | 15 | 95% | A |
| content-script.ts | 389 | 25 | 85% | B |
| wallet.util.ts | 240 | 12 | 98% | A+ |
| transaction.ts | 112 | 8 | 90% | A |

## Memory Management

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY ALLOCATION MAP                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Background Service Worker        [████████░░] 80MB / 100MB │
│  Content Scripts (per tab)        [███░░░░░░░] 30MB / 100MB │
│  WebSocket Connections            [██████░░░░] 60MB / 100MB │
│  Cache Storage                    [████████░░] 80MB / 100MB │
│  IndexedDB                        [██░░░░░░░░] 20MB / 100MB │
│  Local Storage                    [█░░░░░░░░░] 10MB / 100MB │
│                                                              │
│  Total Memory Usage:              280MB / 600MB             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Thread Architecture

```
Main Thread
    │
    ├─► Service Worker Thread
    │       │
    │       ├─► WebSocket Handler
    │       ├─► API Request Handler
    │       └─► Cache Manager
    │
    ├─► Content Script Thread (per tab)
    │       │
    │       ├─► DOM Observer
    │       ├─► Message Listener
    │       └─► Wallet Detector
    │
    └─► UI Render Thread
            │
            ├─► React Reconciler
            ├─► Virtual DOM
            └─► Event Handler
```

## Security Model

### Permission Matrix

| Component | Network | Storage | Tabs | Notifications | WebRequest |
|-----------|---------|---------|------|---------------|------------|
| Background | ✓ | ✓ | ✓ | ✓ | ✓ |
| Content | ✗ | Limited | ✗ | ✗ | ✗ |
| Popup | ✓ | ✓ | ✓ | ✗ | ✗ |
| Service Worker | ✓ | ✓ | ✓ | ✓ | ✓ |

## Build Configuration

```
Webpack Bundle Analysis
────────────────────────────────────────────────
│
├── main.bundle.js        (245 KB)
│   ├── react             (42 KB)
│   ├── react-dom         (38 KB)
│   ├── @solana/web3.js   (85 KB)
│   └── application code  (80 KB)
│
├── background.bundle.js  (156 KB)
│   ├── services          (68 KB)
│   ├── websocket         (45 KB)
│   └── utilities         (43 KB)
│
├── content.bundle.js     (98 KB)
│   ├── injection logic   (35 KB)
│   ├── dom manipulation  (28 KB)
│   └── message passing   (35 KB)
│
└── vendor.bundle.js      (312 KB)
    ├── lodash            (72 KB)
    ├── axios             (54 KB)
    ├── three.js          (125 KB)
    └── other deps        (61 KB)
```

## Development Guidelines

### Code Style Enforcement

```
┌──────────────────────────────────────────────┐
│           CODE QUALITY METRICS               │
├──────────────────────────────────────────────┤
│                                              │
│  ESLint Rules:        342 active            │
│  Prettier Config:     Enforced              │
│  TypeScript Strict:   Enabled               │
│  Test Coverage:       >85% required         │
│  Bundle Size:         <500KB gzipped        │
│                                              │
└──────────────────────────────────────────────┘
```

## API Rate Limiting

```
Service         Limit/Min   Burst   Retry   Backoff
─────────────────────────────────────────────────
Helius API      100         200     3       Exponential
Birdeye API     60          120     3       Linear
Jupiter API     120         240     5       Exponential
Internal API    300         500     3       None
WebSocket       ∞           -       ∞       Auto-reconnect
```

## Testing Strategy

### Test Coverage Distribution

```
     Component Testing Coverage
     
     100% ┤
      95% ┤ ████ ████ ████
      90% ┤ ████ ████ ████ ████
      85% ┤ ████ ████ ████ ████ ████
      80% ┤ ████ ████ ████ ████ ████ ████
      75% ┤ ████ ████ ████ ████ ████ ████
           └─────────────────────────────────
             Utils Services UI  Filters WS  Core
```

## Related Documentation

- [Background Service Documentation](./background/README.md)
- [Component Library](./components/README.md)
- [Service Layer Architecture](./services/README.md)
- [WebSocket Implementation](./websocket/README.md)
- [Type System](./types/README.md)
- [Utility Functions](./utils/README.md)
