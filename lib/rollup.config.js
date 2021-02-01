import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';
import babelConfig from './babel.config.json';

const plugins = [
  typescript(),
  babel({
    ...babelConfig,
    extensions: ['.ts'],
    babelHelpers: 'bundled',
  }),
];

export default [
  {
    input: 'src/scroll-canvas.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'window',
        extend: true,
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: 'src/scroll-canvas.ts',
    output: [
      {
        file: pkg['main:min'],
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: pkg['browser:min'],
        format: 'umd',
        name: 'window',
        extend: true,
        sourcemap: true,
      },
    ],
    plugins: [...plugins, terser()],
  },
  {
    input: 'src/scroll-canvas.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
];
