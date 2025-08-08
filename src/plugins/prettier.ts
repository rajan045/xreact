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
 * Installs Prettier and related packages.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function installPrettier(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n💅 Installing Prettier...'));
  
  const packages = ['prettier'];
  
  runCommand(`npm install --save-dev ${packages.join(' ')}`, projectDir);
  console.log(chalk.green('✅ Prettier installed successfully!'));
}

/**
 * Creates Prettier configuration files.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function createPrettierConfig(projectDir: string, useTypeScript: boolean) {
  // Create .prettierrc configuration
  const prettierConfig = {
    semi: true,                    // Add semicolons at the end of statements
    trailingComma: 'es5',         // Add trailing commas where valid in ES5 (objects, arrays, etc.)
    singleQuote: true,            // Use single quotes instead of double quotes
    printWidth: 100,              // Line length that prettier will wrap on
    tabWidth: 2,                  // Number of spaces per indentation level
    useTabs: false,               // Use spaces instead of tabs for indentation
    endOfLine: 'lf',              // Use Unix line endings (LF) for consistency
    arrowParens: 'avoid',         // Omit parentheses when possible in arrow functions
    bracketSpacing: true,         // Print spaces between brackets in object literals
    jsxSingleQuote: true,         // Use single quotes in JSX attributes
    quoteProps: 'as-needed'       // Only add quotes around object properties when needed
  };

  await fs.writeJson(path.join(projectDir, '.prettierrc'), prettierConfig, { spaces: 2 });

  // Create .prettierignore
  const prettierIgnore = `# Dependencies
node_modules/

# Production builds - Generated files should not be formatted
dist/
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;

  await fs.writeFile(path.join(projectDir, '.prettierignore'), prettierIgnore);
  
  console.log(chalk.green('✅ Prettier configuration files created'));
}

/**
 * Updates package.json scripts with Prettier commands.
 * @param projectDir The project directory.
 */
export async function updatePackageScriptsForPrettier(projectDir: string) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  // Add Prettier scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\""
  };
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  console.log(chalk.green('✅ Package.json scripts updated with Prettier commands'));
}

/**
 * Sets up Prettier with installation and configuration.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function setupPrettier(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n💅 Setting up Prettier...'));

  // Install Prettier
  await installPrettier(projectDir, useTypeScript);

  // Create configuration files
  await createPrettierConfig(projectDir, useTypeScript);

  // Update package.json scripts
  await updatePackageScriptsForPrettier(projectDir);

  console.log(chalk.green('✅ Prettier setup completed!'));
  console.log(chalk.blue('\n📝 Available scripts:'));
  console.log(chalk.white('  npm run format       - Format all files'));
  console.log(chalk.white('  npm run format:check - Check formatting'));
}