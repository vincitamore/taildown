import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {index: 'src/index.ts', config: 'src/config/index.ts'},
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
  external: ['@taildown/shared'],
});

