# Stock Analytics Pro

Production-ready Angular 20 shell for a stock market analytics platform.

## Architecture

- Angular 20 standalone components with strict TypeScript.
- Angular Material, Angular CDK, SCSS design tokens, and responsive CSS Grid layouts.
- Lazy-loaded feature routes for dashboard, Nifty50, order book, GEX, administration, settings, and profile.
- NgRx Signal Store foundations for `DashboardStore`, `Nifty50Store`, `OrderBookStore`, and `GexStore`.
- PWA manifest and Angular service worker configuration for installability and offline shell caching.
- Mock authentication and WebSocket foundations ready for real integrations.

## Requirements

Angular 20 requires Node.js 20.19+ or 22.12+. The current shell is designed to run with:

```bash
npm install
npm start
```

Build production assets with:

```bash
npm run build
```
