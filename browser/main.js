var archive = require('./archive');
var struct = require('observ-struct')
var pointer = require('./pointer');
var schedule = require('./schedule');
var subnav = require('./subnav');
var tweets = require('./tweets');


var env = process.env.NODE_ENV;

// SSE reload on dev
if (env == 'dev') require('deva');

// THE STATE
window.state = struct({
  archive: archive()
})

pointer();
schedule();
subnav();
tweets();
