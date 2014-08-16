var h = require('virtual-hyperscript')
var itemClick = require('../../events/item-click')
var renderDate = require('../date')


module.exports = function (item) {
  return h('.item',
    h('a.item-link#' + item.id, {
      'href': '/archive/' + item.id,
      'ev-click': itemClick
    }, [
      h('h3', [
        h('span.item-main', item.main),
        ' ',
        h('span.type', '(' + item.type + ')')
      ]),
      h('.date', renderDate(item))
    ])
  )
}
