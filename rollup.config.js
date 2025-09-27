import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  input: 'src/index.ts',
  external: ['react'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
    }),
  ],
};

const productionPlugins = isProduction ? [terser()] : [];

export default [
  // ESM build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [...baseConfig.plugins, ...productionPlugins],
  },
  
  // CommonJS build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [...baseConfig.plugins, ...productionPlugins],
  },
  
  // UMD build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BreakpointJS',
      sourcemap: true,
      globals: {
        react: 'React',
      },
    },
    plugins: [...baseConfig.plugins, ...productionPlugins],
  },
  
  // React integration build
  {
    input: 'src/integrations/react.ts',
    external: ['react'],
    output: [
      {
        file: 'dist/react.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/react.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
      ...productionPlugins,
    ],
  },

  
  // TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/types/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  
  // React integration declarations
  {
    input: 'src/integrations/react.ts',
    output: {
      file: 'dist/types/integrations/react.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },

];