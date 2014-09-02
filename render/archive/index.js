var h = require('virtual-hyperscript')
var renderItem = require('./item')
var renderResults = require('./results')


module.exports = function (data) {
  var archive = data.archive || {}
  if (archive.results) archive.results.q = archive.q
  return h('.main', [
    h('.archive.page', [
      h('h1', 'ARCHIVE'),
      archive.item ? renderItem(archive.item) : renderResults(archive.results),
    ])
  ])
}
