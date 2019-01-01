const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/serve/summernote.js',
    format: 'iife',
    name: 'summernote'
  },
  plugins: [
    serve('public'),
    livereload(),
    typescript({
      include: ['**/*.js', '**/*.ts'],
      lib: ["es5", "es6", "dom"],
      target: "es5"
    }),
    resolve()
  ]
};
