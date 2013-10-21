//var api = require('./api')
var ecstatic = require('ecstatic');
var crypto = require('crypto');
var http = require('http');
var hyperglue = require('hyperglue');
var rut = require('rut');
var stack = require('stack');
var templates = require('./templates');

// Timestamp logs
require('logstamp')(console);

var port = process.argv[2] || process.env.PORT || 1041;

var reqLog = function (req, res, next) {
  console.log(req.method, req.url);
  next();
};

var glue = function(template, updates) {
  return hyperglue(templates(template), updates).innerHTML;
};

//var resSend = function (req, res, next) {
//  res.send = function (out) {
//    var h = crypto.createHash("sha1")
//    h.update(out)
//    var etag = '"' + h.digest('base64') + '"'
//    if (req.headers['if-none-match'] === etag) {
//      res.writeHead(304)
//      return res.end()
//    }
//    res.writeHead(200, {'Content-Type': 'text/html', 'ETag': etag})
//    res.end(out)
//  }
//  next();
//};

//var resRender = function (sections) {
//  sections = sections || {};
//  return function (req, res, next) {
//    res.render = function (template, updates) {
//      updates = updates || {};
//      var main = glue(template, updates);
//      updates['.main'] = {_html: main};
//      for (var section in sections) {
//        updates['.'+section] = {_html: templates(sections[section])};
//      }
//      res.send(glue('layout.html', updates));
//    };
//    next();
//  };
//};

var resRender = function (res, sections) {
  sections = sections || {};
  res.render = function (template, updates) {
    updates = updates || {};
    var main = glue(template, updates);
    updates['.main'] = {_html: main};
    for (var section in sections) {
      updates['.'+section] = {_html: templates(sections[section])};
    }
    res.etag(glue('layout.html', updates));
  };
};

//var redirect = function (to) {
//  return function (req, res, next) {
//    res.statusCode = 303
//    res.setHeader('location', to)
//    res.end()
//  };
//};

var redirect = function (res, to) {
  console.log('Moved Permanently');
  res.statusCode = 301;
  res.setHeader('location', to);
  res.end('Moved Permanently');
};

var resEtag = function (req, res) {
  res.etag = function (out) {
    var h = crypto.createHash("sha1")
    h.update(out)
    var etag = '"' + h.digest('base64') + '"'
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304)
      return res.end()
    }
    res.writeHead(200, {'Content-Type': 'text/html', 'ETag': etag})
    res.end(out)
  };
};

http.createServer(function(req, res) {
  console.log(req.method, req.url);

  // Redirects
  if (req.url === '/ta') return redirect(res, '/ta/');
  if (req.url === '/wgxc') return redirect(res, '/wgxc/');
  if (req.url === '/mag') return redirect(res, '/mag/');

  resEtag(req, res);

  // Transmission Arts routes
  if (RegExp('^/ta').test(req.url)) {
    resRender(res, {head: 'ta/head.html', nav: 'ta/nav.html'});
  }
  if (req.url === '/ta/') return require('./routes/ta')(req, res);

  // WGXC routes
  if (RegExp('^/wgxc').test(req.url)) {
    resRender(res, {head: 'wgxc/head.html', nav: 'wgxc/nav.html'});
  }
  if (req.url === '/wgxc/') return require('./routes/wgxc')(req, res);

  // Media Arts Grants routes
  if (RegExp('^/mag').test(req.url)) {
    resRender(res, {head: 'mag/head.html', nav: 'mag/nav.html'});
  }
  if (req.url === '/mag/') return require('./routes/mag')(req, res);

  // Wave Farm routes
  resRender(res);
  if (req.url === '/') return require('./routes')(req, res);

  ecstatic({root: __dirname + '/static'})(req, res, function() {
    console.log('Not Found');
    res.statusCode = 404;
    return res.end('Not Found');
  });
}).listen(port, function () {
  console.log('Listening on port', port);
});

//http.createServer(stack(
//  reqLog,
//  ecstatic({root: __dirname + '/static', handleError: false}),
//  resSend,
//
//  // Transmission Arts routes
//  rut('/ta', redirect('/ta/')),
//  rut('/ta**', resRender({head: 'ta/head.html', nav: 'ta/nav.html'})),
//  rut.get('/ta/', require('./routes/ta')),
//
//  // WGXC routes
//  rut('/wgxc', redirect('/wgxc/')),
//  rut('/wgxc**', resRender({head: 'wgxc/head.html', nav: 'wgxc/nav.html'})),
//  rut.get('/wgxc/', require('./routes/wgxc')),
//
//  // Media Arts Grants routes
//  rut('/mag', redirect('/mag/')),
//  rut('/mag**', resRender({head: 'mag/head.html', nav: 'mag/nav.html'})),
//  rut.get('/mag/', require('./routes/mag')),
//
//  // Wave Farm routes
//  resRender(),
//  rut.get('/', require('./routes'))
//)).listen(port, function () {
//  console.log('Listening on port', port);
//});
