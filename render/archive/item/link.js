var h = require('virtual-hyperscript')

module.exports = function (item) {
  return h('a', {'href': '/' + item.id}, [
    h('span.item-main', item.main),
    ' ',
    h('span.type', '(' + item.type + ')')
  ])
}
