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
 * Installs Redux Toolkit and React Redux dependencies.
 * @param projectDir The project directory.
 */
export async function installRtkQuery(projectDir: string) {
  console.log(chalk.blue('\n🔧 Installing Redux Toolkit and React Redux...'));
  runCommand('npm install @reduxjs/toolkit react-redux', projectDir);
  console.log(chalk.green('✅ Redux Toolkit and React Redux installed successfully!'));
}

/**
 * Sets up RTK Query with installation and configuration.
 * @param projectDir The project directory.
 * @param useTypeScript Whether the project uses TypeScript.
 */
export async function setupRtkQuery(projectDir: string, useTypeScript: boolean) {
  console.log(chalk.blue('\n🔧 Setting up RTK Query...'));

  // Install dependencies
  await installRtkQuery(projectDir);

  const fileExt = useTypeScript ? 'ts' : 'js';
  const storeDir = path.join(projectDir, 'src', 'store');
  const apiDir = path.join(projectDir, 'src', 'api');
  const hooksDir = path.join(projectDir, 'src', 'hooks');

  // Create directories
  await fs.ensureDir(storeDir);
  await fs.ensureDir(apiDir);
  await fs.ensureDir(hooksDir);

  // Create store/index.ts or js
  const storeIndexContent = useTypeScript 
    ? `import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// TypeScript specific types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`
    : `import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
`;
  await fs.writeFile(path.join(storeDir, `index.${fileExt}`), storeIndexContent);

  // Create store/StoreProvider.tsx or jsx
  const storeProviderContent = useTypeScript 
    ? `import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
`
    : `import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
`;
  await fs.writeFile(path.join(storeDir, `StoreProvider.${useTypeScript ? 'tsx' : 'jsx'}`), storeProviderContent);

  // Create api/apiSlice.ts or js
  const apiSliceContent = `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API base URL
const BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', \`Bearer \${token}\`);
      // }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'], // Add your tag types here
  endpoints: (builder) => ({}),
});
`;
  await fs.writeFile(path.join(apiDir, `apiSlice.${fileExt}`), apiSliceContent);

  // Create feature-based API structure
  const userApiDir = path.join(apiDir, 'user');
  await fs.ensureDir(userApiDir);

  // Create api/user/userApi.ts or js - Example API endpoints
  const userApiContent = `import { apiSlice } from '../apiSlice';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => \`/users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: \`/users/\${id}\`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: \`/users/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
`;
  await fs.writeFile(path.join(userApiDir, `userApi.${fileExt}`), userApiContent);

  // Create posts API as another example of feature-based structure
  const postsApiDir = path.join(apiDir, 'posts');
  await fs.ensureDir(postsApiDir);

  // Create api/posts/postsApi.ts or js
  const postsApiContent = `import { apiSlice } from '../apiSlice';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => \`/posts/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation<Post, { id: number; data: Partial<Post> }>({
      query: ({ id, data }) => ({
        url: \`/posts/\${id}\`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: \`/posts/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
`;
  await fs.writeFile(path.join(postsApiDir, `postsApi.${fileExt}`), postsApiContent);

  // Create api/index.ts or js - API exports
  const apiIndexContent = `export * from './apiSlice';
export * from './user/userApi';
export * from './posts/postsApi';
`;
  await fs.writeFile(path.join(apiDir, `index.${fileExt}`), apiIndexContent);

  // Create hooks/useAppSelector.ts or js - Typed hooks for TypeScript
  if (useTypeScript) {
    const hooksContent = `import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout your app instead of plain \`useDispatch\` and \`useSelector\`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
    await fs.writeFile(path.join(hooksDir, `index.${fileExt}`), hooksContent);
  }

  // Update App.tsx or js
  const appFileName = useTypeScript ? 'App.tsx' : 'App.jsx';
  const appFilePath = path.join(projectDir, 'src', appFileName);
  
  // Read the current App content
  const appContent = await fs.readFile(appFilePath, 'utf-8');
  
  // Add import for StoreProvider
  let updatedAppContent = appContent;
  
  // Add StoreProvider import after Router import
  if (!updatedAppContent.includes('StoreProvider')) {
    updatedAppContent = updatedAppContent.replace(
      /import { Router } from '\.\/navigation';/,
      `import { Router } from './navigation';\nimport { StoreProvider } from './store/StoreProvider';`
    );
  }
  
  // Wrap the Router with StoreProvider
  updatedAppContent = updatedAppContent.replace(
    /return <Router \/>;/,
    `return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );`
  );

  await fs.writeFile(appFilePath, updatedAppContent);

  console.log(chalk.green('✅ RTK Query setup completed!'));
  console.log(chalk.blue('\n📁 Created folder structure:'));
  console.log(chalk.white('  src/store/         - Redux store configuration'));
  console.log(chalk.white('  src/api/           - API base configuration'));
  console.log(chalk.white('  src/api/user/      - User-related API endpoints'));
  console.log(chalk.white('  src/api/posts/     - Posts-related API endpoints'));
  console.log(chalk.white('  src/hooks/         - Typed Redux hooks (TypeScript only)'));
  console.log(chalk.blue('\n📝 Example usage:'));
  console.log(chalk.white('  import { useGetUsersQuery, useGetPostsQuery } from "./api";'));
  console.log(chalk.white('  const { data: users, isLoading } = useGetUsersQuery();'));
  console.log(chalk.white('  const { data: posts } = useGetPostsQuery();'));
} 