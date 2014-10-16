var elemify = require('virtual-dom/create-element')
var render = require('../../render/layout')


module.exports = function (req, res) {
  var state = {
    section: 'archive',
    title: 'Archive'
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!doctype html>' + String(elemify(render(state))))
}
