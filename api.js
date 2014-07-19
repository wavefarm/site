var wf = require('wavefarm')


var options;

if (window) {
  options = {
    host: window.location.hostname,
    port: window.location.port,
    path: '/api'
  };
} else {
  options = {
    host: 'localhost',
    port: 1039
  };
}

module.exports = wf(options);
