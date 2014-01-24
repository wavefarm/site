//var api = require('./api')
var etagres = require('./etagres');
var http = require('http');
var st = require('st');
var templates = require('./templates');
var trumpet = require('trumpet');
var url = require('url');

// Timestamp logs
require('logstamp')();

var dev = (process.env.NODE_ENV === 'dev');
var port = process.env.PORT || 1041;

var staticOpts = {path: __dirname + '/static', url: '/static'};
if (dev) staticOpts.cache = false;
var serveStatic = st(staticOpts);

function redirect (res, to) {
  console.warn('Warning: Moved Permanently');
  res.statusCode = 301;
  res.setHeader('location', to);
  res.end('Moved Permanently');
}

function notFound (res) {
  console.warn('Warning: Not Found');
  res.statusCode = 404;
  return res.end('Not Found');
}

var subRe = RegExp('/(ta|wgxc|mag)')

http.createServer(function (req, res) {
  var head, layout, main, nav, p, sub, tres;

  console.log(req.method, req.url);

  // Need to parse URL before calling serveStatic
  // https://github.com/isaacs/st/issues/30
  req.parsedUrl = url.parse(req.url);

  // Short circuit to serve static files
  if (serveStatic(req, res)) return;

  req.parsedUrl = url.parse(req.url);
  p = req.parsedUrl.pathname;

  // No part of these paths should have an extension
  if (p.indexOf('.') !== -1) {
    return notFound(res);
  }

  // Redirect to slashless if we aren't at the root
  if (p != '/' && p.charAt(p.length - 1) == '/') return redirect(res, p.slice(0, -1));

  // Local proxy for api.wavefarm.org
  if (p.indexOf('/api') == 0) return require('./api')(req, res);

  // Local proxy for org tweets
  if (p === '/tweets') return require('./tweets')(req, res);

  // Set head and nav sections
  sub = subRe.exec(p)
  if (sub) {
    head = templates('/'+sub[1]+'/head.html')
    nav = templates('/'+sub[1]+'/nav.html')
  } else {
    head = templates('/head.html');
  }

  main = templates(p+'.html') || templates(p+'/index.html');
  if (!main) return notFound(res);

  tres = etagres(req, res);
  res.setHeader('Content-Type', 'text/html');

  // Streams and streams
  layout = trumpet();
  layout.pipe(tres);
  templates('/layout.html').pipe(layout);
  main.pipe(layout.createWriteStream('.main'));
  head.pipe(layout.createWriteStream('.head'));
  if (nav) nav.pipe(layout.createWriteStream('.nav'));
  if (dev) templates('/sse.js').pipe(layout.createWriteStream('#sse'));
}).listen(port, function () {
  console.log('Listening on port', port);
  if (process.send) process.send('online')
});
