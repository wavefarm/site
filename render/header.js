var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('.header-fill', h('header',
    h('.search', h('form', {action: '/archive'},
      h('input#q', {type: 'search', name: 'q', placeholder: 'SEARCH'})
    ))
  ))
}
