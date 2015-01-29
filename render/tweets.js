var h = require('virtual-hyperscript')

module.exports = function (state) {
  return h('.tweets',
    h('a.twitter', {href: '//twitter.com/free103point9', target: '_blank'},
      h('span', 'T')
    )
  )
}
