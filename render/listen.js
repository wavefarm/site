var fs = require('graceful-fs')
var h = require('virtual-hyperscript')
var vdomify = require('vdomify')

var template = fs.readFileSync(__dirname + '/../templates/listen.html', 'utf8')

module.exports = function (state) {
  //return h('.listen', {innerHTML: fs.readFileSync(__dirname + '/../templates/listen.html', 'utf8')})
  return vdomify('.listen', template)
}
