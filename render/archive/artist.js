var h = require('virtual-hyperscript')
var renderMoreInfo = require('../more-info')
var vdomify = require('vdomify')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    renderMoreInfo(item),
    vdomify('.bio', item.bio)
  ])
}
