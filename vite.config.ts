import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Middleware to support clean URLs like /about -> /about.html during local dev
function cleanUrlsPlugin(): Plugin {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const pathname = req.url.split('?')[0];
          const routes: Record<string, string> = {
            '/about': '/about.html',
            '/experience': '/experience.html',
            '/speaking': '/speaking.html',
            '/library': '/library.html',
            '/insights': '/insights.html',
            '/insight': '/insights.html',
            '/contact': '/contact.html',
          };
          if (routes[pathname]) {
            const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
            req.url = routes[pathname] + query;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cleanUrlsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          experience: path.resolve(__dirname, 'experience.html'),
          speaking: path.resolve(__dirname, 'speaking.html'),
          library: path.resolve(__dirname, 'library.html'),
          insights: path.resolve(__dirname, 'insights.html'),
          insight: path.resolve(__dirname, 'insight.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
