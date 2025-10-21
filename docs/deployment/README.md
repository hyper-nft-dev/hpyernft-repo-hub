# 🚀 Lemora Deployment Guide

## Overview

This comprehensive guide covers the deployment process for the Lemora wallet tracking platform, including the web application, Chrome extension, API services, and infrastructure setup. Follow these instructions for production-ready deployments.

## 🏗️ Deployment Architecture

```ascii
┌────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    CDN (CloudFlare)                      │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                   │
│  ┌─────────────────────────▼───────────────────────────────┐  │
│  │                  Load Balancer (AWS ALB)                 │  │
│  └─────────┬─────────────────────────────────┬──────────────┘  │
│            │                                 │                 │
│  ┌─────────▼──────────┐           ┌─────────▼──────────┐     │
│  │   Web Application  │           │   API Services     │     │
│  │   (ECS Fargate)    │           │   (ECS Fargate)    │     │
│  └────────────────────┘           └─────────┬──────────┘     │
│                                             │                 │
│  ┌──────────────────────────────────────────▼──────────┐     │
│  │              Database Cluster (RDS Aurora)           │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Redis Cache   │  │  Message Queue  │  │  S3 Storage    │ │
│  │  (ElastiCache) │  │     (SQS)       │  │                │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                               │
└────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Node.js** | 16.x | 20.x LTS |
| **NPM** | 8.x | 10.x |
| **Docker** | 20.10 | Latest |
| **Kubernetes** | 1.24 | 1.28 |
| **PostgreSQL** | 13 | 15 |
| **Redis** | 6.2 | 7.2 |

### Required Tools

```bash
# Install required CLI tools
npm install -g pm2 webpack-cli
pip install awscli
curl -LO https://dl.k8s.io/release/v1.28.0/bin/linux/amd64/kubectl
```

## 🌐 Web Application Deployment

### 1. Build Process

```bash
# Clone repository
git clone https://github.com/lemora/lemora-app.git
cd lemora-app

# Install dependencies
npm ci --production=false

# Set environment variables
export NODE_ENV=production
export REACT_APP_API_URL=https://api.lemora.io
export REACT_APP_WS_URL=wss://ws.lemora.io

# Build application
npm run build

# Verify build
npm run test:production
```

### 2. Docker Container

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lemora-web
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lemora-web
  template:
    metadata:
      labels:
        app: lemora-web
    spec:
      containers:
      - name: web
        image: lemora/web:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: lemora-web-service
spec:
  selector:
    app: lemora-web
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔧 Chrome Extension Deployment

### 1. Build Extension

```bash
# Navigate to extension directory
cd chrome-extension

# Install dependencies
npm install

# Build for production
npm run build:production

# Create distribution package
npm run package

# Output: dist/lemora-extension.zip
```

### 2. Chrome Web Store Submission

```json
// manifest.json production settings
{
  "manifest_version": 3,
  "name": "Lemora Wallet Tracker",
  "version": "1.0.0",
  "description": "AI-powered wallet tracking and analysis",
  "permissions": [
    "storage",
    "alarms",
    "notifications"
  ],
  "host_permissions": [
    "https://api.lemora.io/*"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### 3. Automated Release

```yaml
# .github/workflows/extension-release.yml
name: Extension Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Build Extension
        run: |
          cd chrome-extension
          npm ci
          npm run build:production
          npm run package
      
      - name: Upload to Chrome Web Store
        uses: trmcnvn/chrome-addon@v2
        with:
          extension: ./dist/lemora-extension.zip
          publish: true
          client-id: ${{ secrets.CHROME_CLIENT_ID }}
          client-secret: ${{ secrets.CHROME_CLIENT_SECRET }}
          refresh-token: ${{ secrets.CHROME_REFRESH_TOKEN }}
```

## 🔌 API Services Deployment

### 1. API Server Configuration

```javascript
// server.config.js
module.exports = {
  port: process.env.PORT || 3000,
  cluster: {
    workers: process.env.WORKERS || 4,
    restartDelay: 3000
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  rateLimiting: {
    windowMs: 60000,
    max: 100
  }
};
```

### 2. PM2 Process Management

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lemora-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
```

### 3. AWS ECS Task Definition

```json
{
  "family": "lemora-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "lemora/api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"}
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lemora-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

## 🗄️ Database Deployment

### 1. PostgreSQL Setup

```sql
-- Initialize database
CREATE DATABASE lemora_production;
CREATE USER lemora_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE lemora_production TO lemora_app;

-- Create schema
\c lemora_production;

CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Performance optimizations
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
```

### 2. Database Migrations

```bash
# Run migrations
npm run migrate:production

# Rollback if needed
npm run migrate:rollback

# Generate new migration
npm run migrate:generate -- --name add_wallet_indexes
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

```nginx
# nginx.conf
server {
    listen 80;
    server_name lemora.io www.lemora.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lemora.io;
    
    ssl_certificate /etc/letsencrypt/live/lemora.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lemora.io/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Environment Variables

```bash
# .env.production
NODE_ENV=production
API_URL=https://api.lemora.io
DATABASE_URL=postgresql://user:pass@host:5432/lemora
REDIS_URL=redis://user:pass@host:6379
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

## 📊 Monitoring & Logging

### 1. Health Checks

```javascript
// healthcheck.js
app.get('/health', async (req, res) => {
  const checks = {
    server: 'ok',
    database: await checkDatabase(),
    redis: await checkRedis(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
  
  const allHealthy = Object.values(checks)
    .every(check => check === 'ok' || check);
  
  res.status(allHealthy ? 200 : 503).json(checks);
});
```

### 2. Prometheus Metrics

```javascript
// metrics.js
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Build and push Docker image
        run: |
          docker build -t lemora-app .
          docker tag lemora-app:latest ${{ secrets.ECR_REGISTRY }}/lemora-app:latest
          docker push ${{ secrets.ECR_REGISTRY }}/lemora-app:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production \
            --service lemora-app \
            --force-new-deployment
```

## 📈 Performance Optimization

### 1. CDN Configuration

```javascript
// cloudflare-config.js
module.exports = {
  zone: 'lemora.io',
  settings: {
    cache_level: 'aggressive',
    minify: {
      css: true,
      js: true,
      html: true
    },
    browser_cache_ttl: 14400,
    always_online: 'on',
    development_mode: 'off',
    websockets: true
  },
  page_rules: [
    {
      targets: ['api.lemora.io/*'],
      actions: {
        cache_level: 'bypass',
        disable_performance: false
      }
    }
  ]
};
```

### 2. Database Indexing

```sql
-- Performance indexes
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_address, created_at DESC);
CREATE INDEX idx_transactions_value ON transactions(value) WHERE value > 1000000000000000000;
CREATE INDEX idx_ai_analysis_wallet ON ai_analysis(wallet_address, created_at DESC);
```

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| High memory usage | Increase container limits, check for memory leaks |
| Slow API responses | Check database indexes, enable query caching |
| WebSocket disconnections | Verify load balancer sticky sessions |
| Failed health checks | Check database connectivity, review logs |
| SSL certificate errors | Renew certificates, verify domain configuration |

## 📚 Resources

- [Deployment Checklist](./deployment-checklist.md)
- [Rollback Procedures](./rollback.md)
- [Disaster Recovery](./disaster-recovery.md)
- [Scaling Guide](./scaling.md)

---

*Last updated: December 2024*
*Version: 2.0.0*
