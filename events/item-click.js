var api = require('../api')
var ev = require('value-event/event')


module.exports = function (id) {
  return ev(function (data) {
    api.get(data.id, function (err, item) {
      if (err) return console.error(err)
      state.archive.q.set(null)
      state.archive.results.set(null)
      state.archive.item.set(item)
      state.title.set(item.main)
      history.pushState(state(), '', '/archive/' + item.id)
    })
  }, {id: id})
}
