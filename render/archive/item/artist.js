var h = require('virtual-hyperscript')
var fromHTML = require('vdom-virtualize').fromHTML

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    // vdom-virtualize breaks everything when run on the server
    (typeof window !== 'undefined' ?
      fromHTML('<div class="bio">'+item.bio+'</div>') :
      h('.bio', item.bio))
  ])
}
