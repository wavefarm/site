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
    h('.credit', item.credit),
    h('.date', renderDate(item)),
    vdomify('.description', item.description),
    h('.player', h('audio', {controls: true},
      h('source', {src: item.url, type: item.mimetype})
    )),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
