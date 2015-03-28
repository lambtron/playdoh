
var logger = require('./logger');
var read = require('read-metadata').sync;

/**
 * Expose `config`.
 */

module.exports = config;

/**
 * Read the config from disk.
 *
 * @return {Object}
 */

function config() {
  try {
    return read('config.yaml');
  } catch (e) {
    logger.fatal('Invalid configuration in `config.yaml`!');
  }
}