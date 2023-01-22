import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' assert { type: "json" };
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'es',
			exports: 'named',
			sourcemap: true,
		},
	],
	plugins: [
		external(),
		resolve(),
		typescript({
			rollupCommonJSResolveHack: true,
			exclude: ['**/__tests__/**', '**/*.stories.tsx'],
			clean: true,
		}),
		postcss({
			plugins: [autoprefixer()],
			modules: true,
			extensions: ['.scss', '.css', '.sss', '.pcss'],
			// sourceMap: true,
			// extract: true,
			// minimize: true
		}),
		commonjs({
			include: [/node_modules/],
			namedExports: {
				'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement', 'ForwardRef'],
				'node_modules/react-dom/index.js': ['render'],
				'prop-types': [
					'array',
					'bool',
					'func',
					'number',
					'object',
					'string',
					'symbol',
					'any',
					'arrayOf',
					'element',
					'elementType',
					'instanceOf',
					'node',
					'objectOf',
					'oneOf',
					'oneOfType',
					'shape',
					'exact',
				],
				'node_modules/@mui/utils/node_modules/react-is/index.js': [
					'ForwardRef',
					'isElement',
					'isValidElementType',
					'Memo',
					'isFragment',
				],
				'node_modules/@mui/base/node_modules/react-is/index.js': [
					'isFragment',
				],
				'node_modules/react-is/index.js': [
					'isElement',
					'isValidElementType',
					'Memo',
					'isFragment',
				],
			},
		}),
	],
	external: [
		...Object.keys(pkg.dependencies || {})
	]
	// external: ['react', 'react-dom', 'classnames', '/@babel/runtime/']
};
