
var buildDate = require('metalsmith-build-date');
var collections = require('metalsmith-collections');
var drafts = require('metalsmith-drafts');
var excerpt = require('metalsmith-excerpt');
var fs = require('fs');
var helpers = require('./helpers');
var lodash = require('lodash');
var markdown = require('metalsmith-markdown');
var path = require('path');
var permalinks = require('metalsmith-permalinks');
var read = require('read-metadata').sync;
var templates = require('metalsmith-templates');
var title = require('metalsmith-title');

var defaults = lodash.defaults;
var extend = lodash.extend;
var basename = path.basename;
var resolve = path.resolve;
var extname = path.extname;
var readdir = fs.readdirSync;

/**
 * Expose `plugins`.
 */

var plugins = module.exports = [];

/**
 * Mix in top-level config metadata.
 *
 * @param {Object} options
 *   @property {String} config
 * @return {Function}
 */

plugins.push(function(options){
  return function(files, metalsmith){
    var dir = metalsmith.directory();
    var file = resolve(dir, options.config);
    var conf = read(file);
    var data = metalsmith.metadata();
    extend(data, conf);
    metalsmith.metadata(data);
  };
});

/**
 * Mix in the author's public files.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  return function*(files, metalsmith){
    var dir = metalsmith.directory();
    var publics = yield metalsmith.read(resolve(dir, 'public'));
    extend(files, publics);
  };
});

/**
 * Add the build date, for things like the RSS feed or sitemap.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(buildDate);

/**
 * Articles template.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  return function(files){
    for (var key in files) {
      if ('.md' != extname(key)) continue;
      var file = files[key];
      file.template = 'article.hbs';
    }
  };
});

/**
 * Parse and remove date strings from the front of filenames.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  var re = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

  return function(files){
    for (var key in files) {
      var file = files[key];
      var match = re.exec(key);
      if (!match) continue;

      var date = match[1];
      var name = match[2];
      file.date = new Date(date);
      delete files[key];
      files[name] = file;
    }
  };
});

/**
 * Grab a title and an excerpt from each article, removing the title from the
 * contents once we have it.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  var re = {
    title: /^# *(.+)$/m,
    excerpt: /^([^#\n].+)$/m
  };

  return function(files){
    for (var key in files) {
      if ('.md' != extname(key)) continue;
      var file = files[key];
      var str = file.contents.toString();

      var title = re.title.exec(str)[1];
      var excerpt = re.excerpt.exec(str)[1];
      var end = str.indexOf(title) + title.length;
      var contents = str.slice(end);

      file.title = title;
      file.excerpt = excerpt;
      file.contents = new Buffer(contents);
    }
  };
});

/**
 * Create the articles collection.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  return collections({
    articles: {
      pattern: '**/*.md',
      reverse: true,
      sortBy: 'date'
    }
  });
});

/**
 * Convert posts from Markdown to HTML, as well as the excerpts.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  return markdown({
    gfm: true,
    keys: ['excerpt'],
    smartLists: true,
    smartypants: true,
    tables: true
  });
});

/**
 * Permalinks.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(permalinks);

/**
 * Copy over the default static files that apply to every Plato build.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  return function*(files, metalsmith){
    var statics = yield metalsmith.read(resolve(__dirname, '../static'));
    var supports = yield metalsmith.read(resolve(__dirname, '../support'));
    extend(files, statics);
    extend(files, supports);
  };
});

/**
 * Render all of the files through Handlebars templates.
 *
 * @param {Object} options
 * @return {Function}
 */

plugins.push(function(options){
  var dir = resolve(__dirname, '../templates');
  var files = readdir(dir);
  var partials = files.reduce(function(memo, file){
    var key = basename(file, extname(file));
    memo[key] = key;
    return memo;
  }, {});

  return templates({
    directory: dir,
    engine: 'handlebars',
    helpers: helpers,
    partials: partials
  });
});