const chalk = require('chalk');
const { DateTime } = require("luxon");

const fs = require('fs');
const htmlmin = require('html-minifier');
const markdown = require('markdown-it')({ html: true });
const prettydata = require('pretty-data');
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');

module.exports = (config) => {
    console.log(chalk.black.bgGreen('Eleventy is building, please wait…'));

    // ----------------------------------------------------------------------------
    // COPY FILES
    // ----------------------------------------------------------------------------
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/robots.txt');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/**/*.(jpg|png|svg|mp4|webm)');


    // ----------------------------------------------------------------------------
    // WATCH FILES
    // ----------------------------------------------------------------------------
    // config.addWatchTarget('src/scripts');
    // config.addWatchTarget('src/styles');

    config.addPlugin(cacheBuster({
        outputDirectory: 'dist',
    }));

    // ----------------------------------------------------------------------------
    // SHORTCODES
    // ----------------------------------------------------------------------------
    config.addPairedShortcode('markdown', (content) => {
        return markdown.render(content);
    });

    // ----------------------------------------------------------------------------
    // FILTERS
    // ----------------------------------------------------------------------------
    config.addFilter('length', (path) => {
        const stats = fs.statSync(path);

        return stats.size;
    });

    config.addFilter('htmlmin', (value) => {
        return htmlmin.minify(
            value, {
            removeComments: true,
            collapseWhitespace: true
        }
        );
    });

    config.addFilter('isoDate', (value) => {
        return DateTime.fromJSDate(value, { zone: 'utc' }).toISO();
    });

    config.addFilter('ruDate', (value) => {
        return DateTime.fromJSDate(value).setLocale('ru').toFormat('dd MMMM yyyy');
    });

    // ----------------------------------------------------------------------------
    // TRANSFORMS
    // ----------------------------------------------------------------------------
    config.addTransform('htmlmin', (content, outputPath) => {
        if (outputPath && outputPath.endsWith('.html')) {
            const result = htmlmin.minify(
                content, {
                removeComments: true,
                collapseWhitespace: true
            }
            );

            return result;
        }

        return content;
    });

    config.addTransform('xmlmin', (content, outputPath) => {
        if (outputPath && outputPath.endsWith('.xml')) {
            return prettydata.pd.xmlmin(content);
        }

        return content;
    });

    config.setDataDeepMerge(true);
    config.setUseGitIgnore(false);

    // https://www.11ty.io/docs/config/#configuration-options
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'njk'
        ],
    };
};
