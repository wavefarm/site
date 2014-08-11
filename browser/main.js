var o = require('observ')
var struct = require('observ-struct')


var env = process.env.NODE_ENV;

// SSE reload on dev
if (env == 'dev') require('deva');

// THE STATE
window.state = struct({
  archive: struct({
    item: o(),
    q: o(),
    results: o()
  }),
  section: o(),
  title: o()
})

require('./archive')()
require('./pointer')()
require('./schedule')()
require('./subnav')()
require('./tweets')()
