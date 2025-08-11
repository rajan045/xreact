#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { spawnSync } from 'child_process';

// Check if this is a global installation
function isGlobalInstall(): boolean {
  const globalNodeModules = process.env.npm_config_prefix 
    ? path.join(process.env.npm_config_prefix, 'lib', 'node_modules')
    : path.join(process.execPath, '..', '..', 'lib', 'node_modules');
  
  return __dirname.includes(globalNodeModules) || process.env.npm_config_global === 'true';
}

async function postInstall() {
  try {
    // Make the main script executable
    const mainScript = path.join(__dirname, 'index.js');
    if (await fs.pathExists(mainScript)) {
      await fs.chmod(mainScript, '755');
    }

    // If this is a local installation, show helpful instructions
    if (!isGlobalInstall()) {
      console.log(chalk.blue.bold('\n🚀 XReact installed locally!'));
      console.log(chalk.yellow('\n📋 Usage options:'));
      console.log(chalk.white('  1. Run with npx:'));
      console.log(chalk.cyan('     npx x-react-kit'));
      console.log(chalk.white('\n  2. Run directly:'));
      console.log(chalk.cyan('     ./node_modules/.bin/xreact'));
      console.log(chalk.white('\n  3. Add to package.json scripts:'));
      console.log(chalk.green('     "scripts": {'));
      console.log(chalk.green('       "create-app": "xreact"'));
      console.log(chalk.green('     }'));
      console.log(chalk.cyan('     npm run create-app'));
      console.log(chalk.gray('\n💡 For global access, install with: npm install -g x-react-kit\n'));

      // Auto-run the generator on install if not CI and not global.
      // Require either a TTY or npm foreground scripts so interactive prompts can be displayed.
      const isCI = Boolean(process.env.CI);
      const isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY);
      const npmForeground = process.env.npm_config_foreground_scripts === 'true';
      const shouldAutoRun = process.env.XREACT_AUTO_RUN !== 'false' && !isCI && (isTTY || npmForeground);

      if (shouldAutoRun) {
        const originalCwd = process.env.INIT_CWD || process.cwd();
        const cliPath = path.join(__dirname, 'index.js');
        console.log(chalk.yellow('\n▶️  Launching XReact generator now...'));
        console.log(chalk.gray(`   Working directory: ${originalCwd}`));

        const result = spawnSync(process.execPath, [cliPath], {
          cwd: originalCwd,
          stdio: 'inherit'
        });

        if (result.status !== 0) {
          console.log(chalk.yellow('\n⚠️  Generator did not complete during postinstall. You can run it later using one of the methods above.'));
        }
      } else {
        console.log(chalk.gray('\nℹ️  Skipping auto-run (non-interactive/CI/global).'));
        console.log(chalk.white('   Run manually with one of:'));
        console.log(chalk.cyan('     npx x-react-kit'));
        console.log(chalk.cyan('     ./node_modules/.bin/xreact'));
        console.log(chalk.white('\n   To auto-run on install next time, use:'));
        console.log(chalk.cyan('     npm i --foreground-scripts x-react-kit'));
        console.log(chalk.white('   Or persist this setting:'));
        console.log(chalk.cyan('     npm config set foreground-scripts true'));
      }
    }
  } catch (error) {
    // Silently handle errors to avoid breaking installation
    console.log(chalk.yellow('⚠️  Postinstall script completed with warnings'));
  }
}

postInstall();
