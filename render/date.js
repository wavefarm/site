var h = require('virtual-hyperscript')
var moment = require('moment')


module.exports = function (item) {
  var m, m2, f, f2

  // For shows just display airtime
  if (item.type == 'show') return item.airtime

  if (item.date) {
    m = moment(item.date)
    f = item.yearOnly ? m.format('YYYY') : m.format('ll')
    return h('time', {dateTime: item.date}, f)
  }

  if (item.start) {
    m = moment(item.start)
    f = item.allDay ? m.format('ll') : m.format('lll')

    if (!item.end || item.end == item.start) {
      return h('time', {dateTime: item.start}, f)
    }

    m2 = moment(item.end)
    f2 = item.allDay ? m2.format('ll') : m2.format('lll')

    if (f == f2) {
      return h('time', {dateTime: item.start}, f)
    }

    return [
      h('time', {dateTime: item.start}, f),
      '–',
      (!item.allDay && m.format('ll') == m2.format('ll')) ?
        h('time', {dateTime: item.end}, m2.format('LT')) :
        h('time', {dateTime: item.end}, f2)
    ]
  }

  return ''
}
