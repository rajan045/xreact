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
 * Installs Husky and related dependencies.
 * @param projectDir The project directory.
 */
export async function installHusky(projectDir: string) {
  console.log(chalk.blue('\n🔧 Installing Husky and Git hooks dependencies...'));
  
  const devDependencies = [
    'husky',
    'lint-staged',
    '@commitlint/cli',
    '@commitlint/config-conventional'
  ];
  
  runCommand(`npm install --save-dev ${devDependencies.join(' ')}`, projectDir);
  console.log(chalk.green('✅ Husky dependencies installed successfully!'));
}

/**
 * Sets up Husky with Git hooks, lint-staged, and commitlint.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function setupHusky(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n🔧 Setting up Husky and Git hooks...'));

  // Install dependencies
  await installHusky(projectDir);

  // Initialize git if not already initialized
  try {
    execSync('git rev-parse --git-dir', { cwd: projectDir, stdio: 'ignore' });
  } catch {
    console.log(chalk.yellow('Initializing Git repository...'));
    runCommand('git init', projectDir);
  }

  // Initialize Husky
  runCommand('npx husky install', projectDir);

  // Create .husky directory and hooks
  const huskyDir = path.join(projectDir, '.husky');
  await fs.ensureDir(huskyDir);

  // Pre-commit hook
  const preCommitHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;
  await fs.writeFile(path.join(huskyDir, 'pre-commit'), preCommitHook);
  
  // Make pre-commit executable
  try {
    execSync(`chmod +x ${path.join(huskyDir, 'pre-commit')}`, { cwd: projectDir });
  } catch {
    // Windows doesn't need chmod
  }

  // Commit-msg hook
  const commitMsgHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
`;
  await fs.writeFile(path.join(huskyDir, 'commit-msg'), commitMsgHook);
  
  // Make commit-msg executable
  try {
    execSync(`chmod +x ${path.join(huskyDir, 'commit-msg')}`, { cwd: projectDir });
  } catch {
    // Windows doesn't need chmod
  }

  // Create commitlint config
  const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that do not affect the meaning of the code
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvements
        'test',     // Adding missing tests or correcting existing tests
        'chore',    // Changes to the build process or auxiliary tools
        'ci',       // Changes to CI configuration files and scripts
        'build',    // Changes that affect the build system or external dependencies
        'revert'    // Reverts a previous commit
      ]
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72]
  }
};
`;
  await fs.writeFile(path.join(projectDir, 'commitlint.config.js'), commitlintConfig);

  // Update package.json with scripts and lint-staged config
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  // Add scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'prepare': 'husky install',
    'lint': useTypeScript ? 'eslint src/**/*.{ts,tsx}' : 'eslint src/**/*.{js,jsx}',
    'lint:fix': useTypeScript ? 'eslint src/**/*.{ts,tsx} --fix' : 'eslint src/**/*.{js,jsx} --fix',
    'format': 'prettier --write src/**/*.{ts,tsx,js,jsx,json,css,md}',
    'format:check': 'prettier --check src/**/*.{ts,tsx,js,jsx,json,css,md}'
  };

  // Add lint-staged configuration
  const fileExtensions = useTypeScript ? '{ts,tsx}' : '{js,jsx}';
  packageJson['lint-staged'] = {
    [`src/**/*.${fileExtensions}`]: [
      'eslint --fix',
      'prettier --write'
    ],
    'src/**/*.{json,css,md}': [
      'prettier --write'
    ]
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // Create .gitmessage template for conventional commits
  const gitMessageTemplate = `# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Types:
# feat:     New feature
# fix:      Bug fix
# docs:     Documentation only changes
# style:    Changes that do not affect the meaning of the code
# refactor: Code change that neither fixes a bug nor adds a feature
# perf:     Performance improvements
# test:     Adding missing tests or correcting existing tests
# chore:    Changes to the build process or auxiliary tools
# ci:       Changes to CI configuration files and scripts
# build:    Changes that affect the build system or external dependencies
# revert:   Reverts a previous commit
#
# Example:
# feat(auth): add user authentication
#
# Add JWT-based authentication system with login/logout functionality.
# Includes middleware for protected routes and token refresh mechanism.
#
# Closes #123
`;
  await fs.writeFile(path.join(projectDir, '.gitmessage'), gitMessageTemplate);

  // Configure git to use the message template
  try {
    runCommand('git config commit.template .gitmessage', projectDir);
  } catch {
    console.log(chalk.yellow('Note: Could not set git commit template. Run manually: git config commit.template .gitmessage'));
  }

  console.log(chalk.green('✅ Husky setup completed!'));
  console.log(chalk.blue('\n📁 Created Git hooks and configuration:'));
  console.log(chalk.white('  .husky/pre-commit     - Runs lint-staged before commits'));
  console.log(chalk.white('  .husky/commit-msg     - Validates commit messages'));
  console.log(chalk.white('  commitlint.config.js  - Conventional commit rules'));
  console.log(chalk.white('  .gitmessage           - Commit message template'));
  console.log(chalk.blue('\n📝 Conventional commit format:'));
  console.log(chalk.white('  feat(scope): add new feature'));
  console.log(chalk.white('  fix(scope): fix bug in component'));
  console.log(chalk.white('  docs: update README'));
  console.log(chalk.blue('\n🚀 Available scripts:'));
  console.log(chalk.white('  npm run lint          - Check for linting errors'));
  console.log(chalk.white('  npm run lint:fix      - Fix linting errors'));
  console.log(chalk.white('  npm run format        - Format code with Prettier'));
  console.log(chalk.white('  npm run format:check  - Check code formatting'));
}