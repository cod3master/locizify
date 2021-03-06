import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  exclude: 'node_modules/**',
  presets: [['es2015', { modules: false }], 'stage-0'],
  babelrc: false
};

const dest = {
  amd: `dist/amd/locizify${compress ? '.min' : ''}.js`,
  umd: `dist/umd/locizify${compress ? '.min' : ''}.js`,
  iife: `dist/iife/locizify${compress ? '.min' : ''}.js`
}[format];

export default {
  entry: 'src/index.js',
  format,
  plugins: [
    babel(babelOptions),
    nodeResolve({ jsnext: true, main: true }),
    commonjs()
  ].concat(compress ? uglify() : []),
  moduleName: 'locizify',
  //moduleId: 'locizify',
  dest
};
