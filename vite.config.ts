/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'


// https://vitejs.dev/config/
export default defineConfig({
  //   plugins: [dts({ outDir: "dist", include: ["src/"], exclude: ["**/__tests__/**"] }), tsconfigPaths()],

  plugins: [react(), dts({ outDir: 'dist', include: ["src/index.ts"], exclude: ["src/**/__tests__/**"] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lvlup-react-hooks',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom', // diferencia entre happy-dom y jsdom
    setupFiles: './tests/setup.ts'
  }
})
