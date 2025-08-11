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
    const { setupRtkQuery } = require('x-react-kit/dist/plugins/rtk-query');
    await setupRtkQuery(cwd, useTypeScript);
  } catch (err) {
    console.error('Failed to add RTK Query:', err);
    process.exit(1);
  }
}

run();


