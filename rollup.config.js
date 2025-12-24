import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
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
    // 11ty handles HTML, we just bundle CSS/JS
    dev && serve({
      open: false,  // 11ty will serve and open browser
      contentBase: 'dist',
      port: 3001  // Different port than 11ty
    }),
    dev && livereload('dist')
  ].filter(Boolean)
};
