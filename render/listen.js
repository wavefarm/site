var fs = require('graceful-fs')
var vdomify = require('vdomify')

var template = fs.readFileSync(__dirname + '/../templates/listen.html', 'utf8')

module.exports = function (state) {
  return vdomify('.listen', template)
}
