import { join } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],

  root: __dirname,

  resolve: {
    alias: {
      '@components': join(__dirname, 'src/components'),
      '@hooks': join(__dirname, 'src/hooks'),
      '@lib': join(__dirname, 'src/lib'),
      '@middleware': join(__dirname, 'src/middleware'),
    },
  },

  build: {
    lib: {
      entry: join(__dirname, 'src', 'index.ts'),
      name: 'index',
      fileName: 'index',
      formats: ['es'],
    },

    rollupOptions: {
      external: ['next', 'next/server', 'jose'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        dir: 'dist',
      },
    },
  },
});
