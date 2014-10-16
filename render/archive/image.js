var h = require('virtual-hyperscript')
var renderDate = require('../date')
var renderMoreInfo = require('../more-info')
var vdomify = require('vdomify')


module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.date', renderDate(item)),
    renderMoreInfo(item),
    h('.credit', item.credit),
    vdomify('.description', item.description),
    h('.image', h('img', {alt: item.main, src: item.url})),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
