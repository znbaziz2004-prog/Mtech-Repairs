import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Reads VITE_API_PROXY_TARGET from frontend/.env if set, otherwise defaults
  // to port 5000. Change the backend's port in backend/.env, then set the
  // same port here (as VITE_API_PROXY_TARGET) if you ever move off 5000 —
  // no need to hunt through multiple files.
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 5173,

      '/uploads': { target, changeOrigin: true },
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
});
