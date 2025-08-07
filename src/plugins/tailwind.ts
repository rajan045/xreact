import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Configures the Vite configuration file to include the Tailwind CSS plugin.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function configureViteWithTailwind(projectDir: string, useTypeScript: boolean) {
  const viteConfigFileName = useTypeScript ? 'vite.config.ts' : 'vite.config.js';
  const viteConfigPath = path.join(projectDir, viteConfigFileName);
  const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
`;
  await fs.writeFile(viteConfigPath, viteConfigContent);
  console.log(chalk.green('✅ Vite configured with Tailwind CSS plugin'));
}

/**
 * Adds Tailwind CSS import to the main CSS file.
 * @param projectDir The project directory.
 */
export async function addTailwindStyles(projectDir: string) {
  const cssPath = path.join(projectDir, 'src', 'index.css');
  const cssContent = `@import "tailwindcss";`;
  // Overwrite the existing index.css created by Vite.
  await fs.writeFile(cssPath, cssContent);
  console.log(chalk.green('✅ Tailwind CSS styles added'));
}

/**
 * Updates the App component with some default Tailwind styling and removes CSS import.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function updateAppComponent(projectDir: string, useTypeScript: boolean) {
  const appFileName = useTypeScript ? 'App.tsx' : 'App.jsx';
  const appFilePath = path.join(projectDir, 'src', appFileName);

  const newAppContent = `
function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <main className="text-center">
        <h1 className="text-6xl font-bold text-white">
          Welcome to your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300"> React </span>
          App
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Get started by editing <code>src/${appFileName}</code>
        </p>
      </main>
    </div>
  )
}

export default App
`;
  // Replace the content of the App file.
  await fs.writeFile(appFilePath, newAppContent);

  // Remove the default App.css created by Vite, as it's not needed with Tailwind.
  const appCssPath = path.join(projectDir, 'src', 'App.css');
  if (await fs.pathExists(appCssPath)) {
    await fs.remove(appCssPath);
  }
  console.log(chalk.green('✅ App component updated with Tailwind styling'));
}

/**
 * Installs Tailwind CSS dependencies and configures the project.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function setupTailwind(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n💅 Setting up Tailwind CSS...'));

  // Install Tailwind CSS and Vite plugin.
  const { execSync } = require('child_process');
  execSync('npm install tailwindcss @tailwindcss/vite', { 
    cwd: projectDir, 
    stdio: 'inherit' 
  });

  // Configure Vite to use the Tailwind CSS plugin.
  await configureViteWithTailwind(projectDir, useTypeScript);

  // Add Tailwind CSS import to the main CSS file.
  await addTailwindStyles(projectDir);

  // Update the App component with Tailwind styling.
  await updateAppComponent(projectDir, useTypeScript);

  console.log(chalk.green('✅ Tailwind CSS setup completed!'));
} 