const commonjs = require('rollup-plugin-commonjs');
const includepaths = require('rollup-plugin-includepaths');

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'basic'
  },
  plugins: [
    commonjs(),
    includepaths({
      include: {
        'winternote': '../dist/winternote.js'
      }
    })
  ]
};
