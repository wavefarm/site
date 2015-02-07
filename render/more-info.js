var h = require('virtual-hyperscript')

var wgxcTypeMap = {
  artist: 'people',
  broadcast: 'events',
  collaborator: 'people',
  event: 'events',
  location: 'places',
  show: 'schedule',
  audio: 'archives',
  video: 'archives',
  image: 'archives',
  text: 'archives'
}

module.exports = function (item) {
  return h('ul.more-info',
    item.sites.map(function (site) {
      var link
      if (site === 'transmissionarts') {
        link = 'http://' + site + '.org/' + item.type + '/' + item.id
      } else if (site === 'wgxc') {
        if (!wgxcTypeMap[item.type]) link = ''
        else link = 'http://' + site + '.org/' + wgxcTypeMap[item.type] + '/' + item.oldId
      }
      return h('li', [
        'More info at ',
        h('a', {href: link, target: '_blank'}, site + '.org')
      ])
    })
  )
}
