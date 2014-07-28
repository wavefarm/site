var escape = require('escape-html')
var h = require('virtual-hyperscript')
var renderItem = require('./item/wrap')


module.exports = function (state) {
  return h('.archive.page', [
    h('h1', 'ARCHIVE'),
    h('form#archive-search', [
      h('input#q2', {type: 'search', name: 'q', value: state.q}),
      h('input', {type: 'submit'})
    ]),
    h('.summary', state.results ? (state.q ? [
      'A search for ',
      h('b', escape(state.q)),
      ' returned ',
      h('b', ''+state.results.total),
      ' items.'
    ] : [
      h('b', ''+state.results.total),
      ' total items.'
    ]) : ''),
    state.results && state.results.hits && state.results.hits.length ?
      h('.results', state.results.hits.map(renderItem)) :
      ''
  ])
}
