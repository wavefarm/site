var h = require('virtual-hyperscript')
var renderDate = require('../date')
var renderMoreInfo = require('../more-info')


module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.date', renderDate(item)),
    renderMoreInfo(item),
    h('.briefDescription', {innerHTML: item.briefDescription}),
    h('.longDescription', {innerHTML: item.longDescription})
  ])
}
