var h = require('virtual-hyperscript')
var renderLink = require('./link')


module.exports = function (item) {
  return h('.item#'+item.id, {'data-item': JSON.stringify(item)},
    renderLink(item)
  )
}
