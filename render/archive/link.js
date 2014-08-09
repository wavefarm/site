var h = require('virtual-hyperscript')

module.exports = function (item) {
  return h('.item',
    h('a.item-link#' + item.id, {'href': '/archive/' + item.id}, [
      h('span.item-main', item.main),
      ' ',
      h('span.type', '(' + item.type + ')')
    ])
  )
}
