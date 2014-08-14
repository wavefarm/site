var api = require('../api')
var qs = require('querystring')
var ve = require('value-event/value')


module.exports = ve(function (formData) {
  var q = formData.q
  var state = window.state
  if (q != state.archive.q()) {
    state.archive.q.set(q)
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
