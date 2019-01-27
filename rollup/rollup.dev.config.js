const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const serve = require('rollup-plugin-serve');

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/summernote.js',
    format: 'iife',
    name: 'summernote'
  },
  plugins: [
    typescript({
      include: ['**/*.js', '**/*.ts'],
      lib: ["es5", "es6", "dom"],
      target: "es5"
    }),
    resolve(),
    serve('public')
  ]
};
