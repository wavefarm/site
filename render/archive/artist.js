var h = require('virtual-hyperscript')
var vdomify = require('vdomify')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    vdomify('.bio', item.bio)
  ])
}
