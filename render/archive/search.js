var h = require('virtual-hyperscript')
var moreResults = require('../../events/more-results')
var renderLink = require('./link')
var searchSubmit = require('../../events/search-submit')
var paramClick = require('../../events/param-click')


function typeSearchLinks (data) {
  if (data && data.schemas) {
    return Object.keys(data.schemas).map(function (type) {
      return h('a', {href: '/archive?q=type:' + type, 'ev-click': paramClick}, type)
    })
  }
}

function composeSummary (params, total) {
  var sum = []
  if (params.q || params.date) sum.push('A search')
  if (params.q) {
    sum.push(' for ')
    sum.push(h('b', params.q))
  }
  if (params.date && params.date2) {
    sum.push(' between ')
    sum.push(h('b', params.date))
    sum.push(' and ')
    sum.push(h('b', params.date2))
  } else if (params.date) {
    sum.push(' on ')
    sum.push(h('b', params.date))
  }
  if (params.q || params.date) sum.push(' returned ')
  sum.push(h('b', ''+total))
  sum.push(' items.')
  return sum
}

module.exports = function (data) {
  var results = data && data.archive && data.archive.results
  var hitLength = (results && results.hits && results.hits.length) || 0
  var params = data && data.archive && data.archive.params || {}
  var total = results && results.total || 0
  return h('.search', [
    h('.content', [
      h('p', "Search Wave Farm's entire organizational history as well as current programs."),
      h('p', "Search Hints: Filter by a specific program by including sites:transmissionarts or sites:wgxc in your search. Filter for audio files by including type:audio in your search. You can also filter by artist, work, show, broadcast, video, image, event...")
    ]),
    //h('h2', 'Item Types'),
    //h('.types', typeSearchLinks(data)),
    //h('h2', 'Sites'),
    //h('.sites', [
    //  h('a', {href: '/archive?q=sites:transmissionarts', 'ev-click': paramClick}, 'Transmission Arts'),
    //  h('a', {href: '/archive?q=sites:wgxc', 'ev-click': paramClick}, 'WGXC')
    //]),
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
      h('.summary', composeSummary(params, total)),
    ]),
    hitLength ? h('.results', results.hits.map(renderLink)) : '',
    (hitLength && hitLength < total) ?
      h('.more', {'ev-click': moreResults}, 'More') : '',
  ])
}
