import path from 'path';
import chalk from 'chalk';
import { setupTailwind, setupVite } from './plugins';

interface ProjectConfig {
  appName: string;
  useTypeScript: boolean;
  useTailwind: boolean;
}

export async function generateProject(config: ProjectConfig) {
  const { appName, useTypeScript, useTailwind } = config;
  const parentDir = process.cwd();

  // 1. Vite
  await setupVite(appName, useTypeScript, parentDir);

  // 2. Tailwind
  if (useTailwind) {
    const projectDir = path.resolve(parentDir, appName);
    await setupTailwind(projectDir, useTypeScript);
  }

  // 3. Display final instructions to the user.
  console.log(chalk.green.bold(`\n✨ Success! Your new app "${appName}" is ready.`));
  console.log('\nTo get started, run the following commands:');
  console.log(chalk.cyan(`  cd ${appName}`));
  console.log(chalk.cyan('  npm run dev'));
}