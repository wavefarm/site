var h = require('virtual-hyperscript')


module.exports = function (state) {
  // "Routing" for main depending on state
  if (state.archive) {
    return require('./archive')(state.archive)
  }

  // TODO Render site index page if nothing found in state
  return ''
}
