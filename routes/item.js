var hyperstream = require('hyperstream')
, t = require('../templates')

module.exports = function (req, res) {
  t('/layout.html').pipe(hyperstream(
  { '.head': t('/head.html')
  , '.main': t('/item.html').pipe(hyperstream(
    { '.item-title': 'Item title'
    }))
  })).pipe(res)
}
