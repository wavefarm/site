var h = require('virtual-hyperscript')
var moment = require('moment')
var vdomify = require('vdomify')


module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    h('.credit', item.credit),
    vdomify('.description', item.description),
    h('.date', h('time', {dateTime: item.date},
      moment(item.date).format('ll')
    )),
    h('.image', h('img', {alt: item.main, src: item.url})),
    h('.download',
      h('a', {href: item.url, download: true}, 'Download (' + item.mimetype + ')')
    )
  ])
}
