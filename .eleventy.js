const fs = require('fs');
const htmlmin = require('html-minifier');
const markdown = require('markdown-it')({ html: true });
const prettydata = require('pretty-data');
const readingTime = require('eleventy-plugin-reading-time');


module.exports = (config) => {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/images');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/styles');

    config.addPlugin(readingTime);

    config.addPairedShortcode('markdown', (content) => {
        return markdown.render(content);
    });

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
        return value.toISOString();
    });
    
    config.addFilter('ruDate', (value) => {
        return value.toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(' г.', '');
    });

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
