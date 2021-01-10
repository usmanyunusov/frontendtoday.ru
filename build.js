require('dotenv').config();
const rollup = require('rollup');
const rollupPluginCJS = require('rollup-plugin-commonjs');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const rollupPluginPostCSS = require('rollup-plugin-postcss');
const fs = require('fs');
const chalk = require('chalk');

function disallowExternal(source, importer, isResolved) {
  if (isResolved && !source.match(/^\.{0,2}\//)) {
    throw new Error(
      `Unresolved external import: "${source}" (imported ` +
        `by: ${importer}), did you forget to npm install?`
    );
  }
}

async function build() {
  const isProd = process.env.ELEVENTY_ENV === 'prod';

  const appBundle = await rollup.rollup({
    input: 'src/assets/scripts/app.js',
    external: disallowExternal,
    plugins: [
      rollupPluginPostCSS({
        extract: 'app.css',
        plugins: [require('autoprefixer')],
        minimize: isProd,
      }),
      rollupPluginNodeResolve({
        browser: true,
      }),
      rollupPluginCJS({
        include: 'node_modules/**',
      }),
      isProd && terser(),
    ],
  });

  const appGenerated = await appBundle.write({
    dynamicImportFunction: 'window._import',
    entryFileNames: isProd ? 'app.js' : 'app.js',
    sourcemap: !isProd,
    dir: 'dist/static',
    format: 'esm',
  });

  const appResurce = {};
  appGenerated.output.forEach(({ fileName }) => {
    if (/.\.css$/.test(fileName)) {
      appResurce['css'] = {
        path: `/static/${fileName}`,
      };
    }

    if (/.\.js$/.test(fileName)) {
      appResurce['js'] = {
        path: `/static/${fileName}`,
      };
    }
  });

  fs.writeFileSync('src/data/resource.json', JSON.stringify(appResurce));

  console.log(chalk.black.bgBlue('Finished Rollup!'));
}

(async function () {
  await build();
})();
