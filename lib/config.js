
var exists = require('fs').existsSync;
var logger = require('./logger');
var read = require('read-metadata').sync;
var resolve = require('path').resolve;

/**
 * Expose `config`.
 */

module.exports = config;

/**
 * Read the config from `dir`.
 *
 * @param {String} dir (optional)
 * @return {Object}
 */

function config(dir) {
  dir = dir || process.cwd();
  var file = resolve(dir, 'config.yaml');

  if (!exists(file)) {
    logger.fatal('No `config.yaml` found. Is this a Plato directory?');
  }

  try {
    return read(file);
  } catch (e) {
    logger.fatal('Invalid configuration in `config.yaml`!');
  }
}