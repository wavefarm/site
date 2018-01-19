var helpres = require('./helpres')
var http = require('http')
var st = require('st')
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
  if (p === '/tweets') return require('./routes/tweets')()(req, res)

  // Local proxy for WGXC tweets
  if (p === '/wgxc/tweets') return require('./routes/tweets')({wgxc: true})(req, res)

  // Archive
  if (p === '/archive') return require('./routes/archive')(req, res)

  // Archive items
  idMatch = /^\/archive\/(\w{6})$/.exec(p)
  if (idMatch) return require('./routes/archive/item')(req, res, idMatch[1])

  // WGXC/TA broadcasts and shows
  if (/^(\/\w+)\/schedule\/\w{6}$/.test(p)) return require('./routes/item')(req, res)
  if (/^(\/\w+)\/schedule\/\w{6}\/rss$/.test(p)) return require('./routes/rss/podcast')(req, res)

  
  // WGXC/TA event
  if (/^(\/\w+)?\/calendar\/\w{6}$/.test(p)) return require('./routes/event')(req, res)

  // Main/WGXC/TA Calendar pages
  if (/^(\/\w+)?\/calendar/.test(p)) return require('./routes/calendar')(req, res)
  if (/^(\/\w+)?\/calendar\/\d{4}-\d{2}-\d{2}$/.test(p)) return require('./routes/calendar')(req, res)
  
  // Main/WGXC/TA news item
  if (/^(\/\w+)?\/newsroom\/\w{6}$/.test(p)) return require('./routes/news')(req, res)

  // Main/WGXC/TA news pages
  if (/^(\/\w+)?\/newsroom$/.test(p)) return require('./routes/news-calendar')(req, res)
  if (/^(\/\w+)?\/newsroom\/\d{4}-\d{2}-\d{2}$/.test(p)) return require('./routes/news-calendar')(req, res)
  if (/^(\/\w+)?\/newsroom\/rss/.test(p)) return require('./routes/rss/newsroom')(req, res)
  
  // WGXC/TA Schedule pages
  if (/^(\/\w+)\/schedule$/.test(p)) return require('./routes/schedule')(req, res)
  if (/^(\/\w+)\/schedule\/\d{4}-\d{2}-\d{2}$/.test(p)) return require('./routes/schedule')(req, res)
  if (/^(\/\w+)\/schedule-grid$/.test(p)) return require('./routes/schedule-grid')(req, res)

  // TA Artists and Works pages
  if (/^\/ta\/artists$/.test(p)) return require('./routes/ta/artist-index')(req, res)
  if (/^\/ta\/artists\/\w{1}$/.test(p)) return require('./routes/ta/artist-index')(req, res)
  if (/^\/ta\/artists\/\w{6}$/.test(p)) return require('./routes/ta/artist')(req, res)
  if (/^\/ta\/works$/.test(p)) return require('./routes/ta/work-index')(req, res)
  if (/^\/ta\/works\/\w{1}$/.test(p)) return require('./routes/ta/work-index')(req, res)
  if (/^\/ta\/works\/\w{6}$/.test(p)) return require('./routes/ta/work')(req, res)

  // Listen Live Popup Window
  if (/^\/listen\/\w{4}$/.test(p)) return require('./routes/listen')(req, res)
  if (p === '/listen') return require('./routes/listen')(req, res)

  // partner streams status proxy
  if (p === '/partneraudio/status') return require('./routes/partneraudio-status')(req, res)

  // Set head and nav sections
  sub = subRe.exec(p)
  if (sub) {
    head = sub[1] + '/head.html'
    nav = sub[1] + '/nav.html'
  } else {
    head = 'head.html'
    nav = ''
  }

  var tmpl = p.substr(1)
  //if (p === '/') main = 'index.html'
  //else if (fs.existsSync(tmpl + '.html') main = tmpl + '.html'
  //else if (fs.existsSync(tmpl + '/index.html') main = tmpl + '/index.html'

  var tFile = tmpl + '.html'
  var tIndex = tmpl + '/index.html'
  main = (p === '/' && 'index.html') ||
    (res.t[tFile] && tFile) ||
    (res.t[tIndex] && tIndex)

  // No template found so check static on dev, otherwise 404
  if (!main) {
    if (env !== 'prod') return mount(req, res)
    else return res.error(404, new Error('Not Found'))
  }

  var title = 'Wave Farm'
  if (main) {
	  var page = main.replace('.html','')
	  if (sub) {
	  	if (sub[1] == 'ta')
	  		title =  'Transmission Arts'
	  	else if (sub[1] == 'mag')
	  	  title =  'Media Arts Grants'
	  	else
	  		title = 'WGXC'
	  	page = page.replace(sub[1],'')
	  	page = page.replace('/','')
	  }
	  if (page) {	  		
		  if (page == 'index') page = 'home'
	  	title = title + ' ' + page.charAt(0).toUpperCase() + page.slice(1)
	  }
  }
  
  res.render({title: title}, {
    head: head,
    nav: nav,
    main: main,
    announce: 'announce.html'
  })
}).listen(port, function () {
  console.log('Listening on port', port)
  if (process.send) process.send('online')
})
