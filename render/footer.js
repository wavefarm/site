var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('.footer-fill', h('footer', [
    h('nav.wf1', [
      h('a', {href: '/about'}, 'ABOUT'),
      h('a', {href: '/programs'}, 'PROGRAMS'),
      h('a', {href: '/calendar'}, 'EVENTS'),
      h('a', {href: '/archive?q=type%3Aaudio%20OR%20type%3Avideo%20OR%20type%3Aimage%20OR%20type%3Atext&date=&date2=&sort=-timestamp'}, 'ARCHIVE'),
      h('a', {href: '/newsroom'}, 'NEWSROOM')
    ]),
    h('nav.wf2', [
      h('a', {href: '/support'}, 'SUPPORT'),
      h('a', {href: '/contact'}, 'CONTACT'),
    ]),
    h('.studios', [
      h('div', [
        '· ',
        h('span.studio-name', 'Wave Farm/WGXC Acra'),
        ' · ',
        h('span.studio-info', '5662 Route 23 Acra, NY 12405 (518) 622-2598'),
        ' ·'
      ]),
      h('div', [
        '· ',
        h('span.studio-name', 'WGXC Hudson'),
        ' · ',
        h('span.studio-info', '704 Columbia St Hudson, NY 12534 (518) 697-7400'),
        ' ·'
      ]),
      h('div', [
        '· ',
        h('span.studio-name', 'WGXC Satellite'),
        ' · ',
        h('span.studio-info', 'currently at the Catskill Public Library'),
        ' ·'
      ])
    ]),
    h('.fineprint', [
      h('a.copyright', {href: '/about'}, '© Wave Farm'),
      h('a.legal', {href: '/legal'}, 'LEGAL'),
      h('a.privacy', {href: '/privacy'}, 'PRIVACY')
    ]),
    h('.social', [
      h('a.twitter', {href: '//twitter.com/free103point9', target: '_blank'},
        h('span', 'T')
      ),
      h('a.facebook', {href: '//facebook.com/wavefarm.org', target: '_blank'},
        h('span', 'F')
      ),
      h('a.mailing', {href: 'http://eepurl.com/yRqVP', target: '_blank'},
        h('span', 'MAILING LIST')
      ),
    ])
  ]))
}
