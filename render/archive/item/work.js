var h = require('virtual-hyperscript')
var fromHTML = require('vdom-virtualize').fromHTML

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    fromHTML('<div class="description">'+item.description+'</div>')
  ])
}
