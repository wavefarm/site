var wf = require('wavefarm')

module.exports = wf({
  host: process.env.API_HOST,
  port: process.env.API_PORT,
  withCredentials: false
})
