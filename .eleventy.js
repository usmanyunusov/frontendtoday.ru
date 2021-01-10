const chalk = require('chalk');
const markdown = require('markdown-it')({ html: true });
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const transforms = require('./utils/transforms.js');
const filters = require('./utils/filters.js');
const shortcodes = require('./utils/shortcodes.js');

module.exports = (config) => {
  console.log(chalk.black.bgGreen('Eleventy is building, please wait…'));

  // Pass-through files
  config.addPassthroughCopy({
    'src/assets/favicon.ico': 'favicon.ico',
    'src/assets/robots.txt': 'robots.txt',
    'src/assets/manifest.webmanifest': 'manifest.webmanifest',
    'src/assets/images': 'static/images',
    'src/assets/fonts': 'static/fonts',
    'src/articles/**/*.(jpg|png|svg|mp4|webm)': '',
  });

  // Add plugins
  config.addPlugin(
    cacheBuster({
      outputDirectory: 'dist',
    })
  );

  config.addPlugin(syntaxHighlight, {
    alwaysWrapLineHighlights: false,
    trim: true,
  });

  // Add shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    config.addFilter(shortcodeName, shortcodes[shortcodeName]);
  });

  // Add filters
  Object.keys(filters).forEach((filterName) => {
    config.addFilter(filterName, filters[filterName]);
  });

  // Add transforms
  Object.keys(transforms).forEach((transformName) => {
    config.addTransform(transformName, transforms[transformName]);
  });

  config.setDataDeepMerge(true);
  config.setUseGitIgnore(false);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'components',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
  };
};
