var api = require('../../api')
var t = require('../../templates')


var idRe = /\/wgxc\/schedule\/(\w{6})/
var wgxcTypes = [
  'broadcast',
  'show'
]
  
module.exports = function (req, res) {
  var id = idRe.exec(req.url)[1]
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (wgxcTypes.indexOf(item.type) == -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    console.log(item)
    res.setHeader('Content-Type', 'text/html');
    t('/layout.html').pipe(hs({
      'title': item.main,
      '.head': t('/wgxc/head.html'),
      '.nav': t('/wgxc/nav.html'),
      '.main': t('/wgxc/item.html').pipe(hs({
        '.item-main': item.main,
        '.description': item.description
      }))
    })).pipe(res)
  })
}
