var h = require('virtual-hyperscript')
var fromHTML = require('vdom-virtualize').fromHTML
var renderDate = require('../date')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.date', renderDate(item)),
    // vdom-virtualize breaks everything when run on the server
    item.longDescription ? (typeof window !== 'undefined' ?
      fromHTML('<div class="longDescription">'+item.longDescription+'</div>') :
      h('.longDescription', item.longDescription)) : ''
  ])
}
