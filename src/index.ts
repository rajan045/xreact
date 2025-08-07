#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { generateProject } from './generator';

console.log(chalk.blue.bold('🚀 Welcome to XReact - Interactive React Project Generator!'));
console.log(chalk.gray('Let\'s create your React project...\n'));

async function main() {
  try {
    // Ask for app name
    const { appName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'What is your app name?',
        default: 'my-react-app',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'App name cannot be empty';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'App name can only contain lowercase letters, numbers, and hyphens';
          }
          if (fs.existsSync(input)) {
            return 'A directory with this name already exists';
          }
          return true;
        }
      }
    ]);

    // Ask for TypeScript or JavaScript
    const { useTypeScript } = await inquirer.prompt([
      {
        type: 'list',
        name: 'useTypeScript',
        message: 'Do you want to use TypeScript or JavaScript?',
        choices: [
          { name: 'TypeScript', value: true },
          { name: 'JavaScript', value: false }
        ]
      }
    ]);

    // Ask for Tailwind CSS
    const { useTailwind } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useTailwind',
        message: 'Do you want to use Tailwind CSS?',
        default: true
      }
    ]);

    console.log(chalk.yellow('\n📦 Creating your React project...\n'));

    // Generate the project
    await generateProject({
      appName,
      useTypeScript,
      useTailwind
    });

    console.log(chalk.green.bold('\n✅ Project created successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.white(`  cd ${appName}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm start'));
    console.log(chalk.gray('\nHappy coding! 🎉'));

  } catch (error) {
    console.error(chalk.red('❌ Error creating project:'), error);
    process.exit(1);
  }
}

main(); 