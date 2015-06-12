var helpres = require('./helpres')
var hs = require('hyperstream')
var http = require('http')
var st = require('st')
var templates = require('./templates')
var url = require('url')

var env = process.env.NODE_ENV
var port = process.env.PORT || 1041

var mount = st({path: __dirname + '/static'})

var subRe = new RegExp('/(ta|wgxc|mag)')

http.createServer(function (req, res) {
  var head, idMatch, main, nav, p, sub

  console.log(req.method, req.url)

  req.parsedUrl = url.parse(req.url, true)
  p = req.parsedUrl.pathname

  helpres(res)

  if (p === '/robots.txt' && env !== 'prod') {
    res.statusCode = 200
    return res.end('User-agent: *\nDisallow: /\n')
  }

  // Redirect to slashless if we aren't at the root
  if (p !== '/' && p.charAt(p.length - 1) === '/') return res.redirect(p.slice(0, -1))

  // Local proxy for api.wavefarm.org
  if (p.indexOf('/api') === 0) return require('./routes/api')(req, res)

  // Local proxy for org tweets
  if (p === '/tweets') return require('./routes/tweets')(req, res)

  // Local proxy for WGXC tweets
  if (p === '/wgxc/tweets') return require('./routes/wgxc/tweets')(req, res)

  // Archive
  if (p === '/archive') return require('./routes/archive')(req, res)

  // Archive items
  idMatch = /^\/archive\/(\w{6})$/.exec(p)
  if (idMatch) return require('./routes/archive/item')(req, res, idMatch[1])

  // WGXC/TA broadcasts and shows
  if (/^(\/\w+)?\/schedule\/\w{6}$/.test(p)) return require('./routes/item')(req, res)

  // WGXC/TA event
  if (/^(\/\w+)?\/calendar\/\w{6}$/.test(p)) return require('./routes/event')(req, res)

  // Main/WGXC/TA Calendar pages
  if (/^(\/\w+)?\/calendar/.test(p)) return require('./routes/calendar')(req, res)
  if (/^(\/\w+)?\/calendar\/\d{4}-\d{2}-\d{2}$/.test(p)) return require('./routes/calendar')(req, res)

  // WGXC/TA Schedule pages
  if (/^(\/\w+)\/schedule$/.test(p)) return require('./routes/schedule')(req, res)
  if (/^(\/\w+)\/schedule\/\d{4}-\d{2}-\d{2}$/.test(p)) return require('./routes/schedule')(req, res)

  // TA Artists and Works pages
  if (/^\/ta\/artists$/.test(p)) return require('./routes/ta/artist-index')(req, res)
  if (/^\/ta\/artists\/\w{1}$/.test(p)) return require('./routes/ta/artist-index')(req, res)
  if (/^\/ta\/artists\/\w{6}$/.test(p)) return require('./routes/ta/artist')(req, res)
  if (/^\/ta\/works$/.test(p)) return require('./routes/ta/work-index')(req, res)
  if (/^\/ta\/works\/\w{1}$/.test(p)) return require('./routes/ta/work-index')(req, res)
  if (/^\/ta\/works\/\w{6}$/.test(p)) return require('./routes/ta/work')(req, res)

  // Listen Live Popup Window
  if (/^\/listen\/\w{4}$/.test(p)) return require('./routes/listen')(req, res)

  // Set head and nav sections
  sub = subRe.exec(p)
  if (sub) {
    head = templates('/' + sub[1] + '/head.html')
    nav = templates('/' + sub[1] + '/nav.html')
  } else {
    head = templates('/head.html')
    nav = ''
  }

  main = templates(p + '.html') || templates(p + '/index.html')

  // No template found so check static on dev, otherwise 404
  if (!main) {
    if (env !== 'prod') return mount(req, res)
    else return res.error(404, new Error('Not Found'))
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  // Streams and streams
  templates('/layout.html').pipe(hs({
    '.head': head,
    '.nav': nav,
    '.main': main,
    '.listen': templates('/listen.html'),
    '.announce': templates('/announce.html')
  })).pipe(res)
}).listen(port, function () {
  console.log('Listening on port', port)
  if (process.send) process.send('online')
})
