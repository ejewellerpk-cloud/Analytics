import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const laravelUrl = env.VITE_API_URL || 'http://127.0.0.1:8000'
  const laravelApiKey = env.VITE_LICENSE_KEY || env.LARAVEL_API_KEY || ''

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: laravelUrl,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (laravelApiKey) {
                proxyReq.setHeader('x-api-key', laravelApiKey)
              }
            })
          },
        },
      },
    },
  }
})
