var h = require('virtual-hyperscript')
var vdomify = require('vdomify')


function concoctFullAddress (item) {
  var addy = ''
  addy += item.address ? item.address + '<br>' : ''
  addy += item.address2 ? item.address2 + '<br>' : ''
  addy += item.city || ''
  addy += item.city && item.state ? ', ' : ''
  addy += item.state ? item.state + ' ' : ''
  addy += item.postalCode ? item.postalCode + '<br>' : ''
  addy += item.country || ''
  return addy
}

module.exports = function (item) {
  return h('.item#' + item.id, [
    h('h2', [
      h('span.item-main', item.main),
      ' ',
      h('span.item-type', '(' + item.type + ')')
    ]),
    vdomify('.address', concoctFullAddress(item)),
    h('.phone', item.phone),
    h('.url',  h('a', {_target: 'blank', href: item.url}, item.url))
  ])
}
