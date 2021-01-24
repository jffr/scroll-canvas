import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

import pkg from './package.json';
import babelConfig from './babel.config.json';

export default [
  {
    input: 'src/scroll-canvas.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true  },
      { file: pkg.module, format: 'es', sourcemap: true  },
      { file: pkg.browser, format: 'umd', name: 'window', extend: true, sourcemap: true },
    ],
    plugins: [
      typescript(),
      babel({
        ...babelConfig,
        extensions: ['.ts'],
        babelHelpers: 'bundled'
      }),
      terser()
    ]
  }
];