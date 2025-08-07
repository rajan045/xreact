# XReact

Interactive React project generator with TypeScript and Tailwind CSS support.

## Installation

```bash
npm install -g xreact
```

## Usage

```bash
xreact
```

This will start an interactive CLI that will ask you:

1. **App Name** - What you want to name your React project
2. **TypeScript/JavaScript** - Whether you want to use TypeScript or JavaScript
3. **Tailwind CSS** - Whether you want to include Tailwind CSS for styling

## Features

- ✅ Interactive CLI with prompts
- ✅ TypeScript support
- ✅ JavaScript support
- ✅ Tailwind CSS integration
- ✅ Create React App setup
- ✅ Hot reloading
- ✅ Production build optimization
- ✅ Modern React 18 setup

## Example

```bash
$ xreact

🚀 Welcome to XReact - Interactive React Project Generator!
Let's create your React project...

? What is your app name? my-awesome-app
? Do you want to use TypeScript or JavaScript? TypeScript
? Do you want to use Tailwind CSS? Yes

📦 Creating your React project...

✅ Project created successfully!

Next steps:
  cd my-awesome-app
  npm install
  npm start

Happy coding! 🎉
```

## Generated Project Structure

```
my-awesome-app/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx (or App.js)
│   ├── index.tsx (or index.js)
│   └── index.css
├── package.json
├── tsconfig.json (if TypeScript)
├── tailwind.config.js (if Tailwind)
├── postcss.config.js (if Tailwind)
└── README.md
```

## Development

To work on this package locally:

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Link locally for testing
npm link

# Test the CLI
xreact
```

## License

MIT
