var h = require('virtual-hyperscript')


module.exports = function (state) {
  return h('.container', [
    h('.header-container', require('./header')(state)),
    h('.main-container', [
      require('./head')(state),
      require('./nav')(state),
      require('./main')(state),
      require('./listen')(state)
    ]),
    h('.tweets-container', require('./tweets')(state)),
    h('.footer-container', require('./footer')(state))
  ])
}
