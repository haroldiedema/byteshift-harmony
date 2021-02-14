import commonJS   from '@rollup/plugin-commonjs';
import resolve    from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import * as path  from 'path';
import {terser}   from 'rollup-plugin-terser';
import externals  from 'rollup-plugin-node-externals';
import {string}   from 'rollup-plugin-string';

const projectRootDir = path.resolve(__dirname);

export default [
    {
        input:   'src/index.ts',
        output:  {
            file:      'dist/index.js',
            format:    'cjs',
            exports:   'named',
            sourcemap: true,
        },
        plugins: [
            typescript(),
            externals(),
            string({
                include: ['**/*.html', '**/*.css']
            }),
            resolve({browser: false, preferBuiltins: true}),
            commonJS({
                include: 'node_modules/**',
            }),
            ! process.env.ROLLUP_WATCH && terser({
                output: {
                    width: 120,
                },
            }),
        ],
    },
];
