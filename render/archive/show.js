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
    h('.airtime', item.airtime),
    renderMoreInfo(item),
    h('.credit', item.credit),
    vdomify('.description', item.description)
  ])
}
