const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/winternote.js',
    format: 'umd',
    name: 'winternote'
  },
  plugins: [
    typescript({
      include: ['**/*.js', '**/*.ts'],
      lib: ["es5", "es6", "dom"],
      target: "es5"
    }),
    resolve()
  ]
};
