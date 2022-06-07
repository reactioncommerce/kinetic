import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: [
      { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: 'components', replacement: path.resolve(__dirname, 'src/components') }
    ]
  },
  plugins: [react()]
});
