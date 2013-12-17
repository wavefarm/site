//var api = require('./api')
//var crypto = require('crypto');
var http = require('http');
//var hyperglue = require('hyperglue');
var st = require('st');
var templates = require('./templates');
//var through = require('through');
var trumpet = require('trumpet');
var url = require('url');

// Timestamp logs
require('logstamp')(console);

var port = process.argv[2] || process.env.PORT || 1041;

var serveStatic = st({path: __dirname + '/static', url: '/static'});

//function shaetag (req, res) {
//  var h = crypto.createHash("sha1")
//  var resBuf = through();
//  var tee = through();
//  resBuf.pipe(res);
//  resBuf.pause();
//  tee.pipe(h);
//  tee.pipe(resBuf);
//  tee.on('end', function () {
//    var etag = '"' + h.digest('base64') + '"'
//    if (req.headers['if-none-match'] === etag) {
//      res.statusCode = 304;
//      res.end();
//    } else {
//      res.statusCode = 200;
//      res.setHeader('ETag', etag);
//      resBuf.resume();
//    }
//  });
//  return tee;
//}

//function shatag (req, res, next) {
//  res.shatag = function (data) {
//    var h = crypto.createHash("sha1")
//    h.update(data)
//    var etag = '"' + h.digest('base64') + '"'
//    if (req.headers['if-none-match'] === etag) {
//      res.statusCode = 304;
//      return res.end();
//    }
//    res.statusCode = 200;
//    res.setHeader('ETag', etag);
//    res.end(data);
//  };
//  if (next) next();
//};
//
//var glue = function(template, updates) {
//  return hyperglue(templates(template), updates).innerHTML;
//};
//
//var render = function (res, sections) {
//  sections = sections || {};
//  res.render = function (template, updates) {
//    updates = updates || {};
//    var main = glue(template, updates);
//    updates['.main'] = {_html: main};
//    for (var section in sections) {
//      updates['.'+section] = {_html: templates(sections[section])};
//    }
//    res.shatag(glue('/layout.html', updates));
//  };
//};

var redirect = function (res, to) {
  console.warn('Warning: Moved Permanently');
  res.statusCode = 301;
  res.setHeader('location', to);
  res.end('Moved Permanently');
};

var subRe = RegExp('(/.+/).*')

http.createServer(function (req, res) {
  var head, layout, main, nav, pn, sub;

  console.log(req.method, req.url);

  // Short circuit to serve static files
  if (serveStatic(req, res)) return;

  req.parsedUrl = url.parse(req.url);
  pn = req.parsedUrl.pathname;

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
    console.warn('Warning: Not Found');
    res.statusCode = 404;
    return res.end('Not Found');
  }

  res.setHeader('Content-Type', 'text/html');

  // Set head and nav sections
  sub = subRe.exec(pn)
  if (sub) {
    head = templates(sub[1]+'head.html')
    nav = templates(sub[1]+'nav.html')
  } else {
    head = templates('/head.html');
  }

  // Streams and streams
  layout = trumpet();
  layout.pipe(res);
  templates('/layout.html').pipe(layout);
  main.pipe(layout.createWriteStream('.main'));
  head.pipe(layout.createWriteStream('.head'));
  if (nav) {
    nav.pipe(layout.createWriteStream('.nav'));
  }

  return;

  // TODO Figure out streaming etagging
  //shatag(req, res);
}).listen(port, function () {
  console.log('Listening on port', port);
});
