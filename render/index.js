var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('html', [
    h('head', [
      h('title', state.title || 'Wave Farm'),
      h('link', {href: '//fonts.googleapis.com/css?family=Roboto:400,300', rel: 'stylesheet'}),
      h('link', {href: '/style.css', rel: 'stylesheet'}),
      h('script', {src: '/ua.js'})
    ]),
    h('body', [
      h('.container', [
        h('.header-container', h('.header-fill', h('header',
          h('.search', h('form', {action: '/archive'},
            h('input#q', {type: 'text', name: 'q', placeholder: 'SEARCH'})
          ))
        ))),
        h('.main-container', [
        ])
      ])
    ])
  ])
}
