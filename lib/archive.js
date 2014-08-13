var api = require('../api')
var create = require('virtual-dom/create-element')
var del = require('dom-delegator')()
var h = require('virtual-dom/h')
var main = require('main-loop')
var qs = require('querystring')
var render = require('../render')
var virtualize = require('vdom-virtualize')


function getParams () {
  return qs.parse(window.location.search.substr(1))
}

function getResults (params, cb) {
  api.search(params, function (err, results) {
    if (err) return console.error(err)
    cb(results)
  })
}

var initialState = window.initialState
var state = window.state
//console.log(state)

// TODO move to main browser file when all pages rendered virtually
var target = document.body.firstChild
var loop = main(state(), render, {
  initialTree: virtualize(target),
  target: target
})
state(loop.update)
state.title(function (c) {document.title = c})

module.exports = function () {
  // Bail if we're not loading the archive section
  if (!(initialState && initialState.section == 'archive')) return

  // Initialize on page load
  state.section.set('archive')
  if (initialState.archive && initialState.archive.item) {
    state.archive.item.set(initialState.archive.item)
  } else {
    var params = getParams()
    if (params.q) {
      state.archive.q.set(params.q)
      state.title.set('Search for ' + params.q)
    }
  
    getResults(params, function (results) {
      state.archive.results.set(results)
      history.replaceState(state())
    })
  }

  // TODO Move these to render
  del.addGlobalEventListener('submit', function (ev) {
    if (ev.target.id == 'archive-search') {
      var qVal = ev.target.firstChild.value
      ev.preventDefault()
      if (qVal != state.archive.q()) {
        state.archive.q.set(qVal)
        state.archive.results.set({hits: [], total: '...'})
        state.title.set('Search for ' + qVal)
        var params = {q: qVal}
        getResults(params, function (results) {
          state.archive.item.set(null)
          state.archive.results.set(results)
          history.pushState(state(), '', '/archive?' + qs.stringify(params))
        })
      }
    }
  })

  del.addGlobalEventListener('click', function (ev) {
    if (ev.target.className == 'more') {
      var params = {
        q: state.archive.q(),
        size: state.archive.results().hits.length + 10
      }
      getResults(params, function (results) {
        state.archive.results.set(results)
        history.pushState(state(), '', '?' + qs.stringify(params))
      })
    }
  })

  del.addGlobalEventListener('click', function (ev) {
    var el = ev.target
    // Ugh. Grabbed from page.js. Works but ugly. Put it in the render?
    while (el && el.className != 'item-link') el = el.parentNode
    if (!el || el.className != 'item-link') return
    ev.preventDefault()
    api.get(el.id, function (err, item) {
      if (err) return console.error(err)
      state.archive.q.set(null)
      state.archive.results.set(null)
      state.archive.item.set(item)
      state.title.set(item.main)
      history.pushState(state(), '', '/archive/' + item.id)
    })
  })

  window.onpopstate = function (ev) {
    state.archive.q.set(getParams().q || '')
    state.archive.item.set(ev.state.archive.item)
    state.archive.results.set(ev.state.archive.results)
    state.title.set(ev.state.title)
  }
}
