var api = require('../../api')
var elemify = require('virtual-dom/create-element')
var render = require('../../render/layout')

module.exports = function (req, res, id) {
  api.get(id, function (err, item) {
    if (err) {
      if (err.message === '[API] Not Found') return res.error(404, err)
      return res.error(500, err)
    }

    var state = {archive: {item: item}, section: 'archive', title: item.main}
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<!doctype html>' + String(elemify(render(state))))
  })
}
