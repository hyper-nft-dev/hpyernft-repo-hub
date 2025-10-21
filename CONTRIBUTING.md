# Contributing to HyperNFT

Thank you for your interest in contributing to HyperNFT! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Chrome browser 88+ for testing
- Solana CLI (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hypernft/hypernft.git
cd hypernft
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

## Development Workflow

### Making Changes

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally
3. Run linting and tests:
```bash
npm run lint
npm run test
```

4. Commit your changes following conventional commits:
```bash
git commit -m "feat: add new AI generation feature"
```

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new functionality
- Update documentation as needed

### Commit Message Format

We use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

## Testing

Run the test suite:
```bash
npm run test
npm run test:e2e
```

## Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if needed
3. Create a pull request with a clear description
4. Wait for code review and address feedback

## Architecture Overview

The extension follows a modular architecture:
- **Background Script**: Service worker for API calls and data processing
- **Content Script**: Injected into web pages for interaction detection
- **Popup**: Main user interface
- **Options**: Configuration settings

## Reporting Issues

Please use GitHub Issues to report bugs or request features. Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior

## Questions?

Feel free to open an issue for questions or join our Discord community.
