var hs = require('hyperstream')
var t = require('../templates')

module.exports = function (req, res) {

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/listen-popout.html').pipe(hs({
      '.listen': t('/listen.html')
    })).pipe(res)
}
