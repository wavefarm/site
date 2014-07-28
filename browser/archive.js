var api = require('../api')
var create = require('virtual-dom/create-element')
var h = require('virtual-dom/h')
var mainLoop = require('main-loop')
var qs = require('querystring')
var o = require('observ')
var render = require('../render/archive/page')
var struct = require('observ-struct')


function getLocQ () {
  return qs.parse(window.location.search.substr(1)).q || ''
}

module.exports = function () {
  // Bail if we're not in the archive section
  if (window.location.pathname.indexOf('/archive') != 0) return

  // Initialize from window.location on page load
  var state = struct({
    q: o(getLocQ()),
    results: o()
  })
  var loop = mainLoop(state(), render)
  var elem = document.querySelector('.archive.page')
  elem.parentNode.replaceChild(loop.target, elem)

  function getResults (qStr, cb) {
    api.search(qStr, function (err, results) {
      if (err) return console.error(err)
      cb(results)
    })
  }

  getResults(state.q(), function (results) {
    history.replaceState(results)
    state.results.set(results)
  })

  state.q(function (curr) {
  })

  state.results(function (curr) {
    loop.update(state())
  })

  // Set state on form submit
  document.getElementById('archive-search').addEventListener('submit', function (ev) {
    var qVal = document.getElementById('q2').value
    ev.preventDefault()
    if (qVal != state.q()) {
      state.q.set(qVal)
      getResults(qVal, function (results) {
        history.pushState(results, '', '?q=' + encodeURIComponent(qVal))
        state.results.set(results)
      })
    }
  })

  window.onpopstate = function (ev) {
    state.q.set(getLocQ())
    state.results.set(ev.state)
  }

  return state
}
