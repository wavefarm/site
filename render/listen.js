var fs = require('graceful-fs')
var h = require('virtual-hyperscript')
var vdomify = require('vdomify')

module.exports = function (state) {
  //return h('.listen', {innerHTML: fs.readFileSync(__dirname + '/../templates/listen.html', 'utf8')})
  return vdomify('.listen', fs.readFileSync(__dirname + '/../templates/listen.html', 'utf8'))
}
