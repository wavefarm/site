var elemify = require('virtual-dom/create-element')
var render = require('../../render')


module.exports = function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('<!doctype html>' + String(elemify(render({section: "archive"}))))
}
