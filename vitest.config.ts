import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/controllers': path.resolve(__dirname, 'src/controllers'),
      '@/libs': path.resolve(__dirname, 'src/libs'),
      '@/routes': path.resolve(__dirname, 'src/routes'),
      '@/middlewares': path.resolve(__dirname, 'src/middlewares'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/schemas': path.resolve(__dirname, 'src/schemas'),
      '@/socket': path.resolve(__dirname, 'src/socket'),
      '@/templates': path.resolve(__dirname, 'src/templates'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
    },
  },
});
