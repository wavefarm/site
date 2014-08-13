var h = require('virtual-hyperscript')
var searchSubmit = require('../events/search-submit')


module.exports = function (state) {
  return h('.header-fill', h('header',
    h('.search', h('form', {
        action: '/archive',
        'ev-submit': searchSubmit
      },
      h('input#q', {type: 'search', name: 'q', placeholder: 'SEARCH'})
    ))
  ))
}
