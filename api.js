var wf = require('wavefarm')

var options = {path: '/api'}

if (typeof window !== 'undefined') {
  options.host = window.location.hostname
  options.port = window.location.port
} else {
  options.host = 'localhost'
  options.port = process.env.PORT || 1041
}

module.exports = wf(options)
