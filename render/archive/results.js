var h = require('virtual-hyperscript')
var moreResults = require('../../events/more-results')
var renderLink = require('./link')
var searchSubmit = require('../../events/search-submit')


module.exports = function (results) {
  var hitLength = (results && results.hits && results.hits.length) || 0
  var params = results && results.params || {}
  var total = results && results.total || 0
  return h('.search', [
    h('.content', "This Archive provides access to Wave Farm (aka free103point9)'s organizational history and current programs (1997 to the present). Search results include ephemera from the microradio movement in the mid-nineties, live event recordings from free103point9's Project Space (2000 - 2005), transmission art works produced by resident and collaborating artists, and Wave Farm's creative community radio station WGXC 90.7-FM. Enter a search term below to search the master archive."),
    h('h2', 'Search'),
    h('form#archive-search', {
      action: '/archive',
      'ev-submit': searchSubmit
    }, [
      h('div', [
        h('input#q2', {type: 'search', name: 'q', value: params.q, placeholder: 'ENTER ARTIST, PROGRAM, ETC.'})
      ]),
      h('.date-filter', [
        h('.filter-text', 'filter by date'),
        h('input#date', {type: 'text', name: 'date', value: params.date, placeholder: 'YYYY-MM-DD'})
      ]),
      h('.date2-filter', [
        h('.filter-text', 'or date range'),
        h('input#date2', {type: 'text', name: 'date2', value: params.date2, placeholder: 'YYYY-MM-DD'})
      ]),
      h('div', [
        h('input.action', {type: 'submit', value: 'GO'})
      ])
    ]),
    h('.results-head', [
      h('h2', 'Results'),
      h('.summary', params.q ? [
        'A search for ',
        h('b', params.q),
        ' returned ',
        h('b', ''+total),
        ' items.'
      ] : [
        h('b', ''+total),
        ' total items.'
      ])
    ]),
    hitLength ? h('.results', results.hits.map(renderLink)) : '',
    (hitLength && hitLength < total) ?
      h('.more', {'ev-click': moreResults}, 'More') : '',
  ])
}
