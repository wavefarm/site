var h = require('virtual-hyperscript')
var renderDate = require('../date')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.caption', item.caption),
    h('.date', renderDate(item)),
    h('.player', h('audio', {controls: true},
      h('source', {src: item.url, type: item.mimetype})
    )),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
