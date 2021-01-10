const htmlmin = require('html-minifier');
const prettydata = require('pretty-data');

module.exports = {
  htmlmin: (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
      });

      return minified;
    }

    return content;
  },

  xmlmin: (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.xml')) {
      return prettydata.pd.xmlmin(content);
    }

    return content;
  },
};
