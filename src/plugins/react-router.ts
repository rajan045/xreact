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
 * Installs react-router-dom package.
 * @param projectDir The project directory.
 */
export async function installReactRouter(projectDir: string) {
  console.log(chalk.blue('\n🚀 Adding react-router-dom...'));
  runCommand('npm install react-router-dom', projectDir);
  console.log(chalk.green('✅ react-router-dom installed successfully!'));
}

/**
 * Sets up React Router DOM with installation and configuration.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function setupReactRouter(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n🚀 Setting up React Router DOM...'));

  // Install react-router-dom
  await installReactRouter(projectDir);

  const fileExt = useTypeScript ? 'ts' : 'js';
  const jsxExt = useTypeScript ? 'tsx' : 'jsx';
  const navDir = path.join(projectDir, 'src', 'navigation');
  const pagesDir = path.join(projectDir, 'src', 'pages');
  const loginDir = path.join(pagesDir, 'login');
  const homeDir = path.join(pagesDir, 'home');
  const componentsDir = path.join(projectDir, 'src', 'components', 'layout');

  // Create directories
  await fs.ensureDir(navDir);
  await fs.ensureDir(loginDir);
  await fs.ensureDir(homeDir);
  await fs.ensureDir(componentsDir);

  // Create navigation/index.ts or js
  const navIndexContent = `import { BrowserRouter } from 'react-router-dom';
import { RoutesSetup } from './routes';

export const Router = () => {
  return (
    <BrowserRouter>
      <RoutesSetup />
    </BrowserRouter>
  );
};
`;
  await fs.writeFile(path.join(navDir, `index.${jsxExt}`), navIndexContent);

  // Create navigation/routes.ts or js
  const routesContent = `import { Route, Routes } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { Home } from '../pages/home/Home';
import { MainLayout } from '../components/layout/MainLayout';

export const RoutesSetup = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
            <Route index element={<Home/>} />
        </Route>
    </Routes>
  );
};
`;
  await fs.writeFile(path.join(navDir, `routes.${jsxExt}`), routesContent);

  // Create pages/login/Login.tsx or js
  const loginContent = `export const Login = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <main className="text-center">
        <h1 className="text-6xl font-bold text-white">Login Page</h1>
        <p className="mt-4 text-xl text-slate-400">
          This is the login page. Navigate to{' '}
          <a href="/" className="text-sky-400 hover:underline">Home</a>.
        </p>
      </main>
    </div>
  );
};
`;
  await fs.writeFile(path.join(loginDir, `Login.${fileExt}x`), loginContent);

  // Create pages/home/Home.tsx or js
  const homeContent = `export const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white">
        Welcome to your
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300"> React </span>
        App
      </h1>
      <p className="mt-4 text-xl text-slate-400">
        Get started by editing <code>src/pages/home/Home.${fileExt}x</code>
      </p>
      <p className="mt-4 text-lg text-slate-400">
        Navigate to <a href="/login" className="text-sky-400 hover:underline">Login</a> page
      </p>
    </div>
  );
};
`;
  await fs.writeFile(path.join(homeDir, `Home.${fileExt}x`), homeContent);

  // Create components/layout/MainLayout.tsx or js
  const mainLayoutContent = `import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
`;
  await fs.writeFile(path.join(componentsDir, `MainLayout.${fileExt}x`), mainLayoutContent);

  // Update App.tsx or js
  const appFileName = useTypeScript ? 'App.tsx' : 'App.jsx';
  const appFilePath = path.join(projectDir, 'src', appFileName);
  const appContent = `import { Router } from './navigation';

function App() {
  return <Router />;
}

export default App;
`;
  await fs.writeFile(appFilePath, appContent);

  // Remove the default App.css if it exists, as Tailwind is used
  const appCssPath = path.join(projectDir, 'src', 'App.css');
  if (await fs.pathExists(appCssPath)) {
    await fs.remove(appCssPath);
  }

  console.log(chalk.green('✅ React Router DOM setup completed!'));
}