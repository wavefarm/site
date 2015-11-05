var api = require('../../api')
var util = require('../../lib/util')

module.exports = function (req, res, id) {
  api.get(id, function (err, item) {
    if (err) {
      if (err.message === '[API] Not Found') return res.error(404, err)
      return res.error(500, err)
    }

    if (['artist', 'audio', 'image', 'text', 'video'].indexOf(item.type) === -1) {
      return res.error(404, {message: 'Not Found'})
    }

    item.dateFormatted = util.formatArchiveDate(item)
    console.log(item)

    res.render({title: item.main, item: item}, {
      head: 'head.html',
      listen: 'listen.html',
      main: 'archive/' + item.type + '.html'
    })
  })
}
