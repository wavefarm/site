var api = require('../api')
var render = require('../render')
var stringify = require('virtual-dom-stringify')


module.exports = function (req, res, id) {
  api.get(id, function (err, item) {
    if (err) {
      if (err.message == '[API] Not Found') return res.error(404, err)
      return res.error(500, err)
    }

    var state = {archive: {item: item}}
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html>' + stringify(render(state)))
  })
}
