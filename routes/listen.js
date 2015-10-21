var mustache = require('mustache')

module.exports = function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(mustache.render(res.t['listen-popout.html'], {
    title: 'Wave Farm'
  }, {
    main: res.t['listen.html']
  }))
}
