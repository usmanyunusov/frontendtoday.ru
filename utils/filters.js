const fs = require('fs');
const { DateTime } = require('luxon');

module.exports = {
  length: (path) => {
    const stats = fs.statSync(path);

    return stats.size;
  },

  htmlmin: (value) => {
    return htmlmin.minify(value, {
      removeComments: true,
      collapseWhitespace: true,
    });
  },

  isoDate: (value) => {
    return DateTime.fromJSDate(value, { zone: 'utc' }).toISO();
  },

  ruDate: (value) => {
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    let date = new Date(value);
    return `${date.getUTCDate()} ${
      months[date.getUTCMonth()]
    } ${date.getUTCFullYear()}`;
  },
};
