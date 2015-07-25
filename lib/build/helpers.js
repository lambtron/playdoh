
var date = require('helper-date');
var domain = require('root-domain');
var marked = require('marked');
var download = require('download-github-repo');

/**
 * Date formatting.
 */

exports.date = date;

/**
 * Domain.
 */

exports.domain = domain;

/**
 * Markdown.
 */

marked.setOptions({
  gfm: true,
  smartLists: true,
  smartypants: true,
  tables: true
});

exports.markdown = function(string){
  return marked(string);
};

/**
 * Timestamps.
 */

exports.timestamp = function(date){
  return date.toISOString();
};

/**
 * Thunked download.
 */

exports.download = function(repo, dest) {
  return function(fn) {
    download(repo, dest, function(err) {
      if (err) fn(err, null);
      fn(null, { success: true });
    });
  }
};
