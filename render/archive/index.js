var api = require('../../api')
var h = require('virtual-hyperscript')
var qs = require('querystring')
var renderItem = require('./item')
var renderLink = require('./link')
var ve = require('value-event/value')


module.exports = function (data) {
  var archive = data.archive || {}
  var hitLength = (archive.results && archive.results.hits &&
    archive.results.hits.length) || 0
  var total = (archive.results && archive.results.total) || 0
  return h('.main', [
    h('.archive.page', [
      h('h1', 'ARCHIVE'),
      h('form#archive-search', {
        action: '/archive',
        'ev-submit': ve(function (formData) {
          var q = formData.q
          var state = window.state
          if (q != state.archive.q()) {
            state.archive.q.set(q)
            state.archive.results.set({hits: [], total: '...'})
            state.title.set('Search for ' + q)
            var params = {q: q}
            api.search(params, function (err, results) {
              if (err) return console.error(err)
              state.archive.item.set(null)
              state.archive.results.set(results)
              history.pushState(window.state(), '', '/archive?' + qs.stringify(params))
            })
          }
        })
      }, [
        h('input#q2', {type: 'search', name: 'q', value: archive.q}),
        h('input', {type: 'submit'})
      ]),
      h('.summary', archive.results ? (archive.q ? [
        'A search for ',
        h('b', archive.q),
        ' returned ',
        h('b', ''+total),
        ' items.'
      ] : [
        h('b', ''+total),
        ' total items.'
      ]) : ''),
      hitLength ? h('.results', archive.results.hits.map(renderLink)) : '',
      (hitLength && hitLength < total) ? h('.more', 'More') : '',
      renderItem(archive.item)
    ])
  ])
}
