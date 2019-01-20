const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/summernote.js',
    format: 'umd',
    name: 'summernote'
  },
  plugins: [
    typescript({
      include: ['**/*.js', '**/*.ts'],
      lib: ["es5", "es6", "es7", "dom"],
      target: "es5"
    }),
    resolve()
  ]
};
