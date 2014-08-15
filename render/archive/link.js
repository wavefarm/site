var h = require('virtual-hyperscript')
var itemClick = require('../../events/item-click')

module.exports = function (item) {
  return h('.item',
    h('a.item-link#' + item.id, {
      'href': '/archive/' + item.id,
      'ev-click': itemClick
    }, [
      h('span.item-main', item.main),
      ' ',
      h('span.type', '(' + item.type + ')')
    ])
  )
}
