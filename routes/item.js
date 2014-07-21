var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')


var idRe = /\/archive\/(\w{6})/
var archiveTypes = [
  'audio',
  'video',
  'text',
  'image'
]
  
module.exports = function (req, res) {
  var id = idRe.exec(req.url)[1]
  api.get(id, function (err, apiRes, item) {
    if (err) {
      return res.error(500, err)
    }

    if (archiveTypes.indexOf(item.type) == -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    //console.log(item)
    res.setHeader('Content-Type', 'text/html');
    t('/layout.html').pipe(hs({
      'title': item.main,
      '.head': t('/head.html'),
      '.main': t('/item.html').pipe(hs({
        '.item-main': item.main,
        '.caption': item.caption,
        '.download a': {href: item.url}
      }))
    })).pipe(res)
  })
}
