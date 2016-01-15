var api = require('../api')

module.exports = function (req, res) {
  res.render({title: 'Wave Farm Archive'}, {
    head: 'head.html',
    listen: 'listen.html',
    main: 'archive.html',
    scripts: 'archive-scripts.html'
  })
}
