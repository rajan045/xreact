#!/usr/bin/env node
try {
  // Delegate to the main CLI installed as a dependency
  require('x-react-kit/dist/index.js');
} catch (err) {
  console.error('Failed to start XReact generator from create-x-react-kit:', err);
  process.exit(1);
}


