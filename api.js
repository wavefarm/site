var apiUrl = typeof window === 'undefined' ?
  process.env.APIURL :
  window.location.origin + '/api/'

module.exports = require('wavefarm')(apiUrl)
