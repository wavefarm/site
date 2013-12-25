//var api = require('./api')
var etagres = require('./etagres');
var http = require('http');
var st = require('st');
var templates = require('./templates');
var trumpet = require('trumpet');
var url = require('url');

// Timestamp logs
require('logstamp')(console);

var port = process.argv[2] || process.env.PORT || 1041;

var serveStatic = st({path: __dirname + '/static', url: '/static'});

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

var subRe = RegExp('(/.+/).*')

http.createServer(function (req, res) {
  var head, layout, main, nav, pn, sub, tres;

  console.log(req.method, req.url);

  // Short circuit to serve static files
  if (serveStatic(req, res)) return;

  req.parsedUrl = url.parse(req.url);
  pn = req.parsedUrl.pathname;

  // No part of these paths should have an extension
  if (pn.indexOf('.') !== -1) {
    return notFound(res);
  }

  // Local proxy for org tweets
  if (pn === '/tweets') return require('./tweets')(req, res);

  // Set head and nav sections
  sub = subRe.exec(pn)
  if (sub) {
    head = templates(sub[1]+'head.html')
    nav = templates(sub[1]+'nav.html')
  } else {
    head = templates('/head.html');
  }

  // If path ends in a slash look for template at index.html
  if (pn.charAt(pn.length - 1) == '/') {
    main = templates(pn+'index.html');
  } else {
    main = templates(pn+'.html');
  }
  if (!main) {
    // Try a redirect with a slash if path doesn't end in one
    if (pn.charAt(pn.length - 1) != '/') return redirect(res, pn+'/');
    // Else 404
    return notFound(res);
  }

  tres = etagres(req, res);
  res.setHeader('Content-Type', 'text/html');

  // Streams and streams
  layout = trumpet();
  layout.pipe(tres);
  templates('/layout.html').pipe(layout);
  main.pipe(layout.createWriteStream('.main'));
  head.pipe(layout.createWriteStream('.head'));
  if (nav) {
    nav.pipe(layout.createWriteStream('.nav'));
  }
}).listen(port, function () {
  console.log('Listening on port', port);
});
