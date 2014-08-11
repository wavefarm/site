var h = require('virtual-hyperscript')


module.exports = function (state) {
  // "Routing" for main depending on state
  if (state.section == 'archive') {
    return require('./archive')(state)
  }

  // TODO Render site index page if nothing found in state
  return ''
}
