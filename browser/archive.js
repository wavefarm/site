var api = require('../api')
var create = require('virtual-dom/create-element')
var del = require('dom-delegator')()
var h = require('virtual-dom/h')
var mainLoop = require('main-loop')
var qs = require('querystring')
var o = require('observ')
var render = require('../render/archive/page')
var struct = require('observ-struct')


function getParams () {
  return qs.parse(window.location.search.substr(1))
}

function getResults (params, cb) {
  api.search(params, function (err, results) {
    if (err) return console.error(err)
    cb(results)
  })
}

module.exports = function () {
  // Bail if we're not loading the archive page
  if (window.location.pathname.indexOf('/archive') != 0) return

  // Initialize from window.location on page load
  var params = getParams()
  var state = struct({
    q: o(params.q || ''),
    results: o()
  })
  var loop = mainLoop(state(), render)
  var elem = document.querySelector('.archive.page')
  elem.parentNode.replaceChild(loop.target, elem)

  getResults(params, function (results) {
    state.results.set(results)
    history.replaceState(results)
  })

  state.q(function (curr) {
  })

  state.results(function (curr) {
    loop.update(state())
  })

  // Set state on form submit
  var q2 = document.getElementById('q2')
  del.addEventListener(q2.parentNode, 'submit', function (ev) {
    var qVal = q2.value
    ev.preventDefault()
    if (qVal != state.q()) {
      state.q.set(qVal)
      var params = {q: qVal}
      getResults(params, function (results) {
        state.results.set(results)
        history.pushState(results, '', '?' + qs.stringify(params))
      })
    }
  })

  // Global because these elements don't exist on page load
  del.addGlobalEventListener('click', function (ev) {
    if (ev.target.className == 'more') {
      var params = {q: state.q(), size: state.results().hits.length + 10}
      getResults(params, function (results) {
        state.results.set(results)
        history.pushState(results, '', '?' + qs.stringify(params))
      })
    }
  })

  window.onpopstate = function (ev) {
    state.q.set(getParams().q || '')
    state.results.set(ev.state)
  }

  return state
}
