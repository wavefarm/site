var h = require('virtual-hyperscript')
var moment = require('moment')

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.caption', item.caption),
    h('.date', h('time', {dateTime: item.date},
      moment(item.date).format('ll')
    )),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
