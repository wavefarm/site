var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('.head', [
    h('a.wf-logo', {href: '/'}, h('span.alt-text', 'Wave Farm')),
    h('a.ta.sub', {href: 'http://transmissionarts.org', target: '_blank'}, [
      h('.subtext', h('img', {alt: 'TRANSMISSION ARTS', src: '/images/ta-icon-text.png'})),
      h('.subicon')
    ]),
    h('a.wgxc.sub', {href: 'http://wgxc.org', target: '_blank'}, [
      h('.subtext', h('img', {alt: 'WGXC 90.7-FM', src: '/images/wgxc-icon-text.png'})),
      h('.subicon')
    ]),
    h('a.mag.sub', {href: '/mag'}, [
      h('.subtext', h('img', {alt: 'MEDIA ARTS GRANTS', src: '/images/mag-icon-text.png'})),
      h('.subicon')
    ]),
  ])
}
