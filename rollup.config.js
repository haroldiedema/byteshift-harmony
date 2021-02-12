import alias      from '@rollup/plugin-alias';
import commonJS   from '@rollup/plugin-commonjs';
import resolve    from '@rollup/plugin-node-resolve';
import serve      from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import * as path  from 'path';
import {terser}   from 'rollup-plugin-terser';
import externals  from 'rollup-plugin-node-externals';

const projectRootDir = path.resolve(__dirname);

export default [{
    input:   'src/index.ts',
    output:  {
        file:   'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
    },
    plugins: [
        typescript(),
        alias({
            entries: [
                {
                    find:        '@',
                    replacement: path.resolve(projectRootDir, 'src'),
                },
            ],
        }),
        externals(),
        resolve({browser: false, preferBuiltins: true}),
        commonJS({
            include: 'node_modules/**',
        }),
        !process.env.ROLLUP_WATCH && terser({
            output: {
                width: 120
            }
        })
    ],
}, {
    input:   'test/index.ts',
    output:  {
        name:   'ByteshiftHttpTest',
        file:   'test/index.js',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [
        typescript(),
        resolve({
        }),
        commonJS({
            include: 'node_modules/**',
        }),
        process.env.ROLLUP_WATCH && serve('test'),
        // !process.env.ROLLUP_WATCH && terser({
        //     output: {
        //         width: 120
        //     }
        // })
    ],
}];
