var h = require('virtual-hyperscript')
var itemClick = require('../../events/item-click')
var renderDate = require('../date')


function getSites (item) {
  var sites = []
  function pushSite (site) {
    if (sites.indexOf(site) == -1) sites.push(site)
  }
  if (item.sites) {
    if (item.sites.indexOf('transmissionarts') != -1) pushSite('ta')
    if (item.sites.indexOf('wgxc') != -1) pushSite('wgxc')
  }
  if (item.type == 'broadcast') pushSite('wgxc')
  if (item.type == 'show') pushSite('wgxc')
  return sites.map(function (site) {
    return h('.' + site + '.site-icon')
  })
}

function getLink (item) {
  if ((item.type == 'broadcast' || item.type == 'show') && item.sites) {
    if (item.sites.indexOf('wgxc') != -1) {
    	return {href: '/wgxc/schedule/' + item.id}
    }
    if (item.sites.indexOf('transmissionarts') != -1) {
    	return {href: '/ta/schedule/' + item.id}
    }
  }
  if (item.type == 'news' && item.sites) {
    if (item.sites.indexOf('wgxc') != -1) {
    	return {href: '/wgxc/newsroom/' + item.id}
    }
    if (item.sites.indexOf('transmissionarts') != -1) {
    	return {href: '/ta/newsroom/' + item.id}
    }
  }
  if (item.type == 'event' && item.sites) {
  	if (item.sites.indexOf('wgxc') != -1) {
  		return {href: '/wgxc/calendar/' + item.id}
  	}
		if (item.sites.indexOf('transmissionarts') != -1) {
			return {href: '/ta/calendar/' + item.id}
		}
  }
  if (item.type == 'artist' && item.categories && item.categories.indexOf('Transmission Artist') != -1) {  	
    return {href: '/ta/artists/' + item.id}
  }
  if (item.type == 'work' && item.sites && item.sites.indexOf('transmissionarts') != -1) {
    return {href: '/ta/works/' + item.id}
  }
  return {
    href: '/archive/' + item.id,
    'ev-click': itemClick
  }
}

module.exports = function (item) {
  var desc = item.description || item.briefDescription || item.longDescription || ''
  // Strip HTML tags from description for excerpt display
  desc = desc.replace(/<[^>]*>/g, '')
  return h('.result', [
    h('.item-subsites', getSites(item)),
    h('a.item-link#' + item.id, getLink(item), [
      h('h3', [
        h('span.item-main', item.main),
        ' ',
        h('span.type', '(' + item.type + ')')
      ]),
      h('.date', renderDate(item)),
      h('.credit', item.credit),
      h('.description', desc.length > 60 ? desc.substr(0, 60) + '...' : desc)
    ])
  ])
}
