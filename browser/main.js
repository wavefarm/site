var archive = require('./archive');
var pointer = require('./pointer');
var schedule = require('./schedule');
var subnav = require('./subnav');
var tweets = require('./tweets');


var env = process.env.NODE_ENV;

// SSE reload on dev
if (env == 'dev') require('deva');

// THE STATE
var state = {};

archive(state);
pointer();
schedule();
subnav();
tweets();
