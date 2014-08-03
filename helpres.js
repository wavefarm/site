var http = require('http')


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
}
