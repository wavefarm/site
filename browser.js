var o = require('observ')
var struct = require('observ-struct')


var env = process.env.NODE_ENV;

// SSE reload on dev
if (env == 'dev') require('deva');

// THE STATE
window.state = struct({
  archive: struct({
    item: o(),
    params: o(),
    results: o()
  }),
  section: o(),
  schemas: o(),
  title: o()
})

require('./lib/archive')()
require('./lib/pointer')()
require('./lib/schedule')()
require('./lib/schemas')()
require('./lib/subnav')()
require('./lib/tweets')()
