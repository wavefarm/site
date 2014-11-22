var h = require('virtual-hyperscript')
var renderItem = require('./item')
var renderSearch = require('./search')


module.exports = function (data) {
  var item = data && data.archive && data.archive.item
  return h('.main', [
    h('.archive.page', [
      h('h1', 'SEARCH'),
      item ? renderItem(item) : renderSearch(data),
    ])
  ])
}
