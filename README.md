# XReact

Create React apps the easy way! Just answer a few questions and get a fully configured project.

## Quick Start

```bash
npm install -g x-react-kit
xreact
```

That's it! The CLI will ask you what you want and set everything up.

## What You Get

- **Vite** - Super fast development server
- **TypeScript or JavaScript** - Your choice
- **Tailwind CSS** - Optional, for easy styling
- **React Router** - For multi-page apps
- **Redux Toolkit** - State management made simple
- **ESLint & Prettier** - Code formatting that just works
- **Husky** - Git hooks to keep your code clean

## Features

- 🚀 Modern React 18 with Vite
- 📁 Smart folder structure with feature-based API organization
- 🎨 Optional Tailwind CSS integration
- 🔄 Redux Toolkit Query for API calls
- 📋 ESLint and Prettier configured
- 🪝 Git hooks with Husky for code quality
- ⚡ Hot reloading out of the box

## Example

```bash
$ xreact

? What's your app name? my-cool-app
? TypeScript or JavaScript? TypeScript
? Want Tailwind CSS? Yes
? Need React Router? Yes
? Want Redux for state management? Yes

✅ All done! Your app is ready.

cd my-cool-app
npm install
npm run dev
```

## What Gets Created

```
my-cool-app/
├── src/
│   ├── api/           # API calls organized by feature
│   │   ├── user/      # User-related endpoints
│   │   └── posts/     # Posts-related endpoints
│   ├── components/    # Reusable components
│   ├── pages/         # Your app pages
│   ├── store/         # Redux store
│   └── hooks/         # Custom hooks
├── package.json
└── all the config files you need
```

## Contributing

Want to help make this better?

```bash
git clone <this-repo>
npm install
npm run build
npm link
xreact  # test it out
```

## License

MIT - Go build cool stuff!
