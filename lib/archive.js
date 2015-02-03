var api = require('../api')
var del = require('dom-delegator')()
var h = require('virtual-dom/h')
var main = require('main-loop')
var qs = require('querystring')
var render = require('../render')
var virtualize = require('vdom-virtualize')


function getParams () {
  return qs.parse(window.location.search.substr(1))
}

var initialState = window.initialState
var state = window.state
//console.log(state)

module.exports = function () {
  // Bail if we're not loading the archive section
  if (!(initialState && initialState.section == 'archive')) return

  // TODO move to main browser file when all pages rendered virtually
  var target = document.body.firstChild
  var loop = main(state(), render, {
    initialTree: virtualize(target),
    target: target
  })
  state(loop.update)
  state.title(function (c) {document.title = c})

  // Initialize on page load
  state.section.set('archive')
  if (initialState.archive && initialState.archive.item) {
    state.archive.item.set(initialState.archive.item)
  } else {
    var params = getParams()
    if (params) {
      state.archive.params.set(params)
      state.title.set('Search' + (params.q ? ' for ' + params.q : ''))
    }
  
    api.search(params, function (err, results) {
      if (err) return console.error(err)
      state.archive.results.set(results)
      history.replaceState(state(), 'results')
    })
  }

  window.onpopstate = function (ev) {
    state.archive.params.set(getParams() || {})
    state.archive.item.set(ev.state.archive.item)
    state.archive.results.set(ev.state.archive.results)
    state.title.set(ev.state.title)
    window.scroll(ev.state.scrollX, ev.state.scrollY)
  }
}
