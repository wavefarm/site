var hs = require('hyperstream')
var http = require('http')
var st = require('st')
var templates = require('./templates')
var url = require('url')

// Timestamp logs
require('logstamp')(function () {
  return new Date().toISOString() + ' [wavefarm.org] ';
});

var dev = (process.env.NODE_ENV === 'dev');
var port = process.env.PORT || 1041;

var staticOpts = {path: __dirname + '/static', url: '/static'};
if (dev) staticOpts.cache = false;
var serveStatic = st(staticOpts);

var decorate = function (res) {
  res.redirect = function (to) {
    console.warn('Warning: Moved Permanently');
    res.statusCode = 301;
    res.setHeader('location', to);
    res.end('Moved Permanently');
  }

  res.notFound = function () {
    console.warn('Warning: Not Found');
    res.statusCode = 404;
    return res.end('Not Found');
  }

  res.error = function () {
    res.statusCode = 500;
    return res.end('Server Error');
  }
}

var subRe = RegExp('/(ta|wgxc|mag)')

http.createServer(function (req, res) {
  var head, layout, main, nav, p, sub

  console.log(req.method, req.url);

  // Short circuit to serve static files
  if (serveStatic(req, res)) return;

  req.parsedUrl = url.parse(req.url);
  p = req.parsedUrl.pathname;

  decorate(res)

  // No part of these paths should have an extension
  if (p.indexOf('.') !== -1) {
    return res.notFound();
  }

  // Redirect to slashless if we aren't at the root
  if (p != '/' && p.charAt(p.length - 1) == '/') return res.redirect(p.slice(0, -1));

  // Local proxy for api.wavefarm.org
  if (p.indexOf('/api') == 0) return require('./routes/api')(req, res);

  // Local proxy for org tweets
  if (p == '/tweets') return require('./routes/tweets')(req, res);

  // Archive items
  if (/\/archive\/\w{6}/.test(p)) return require('./routes/item')(req, res);

  // Set head and nav sections
  sub = subRe.exec(p)
  if (sub) {
    head = templates('/'+sub[1]+'/head.html')
    nav = templates('/'+sub[1]+'/nav.html')
  } else {
    head = templates('/head.html');
  }

  main = templates(p+'.html') || templates(p+'/index.html');
  if (!main) return res.notFound();

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
