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

var resSend = function (req, res, next) {
  res.send = function (out) {
    var h = crypto.createHash("sha1")
    h.update(out)
    var etag = '"' + h.digest('base64') + '"'
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304)
      return res.end()
    }
    res.writeHead(200, {'Content-Type': 'text/html', 'ETag': etag})
    res.end(out)
  }
  next();
};

var resRender = function (sections) {
  sections = sections || {};
  return function (req, res, next) {
    res.render = function (template, updates) {
      updates = updates || {};
      var main = glue(template, updates);
      updates['.main'] = {_html: main};
      for (var section in sections) {
        updates['.'+section] = {_html: templates(sections[section])};
      }
      res.send(glue('layout.html', updates));
    };
    next();
  };
};

var redirect = function (to) {
  return function (req, res, next) {
    res.statusCode = 303
    res.setHeader('location', to)
    res.end()
  };
};

http.createServer(stack(
  reqLog,
  ecstatic({root: __dirname + '/static', handleError: false}),
  resSend,

  // Transmission Arts routes
  rut('/ta', redirect('/ta/')),
  rut('/ta**', resRender({head: 'ta/head.html', nav: 'ta/nav.html'})),
  rut.get('/ta/', require('./routes/ta')),

  // WGXC routes
  rut('/wgxc', redirect('/wgxc/')),
  rut('/wgxc**', resRender({head: 'wgxc/head.html', nav: 'wgxc/nav.html'})),
  rut.get('/wgxc/', require('./routes/wgxc')),

  // Media Arts Grants routes
  rut('/mag', redirect('/mag/')),
  rut('/mag**', resRender({head: 'mag/head.html', nav: 'mag/nav.html'})),
  rut.get('/mag/', require('./routes/mag')),

  // Wave Farm routes
  resRender(),
  rut.get('/', require('./routes'))
)).listen(port, function () {
  console.log('Listening on port', port)
})
