var api = require('../../api')
var hs = require('hyperstream')
var t = require('../../templates')

var idRe = /\/wgxc\/calendar\/(\w{6})/
var wgxcTypes = [
  'broadcast',
  'show',
  'event'
]

module.exports = function (req, res) {
  var id = idRe.exec(req.url)[1]
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (wgxcTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t('/wgxc/head.html'),
      '.nav': t('/wgxc/nav.html'),
      '.main': t('/wgxc/event.html').pipe(hs({
        '.item-main': item.main,
        '.description': item.briefDescription,
        '.start-date': item.startDate,
        '.end-date': item.endDate
      }))
    })).pipe(res)
  })
}
