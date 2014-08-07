var escape = require('escape-html')
var h = require('virtual-hyperscript')
var renderItem = require('./item')
var renderLink = require('./item/link')


module.exports = function (state) {
  //console.log(state)
  var hitLength = (state.results && state.results.hits &&
    state.results.hits.length) || 0
  var total = (state.results && state.results.total) || 0
  return h('.main', [
    h('.archive.page', [
      h('h1', 'ARCHIVE'),
      h('form#archive-search', [
        h('input#q2', {type: 'search', name: 'q', value: state.q}),
        h('input', {type: 'submit'})
      ]),
      h('.summary', state.results ? (state.q ? [
        'A search for ',
        h('b', escape(state.q)),
        ' returned ',
        h('b', ''+total),
        ' items.'
      ] : [
        h('b', ''+total),
        ' total items.'
      ]) : ''),
      hitLength ? h('.results', state.results.hits.map(renderLink)) : '',
      (hitLength && hitLength < total) ? h('.more', 'More') : '',
      renderItem(state.item)
    ])
  ])
}
