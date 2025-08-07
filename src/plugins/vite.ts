import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

/**
 * Executes a command synchronously in a given directory, showing its output.
 * @param command The command to execute.
 * @param cwd The working directory.
 */
function runCommand(command: string, cwd: string) {
  console.log(chalk.yellow(`\nRunning: ${command}`));
  execSync(command, { stdio: 'inherit', cwd });
}

/**
 * Scaffolds a new Vite project with the specified template.
 * @param appName The name of the application.
 * @param useTypeScript Whether to use TypeScript template.
 * @param parentDir The parent directory where the project should be created.
 */
export async function scaffoldViteProject(appName: string, useTypeScript: boolean, parentDir: string) {
  console.log(chalk.blue(`\n🚀 Scaffolding project with Vite...`));
  
  const template = useTypeScript ? 'react-swc-ts' : 'react-swc';
  const viteCommand = `npm create vite@latest ${appName} -- --template ${template}`;
  
  runCommand(viteCommand, parentDir);
  
  console.log(chalk.green('✅ Vite project created successfully!'));
}

/**
 * Configures the Vite configuration file with basic settings.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function configureVite(projectDir: string, useTypeScript: boolean) {
  const viteConfigFileName = useTypeScript ? 'vite.config.ts' : 'vite.config.js';
  const viteConfigPath = path.join(projectDir, viteConfigFileName);
  
  const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
`;
  
  await fs.writeFile(viteConfigPath, viteConfigContent);
  console.log(chalk.green('✅ Vite configuration updated'));
}

/**
 * Updates the package.json scripts for better development experience.
 * @param projectDir The project directory.
 */
export async function updatePackageScripts(projectDir: string) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  // Update scripts for better DX
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  };
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  console.log(chalk.green('✅ Package.json scripts updated'));
}

/**
 * Sets up the complete Vite project with all configurations.
 * @param appName The name of the application.
 * @param useTypeScript Whether to use TypeScript.
 * @param parentDir The parent directory where the project should be created.
 */
export async function setupVite(appName: string, useTypeScript: boolean, parentDir: string) {
  // Scaffold the Vite project
  await scaffoldViteProject(appName, useTypeScript, parentDir);
  
  const projectDir = path.join(parentDir, appName);
  
  // Configure Vite with custom settings
  await configureVite(projectDir, useTypeScript);
  
  // Update package.json scripts
  await updatePackageScripts(projectDir);
  
  console.log(chalk.green('✅ Vite setup completed!'));
} 