var h = require('virtual-hyperscript')
var moreResults = require('../../events/more-results')
var renderLink = require('./link')
var searchSubmit = require('../../events/search-submit')


module.exports = function (results) {
  var hitLength = (results && results.hits && results.hits.length) || 0
  var q = results && results.q || ''
  var total = results && results.total || 0
  return h('.results', [
    h('.content', "This Archive provides access to Wave Farm (aka free103point9)'s organizational history and current programs (1997 to the present). Search results include ephemera from the microradio movement in the mid-nineties, live event recordings from free103point9's Project Space (2000 - 2005), transmission art works produced by resident and collaborating artists, and Wave Farm's creative community radio station WGXC 90.7-FM. Enter a search term below to search the master archive."),
    h('form#archive-search', {
      action: '/archive',
      'ev-submit': searchSubmit
    }, [
      h('input#q2', {type: 'search', name: 'q', value: q}),
      h('input', {type: 'submit'})
    ]),
    h('.summary', results ? (q ? [
      'A search for ',
      h('b', q),
      ' returned ',
      h('b', ''+total),
      ' items.'
    ] : [
      h('b', ''+total),
      ' total items.'
    ]) : ''),
    hitLength ? h('.results', results.hits.map(renderLink)) : '',
    (hitLength && hitLength < total) ?
      h('.more', {'ev-click': moreResults}, 'More') : '',
  ])
}
