import commonJS   from '@rollup/plugin-commonjs';
import resolve    from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import externals  from 'rollup-plugin-node-externals';
import {string}   from 'rollup-plugin-string';

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
        ],
    },
];
