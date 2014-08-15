var api = require('../api')
var qs = require('querystring')


module.exports = function () {
  var state = window.state
  var params = {
    q: state.archive.q(),
    size: state.archive.results().hits.length + 10
  }
  api.search(params, function (err, results) {
    if (err) return console.error(err)
    state.archive.results.set(results)
    history.replaceState(state(), '', '?' + qs.stringify(params))
  })
}
