var h = require('virtual-hyperscript')
var renderItem = require('./item')
var renderLink = require('./link')


module.exports = function (state) {
  var archive = state.archive || {}
  var hitLength = (archive.results && archive.results.hits &&
    archive.results.hits.length) || 0
  var total = (archive.results && archive.results.total) || 0
  return h('.main', [
    h('.archive.page', [
      h('h1', 'ARCHIVE'),
      h('form#archive-search', {action: '/archive'}, [
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
