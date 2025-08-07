import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { setupTailwind, setupVite, setupReactRouter } from './plugins';

interface ProjectConfig {
  appName: string;
  useTypeScript: boolean;
  useTailwind: boolean;
}

/**
 * Executes a command synchronously in a given directory, showing its output.
 * @param command The command to execute.
 * @param cwd The working directory.
 */
function runCommand(command: string, cwd: string) {
  console.log(chalk.yellow(`\nRunning: ${command}`));
  execSync(command, { stdio: 'inherit', cwd });
}

export async function generateProject(config: ProjectConfig) {
  const { appName, useTypeScript, useTailwind } = config;
  const projectDir = path.resolve(process.cwd(), appName);
  const parentDir = process.cwd();

  // 1. Vite
  await setupVite(appName, useTypeScript, parentDir);

  // 2. Tailwind
  if (useTailwind) {
    await setupTailwind(projectDir, useTypeScript);
  }

  // 3. React Router
  await setupReactRouter(projectDir, useTypeScript);

  // 4. Display final instructions to the user.
  console.log(chalk.green.bold(`\n✨ Success! Your new app "${appName}" is ready.`));
  console.log('\nTo get started, run the following commands:');
  console.log(chalk.cyan(`  cd ${appName}`));
  console.log(chalk.cyan('  npm run dev'));
}