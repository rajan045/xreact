#!/usr/bin/env node
const path = require('path');

function detectTypeScript(cwd) {
  try {
    require('fs').accessSync(path.join(cwd, 'tsconfig.json'));
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const cwd = process.cwd();
  const useTypeScript = detectTypeScript(cwd);
  try {
    const { setupReactRouter } = require('x-react-kit/dist/plugins/react-router');
    await setupReactRouter(cwd, useTypeScript);
  } catch (err) {
    console.error('Failed to add React Router:', err);
    process.exit(1);
  }
}

run();


