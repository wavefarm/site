var env = process.env.NODE_ENV;

// SSE reload on dev
if (env == 'dev') require('deva');

require('./lib/pointer')()
require('./lib/schedule')()
require('./lib/subnav')()
require('./lib/tweets')()
require('./lib/listenlive')()
require('./lib/calendar')()
require('./lib/news-calendar')()
require('./lib/related-items')()
require('./lib/subsite-search')()
require('./lib/wf-slideshow')()
require('./lib/scrollUp')()
require('./lib/announce')()
require('./lib/artist-index')()
require('./lib/work-index')()
require('./lib/radio-dial')()
