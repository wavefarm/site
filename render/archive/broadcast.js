var h = require('virtual-hyperscript')
var renderDate = require('../date')
var vdomify = require('vdomify')


module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.date', renderDate(item)),
    vdomify('.description', item.description)
  ])
}
