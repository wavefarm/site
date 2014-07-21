var helpres = require('./helpres');
var hs = require('hyperstream')
var http = require('http')
var st = require('st')
var templates = require('./templates')
var url = require('url')


var env = process.env.ENV;
var port = process.env.PORT || 1041;

var mount = st({path: __dirname + '/static'});

var subRe = RegExp('/(ta|wgxc|mag)')

http.createServer(function (req, res) {
  var head, layout, main, nav, p, sub

  console.log(req.method, req.url);

  req.parsedUrl = url.parse(req.url);
  p = req.parsedUrl.pathname;

  helpres(res);

  if (p == '/robots.txt') {
    res.statusCode = 200;
    if (env == 'prod') {
      return res.end('User-agent: *\nDisallow:\n');
    } else {
      return res.end('User-agent: *\nDisallow: /\n');
    }
  }

  // Redirect to slashless if we aren't at the root
  if (p != '/' && p.charAt(p.length - 1) == '/') return res.redirect(p.slice(0, -1));

  // Local proxy for api.wavefarm.org
  if (p.indexOf('/api') == 0) return require('./routes/api')(req, res);

  // Local proxy for org tweets
  if (p == '/tweets') return require('./routes/tweets')(req, res);

  // Archive items
  if (/^\/archive\/\w{6}$/.test(p)) return require('./routes/item')(req, res);

  // WGXC broadcasts and shows
  if (/^\/wgxc\/schedule\/\w{6}$/.test(p)) return require('./routes/wgxc/item')(req, res);

  // Set head and nav sections
  sub = subRe.exec(p)
  if (sub) {
    head = templates('/'+sub[1]+'/head.html')
    nav = templates('/'+sub[1]+'/nav.html')
  } else {
    head = templates('/head.html');
  }

  main = templates(p+'.html') || templates(p+'/index.html');

  // No template found so check static
  if (!main) return mount(req, res);

  res.setHeader('Content-Type', 'text/html');

  // Streams and streams
  templates('/layout.html').pipe(hs({
    '.head': head,
    '.nav': nav,
    '.main': main
  })).pipe(res)
}).listen(port, function () {
  console.log('Listening on port', port);
  if (process.send) process.send('online')
});
