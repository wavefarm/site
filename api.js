var wf = require('wavefarm')

module.exports = wf({
  host: 'localhost',
  port: 1041,
  path: '/api',
  withCredentials: false
})
