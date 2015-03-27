
/**
 * Dependencies.
 */

require('./client/lib/profile');
require('./client/lib/summary');

/**
 * Code highlighting.
 */

require('segmentio/highlight')()
  .use(require('segmentio/highlight-bash'))
  .use(require('segmentio/highlight-csharp'))
  .use(require('segmentio/highlight-css'))
  .use(require('segmentio/highlight-go'))
  .use(require('segmentio/highlight-java'))
  .use(require('segmentio/highlight-javascript'))
  .use(require('segmentio/highlight-json'))
  .use(require('segmentio/highlight-objective-c'))
  .use(require('segmentio/highlight-php'))
  .use(require('segmentio/highlight-python'))
  .use(require('segmentio/highlight-ruby'))
  .use(require('segmentio/highlight-sql'))
  .use(require('segmentio/highlight-xml'))
  .use(require('segmentio/highlight-yaml'))
  .all();
