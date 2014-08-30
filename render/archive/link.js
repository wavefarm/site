var h = require('virtual-hyperscript')
var itemClick = require('../../events/item-click')
var renderDate = require('../date')


function getSites (item) {
  var sites = []
  function pushSite (site) {
    if (sites.indexOf(site) == -1) sites.push(site)
  }
  if (item.sites) {
    if (item.sites.indexOf('transmissionarts.org') != -1) pushSite('ta')
    if (item.sites.indexOf('wgxc.org') != -1) pushSite('wgxc')
  }
  if (item.type == 'broadcast') pushSite('wgxc')
  if (item.type == 'show') pushSite('wgxc')
  return sites.map(function (site) {
    return h('.' + site + '.site-icon')
  })
}

module.exports = function (item) {
  return h('.item', [
    h('.item-subsites', getSites(item)),
    h('a.item-link#' + item.id, {
      'href': '/archive/' + item.id,
      'ev-click': itemClick
    }, [
      h('h3', [
        h('span.item-main', item.main),
        ' ',
        h('span.type', '(' + item.type + ')')
      ]),
      h('.date', renderDate(item))
    ])
  ])
}
