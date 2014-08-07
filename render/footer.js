var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('.footer-fill', h('footer', [
    h('nav.wf1', [
      h('a', {href: '/about'}, 'ABOUT'),
      h('a', {href: '/programs'}, 'PROGRAMS'),
      h('a', {href: '/events'}, 'EVENTS'),
      h('a', {href: '/archive'}, 'ARCHIVE'),
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
        h('span.studio-name', 'WGXC Catskill'),
        ' · ',
        h('span.studio-info', '344 Main Street Catskill, NY 12414 (518) 291-9294'),
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
      h('a.mailing', {href: '//eepurl.com/yRqVP', target: '_blank'},
        h('span', 'MAILING LIST')
      ),
    ])
  ]))
}
