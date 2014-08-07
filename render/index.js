var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('html', [
    h('head', [
      h('title', state.title || 'Wave Farm'),
      h('link', {
        href: '//fonts.googleapis.com/css?family=Roboto:400,300',
        rel: 'stylesheet'
      }),
      h('link', {href: '/style.css', rel: 'stylesheet'}),
      h('script', {src: '/ua.js'})
    ]),
    h('body', [
      h('.container', [
        h('.header-container', require('./header')(state)),
        h('.main-container', [
          require('./head')(state),
          require('./nav')(state),
          require('./main')(state),
          require('./listen')(state)
        ]),
        h('.tweets-container', require('./tweets')(state)),
        h('.footer-container', require('./footer')(state))
      ]),
      h('script', 'window.initialState = ' + JSON.stringify(state)),
      h('script', {src: '/scripts/jquery.js'}),
      h('script', {src: '/script.js'})
    ])
  ])
}
