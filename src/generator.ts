import path from 'path';
import chalk from 'chalk';
import { setupTailwind, setupVite, setupReactRouter, setupRtkQuery, setupPrettier, setupEslint } from './plugins';

interface ProjectConfig {
  appName: string;
  useTypeScript: boolean;
  useTailwind: boolean;
  useReactRouter: boolean;
  useRtkQuery: boolean;
  usePrettier: boolean;
  useEslint: boolean;
}

export async function generateProject(config: ProjectConfig) {
  const { appName, useTypeScript, useTailwind, useReactRouter, useRtkQuery, usePrettier, useEslint } = config;
  const projectDir = path.resolve(process.cwd(), appName);
  const parentDir = process.cwd();

  // 1. Vite
  await setupVite(appName, useTypeScript, parentDir);

  // 2. Tailwind
  if (useTailwind) {
    await setupTailwind(projectDir, useTypeScript);
  }

  // 3. React Router
  if (useReactRouter) {
    await setupReactRouter(projectDir, useTypeScript);
  }

  // 4. RTK Query
  if (useRtkQuery) {
    await setupRtkQuery(projectDir, useTypeScript);
  }

  // 5. Prettier
  if (usePrettier) {
    await setupPrettier(projectDir, useTypeScript);
  }

  // 6. ESLint
  if (useEslint) {
    await setupEslint(projectDir, useTypeScript);
  }

  // 7. Display final instructions to the user.
  console.log(chalk.green.bold(`\n✨ Success! Your new app "${appName}" is ready.`));
  console.log('\n shelves to get started, run the following commands:');
  console.log(chalk.cyan(`  cd ${appName}`));
  console.log(chalk.cyan('  npm run dev'));
}