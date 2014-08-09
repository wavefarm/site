var h = require('virtual-hyperscript')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.caption', item.caption),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
