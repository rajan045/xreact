# xreact-add-react-router

Add React Router setup to an existing React app. Automatically detects TypeScript via `tsconfig.json`.

## Quick Start

```bash
npx xreact-add-react-router@latest
```

## Alternatives

- Install globally, then run:

```bash
npm i -g xreact-add-react-router
xreact-add-react-router
```

- Add as a project script:

```bash
npm pkg set scripts.add-router="xreact-add-react-router"
npm run add-router
```

## What it does

- Installs `react-router-dom`
- Creates `src/navigation` with `index` and `routes`
- Adds `pages/login`, `pages/home`, and a basic `components/layout/MainLayout`
- Updates `src/App.tsx` / `src/App.jsx` to use the router

## Requirements

- Run it from your app root (where `package.json` lives)
- TypeScript is detected via `tsconfig.json`; otherwise JavaScript is assumed

## After running

```bash
npm run dev
```
