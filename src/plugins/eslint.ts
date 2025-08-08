import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

/**
 * Utility function to execute shell commands with visual feedback
 * @param command The shell command to execute
 * @param cwd The working directory where the command should run
 */
function runCommand(command: string, cwd: string) {
  console.log(chalk.yellow(`\nRunning: ${command}`));
  execSync(command, { stdio: 'inherit', cwd });
}

/**
 * Installs ESLint and related packages.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function installEslint(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n🔍 Installing ESLint...'));
  
  // Core ESLint packages that every React project needs
  const packages = [
    'eslint',                           // Main ESLint package
    'eslint-plugin-react',              // React-specific rules (JSX, component patterns)
    'eslint-plugin-react-hooks',        // Rules for proper React Hooks usage
    'eslint-plugin-react-refresh',      // Rules for React Fast Refresh compatibility
    'eslint-plugin-jsx-a11y',           // Accessibility rules for JSX elements
    'eslint-plugin-import'              // Rules for import/export statements
  ];
  
  // Add TypeScript-specific packages if TypeScript is being used
  if (useTypeScript) {
    packages.push(
      '@typescript-eslint/eslint-plugin', // TypeScript-specific linting rules
      '@typescript-eslint/parser'         // Parser to understand TypeScript syntax
    );
  }
  
  runCommand(`npm install --save-dev ${packages.join(' ')}`, projectDir);
  console.log(chalk.green('✅ ESLint installed successfully!'));
}

/**
 * Creates ESLint configuration files.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function createEslintConfig(projectDir: string, useTypeScript: boolean) {
  // Create TypeScript-optimized configuration
  const eslintConfig = useTypeScript ? {
    root: true,                          // Stop looking for other config files in parent directories
    env: {                               // Define global variables that are predefined
      browser: true,                     // Browser global variables (window, document, etc.)
      es2020: true,                      // Enable ES2020 features (BigInt, optional chaining, etc.)
      node: true                         // Node.js global variables (process, __dirname, etc.)
    },
    extends: [                           // Extend from these shareable configurations
      'eslint:recommended',              // ESLint's recommended rules
      '@typescript-eslint/recommended',  // TypeScript-specific recommended rules
      'plugin:react/recommended',        // React-specific recommended rules
      'plugin:react-hooks/recommended',  // React Hooks recommended rules
      'plugin:jsx-a11y/recommended',     // Accessibility recommended rules
      'plugin:import/recommended',       // Import/export recommended rules
      'plugin:import/typescript'         // TypeScript-specific import rules
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'], // Files/patterns to ignore
    parser: '@typescript-eslint/parser',        // Use TypeScript parser
    parserOptions: {                            // Parser configuration
      ecmaVersion: 'latest',                    // Use latest ECMAScript version
      sourceType: 'module',                     // Enable ES6 modules
      ecmaFeatures: {                           // Additional language features
        jsx: true                               // Enable JSX parsing
      }
    },
    plugins: [                                  // ESLint plugins to use
      'react',                                  // React-specific rules
      'react-hooks',                            // React Hooks rules
      'react-refresh',                          // React Fast Refresh rules
      '@typescript-eslint',                     // TypeScript rules
      'jsx-a11y',                               // Accessibility rules
      'import'                                  // Import/export rules
    ],
    rules: {                                         // Custom rule configurations
      // React Fast Refresh: Warn if components are exported with other exports
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }                // Allow exporting constants alongside components
      ],
      // Modern React doesn't require importing React in JSX files
      'react/react-in-jsx-scope': 'off',
      // TypeScript handles prop validation, so disable React prop-types
      'react/prop-types': 'off',
      // TypeScript: Error on unused variables, but allow underscore prefix for intentionally unused
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Don't require explicit return types (TypeScript can infer most)
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Don't require explicit types for module boundaries
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Warn when using 'any' type (reduces type safety)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce consistent import ordering for better code organization
      'import/order': [
        'error',
        {
          groups: [                              // Order: built-in → external → internal → relative
            'builtin',                           // Node.js built-in modules (fs, path, etc.)
            'external',                          // npm packages (react, lodash, etc.)
            'internal',                          // Internal modules (src/utils, etc.)
            'parent',                            // Parent directory imports (../something)
            'sibling',                           // Same directory imports (./something)
            'index'                              // Index file imports (./index)
          ],
          'newlines-between': 'always'           // Require blank lines between import groups
        }
      ]
    },
    settings: {                                      // Plugin-specific settings
      react: {                                       // React plugin settings
        version: 'detect'                            // Automatically detect React version
      },
      'import/resolver': {                           // Import plugin resolver settings
        typescript: {                                // TypeScript-specific import resolution
          alwaysTryTypes: true                       // Always try to resolve @types packages
        }
      }
    }
  } : {
    // JavaScript-only configuration (simpler setup without TypeScript complexity)
    root: true,                          // Stop looking for other config files in parent directories
    env: {                               // Define global variables that are predefined
      browser: true,                     // Browser global variables (window, document, etc.)
      es2020: true,                      // Enable ES2020 features
      node: true                         // Node.js global variables (process, __dirname, etc.)
    },
    extends: [                           // Extend from these shareable configurations
      'eslint:recommended',              // ESLint's recommended rules
      'plugin:react/recommended',        // React-specific recommended rules
      'plugin:react-hooks/recommended',  // React Hooks recommended rules
      'plugin:jsx-a11y/recommended',     // Accessibility recommended rules
      'plugin:import/recommended'        // Import/export recommended rules (no TypeScript)
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'], // Files/patterns to ignore
    parserOptions: {                            // Parser configuration (using default JS parser)
      ecmaVersion: 'latest',                    // Use latest ECMAScript version
      sourceType: 'module',                     // Enable ES6 modules
      ecmaFeatures: {                           // Additional language features
        jsx: true                               // Enable JSX parsing
      }
    },
    plugins: [                                  // ESLint plugins to use (no TypeScript plugins)
      'react',                                  // React-specific rules
      'react-hooks',                            // React Hooks rules
      'react-refresh',                          // React Fast Refresh rules
      'jsx-a11y',                               // Accessibility rules
      'import'                                  // Import/export rules
    ],
    rules: {                                         // Custom rule configurations for JavaScript
      // React Fast Refresh: Warn if components are exported with other exports
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }                // Allow exporting constants alongside components
      ],
      // Modern React doesn't require importing React in JSX files
      'react/react-in-jsx-scope': 'off',
      // We can still use prop-types in JavaScript for runtime validation
      'react/prop-types': 'off',
      // JavaScript: Error on unused variables, but allow underscore prefix for intentionally unused
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Enforce consistent import ordering for better code organization
      'import/order': [
        'error',
        {
          groups: [                              // Order: built-in → external → internal → relative
            'builtin',                           // Node.js built-in modules (fs, path, etc.)
            'external',                          // npm packages (react, lodash, etc.)
            'internal',                          // Internal modules (src/utils, etc.)
            'parent',                            // Parent directory imports (../something)
            'sibling',                           // Same directory imports (./something)
            'index'                              // Index file imports (./index)
          ],
          'newlines-between': 'always'           // Require blank lines between import groups
        }
      ]
    },
    settings: {                                      // Plugin-specific settings
      react: {                                       // React plugin settings
        version: 'detect'                            // Automatically detect React version
      }
    }
  };

  // Write the configuration to .eslintrc.json file
  await fs.writeJson(path.join(projectDir, '.eslintrc.json'), eslintConfig, { spaces: 2 });

  // Create .eslintignore file to exclude files/directories from linting
  // This prevents ESLint from analyzing files that shouldn't be linted
  const eslintIgnore = `# Dependencies - Third-party code should not be linted
node_modules/

# Production builds - Generated files should not be linted
dist/
build/

# Environment files - May contain sensitive data and don't need linting
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Coverage directory - Generated by testing tools
coverage/

# Vite build output - Generated files
dist/

# IDE files - Editor-specific configurations don't need linting
.vscode/
.idea/

# OS generated files - System files that shouldn't be linted
.DS_Store
*.log
`;

  // Write the ignore patterns to .eslintignore file
  await fs.writeFile(path.join(projectDir, '.eslintignore'), eslintIgnore);
  
  console.log(chalk.green('✅ ESLint configuration files created'));
}

/**
 * Adds ESLint scripts to package.json for easy linting commands
 * 
 * This function adds two useful npm scripts:
 * - lint: Check all files for linting errors with strict settings
 * - lint:fix: Automatically fix auto-fixable linting errors
 * 
 * @param projectDir The target project directory
 */
export async function updatePackageScriptsForEslint(projectDir: string) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  // Add ESLint scripts to the existing scripts object
  packageJson.scripts = {
    ...packageJson.scripts,  // Preserve existing scripts
    // Lint all TypeScript/JavaScript files with strict settings
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    // Automatically fix auto-fixable issues (formatting, simple rule violations)
    "lint:fix": "eslint . --ext ts,tsx --fix"
  };
  
  // Write the updated package.json back to disk
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  console.log(chalk.green('✅ Package.json scripts updated with ESLint commands'));
}

/**
 * Main function that orchestrates the complete ESLint setup process
 * 
 * This function coordinates all the steps needed to set up ESLint:
 * 1. Installs ESLint and relevant plugins (React, TypeScript, a11y, etc.)
 * 2. Creates configuration files (.eslintrc.json and .eslintignore)
 * 3. Adds npm scripts for linting
 * 4. Provides user guidance on available commands
 * 
 * @param projectDir The target project directory
 * @param useTypeScript Whether the project uses TypeScript
 */
export async function setupEslint(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n🔍 Setting up ESLint...'));

  // Step 1: Install ESLint and all necessary plugins
  await installEslint(projectDir, useTypeScript);

  // Step 2: Create configuration files (.eslintrc.json and .eslintignore)
  await createEslintConfig(projectDir, useTypeScript);

  // Step 3: Add npm scripts for easy linting commands
  await updatePackageScriptsForEslint(projectDir);

  // Step 4: Show success message and available commands
  console.log(chalk.green('✅ ESLint setup completed!'));
  console.log(chalk.blue('\n📝 Available scripts:'));
  console.log(chalk.white('  npm run lint     - Check for linting errors and enforce code quality'));
  console.log(chalk.white('  npm run lint:fix - Automatically fix auto-fixable linting errors'));
  console.log(chalk.gray('\n💡 Tip: Set up your editor to show ESLint errors inline for the best experience!'));
  console.log(chalk.gray('💡 Consider running "npm run lint" before committing code to catch issues early.'));
}