# xreact-add-rtk-query

Add RTK Query setup to an existing React app. Automatically detects TypeScript via `tsconfig.json`.

## Quick Start

```bash
npx xreact-add-rtk-query@latest
```

## Alternatives

- Install globally, then run:

```bash
npm i -g xreact-add-rtk-query
xreact-add-rtk-query
```

- Add as a project script:

```bash
npm pkg set scripts.add-rtk-query="xreact-add-rtk-query"
npm run add-rtk-query
```

## What it does

- Installs `@reduxjs/toolkit` and `react-redux`
- Creates `src/store`, `src/api` with sample `user` and `posts` endpoints
- Adds typed hooks for TypeScript
- Wraps your `App` with a `StoreProvider` and keeps Router if present

## Requirements

- Run it from your app root (where `package.json` lives)
- TypeScript is detected via `tsconfig.json`; otherwise JavaScript is assumed

## After running

```bash
npm run dev
```
