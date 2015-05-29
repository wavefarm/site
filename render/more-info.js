var h = require('virtual-hyperscript')

module.exports = function (item) {
  if (!item.sites) item.sites = []
  return h('ul.more-info',
    item.sites.map(function (site) {
      if (site === 'transmissionarts') {
        return h('li', [
          'More info at ',
          h('a', {
            href: 'http://' + site + '.org/' + item.type + '/' + item.id,
            target: '_blank'
          }, site + '.org')
        ])
      }
    })
  )
}
