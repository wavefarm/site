var api = require ('../api')


var state = window.state

module.exports = function () {
  api.schemas(function (err, schemas) {
    if (err) return console.error(err)
    state.schemas.set(schemas)
  })
}
