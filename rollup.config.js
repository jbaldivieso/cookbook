import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    postcss({
      extract: 'bundle.css',
      minimize: !dev
    }),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' }
      ]
    }),
    dev && serve({
      open: true,
      contentBase: 'dist',
      port: 3000
    }),
    dev && livereload('dist')
  ].filter(Boolean)
};
