var http = require('http')
var mustache = require('mustache')
var snout = require('snout')

var t = snout(__dirname + '/templates')

module.exports = function helpres (res) {
  res.error = function (code, err) {
    if (code == 404) console.warn('Warning:', err.message)
    else console.error(err.stack)

    res.statusCode = code
    return res.end(http.STATUS_CODES[code])
  }

  res.redirect = function (to, code) {
    console.warn('Warning: Moved Permanently')

    res.statusCode = code || 301
    res.setHeader('location', to)
    res.end('Moved Permanently')
  }

  res.render = function (view, partialNames) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    var partials = {}
    Object.keys(partialNames).forEach(function (name) {
      partials[name] = t[partialNames[name]]
    })
    res.end(mustache.render(t['layout.html'], view, partials))
  }

  res.t = t
}
