//var api = require('./api')
var crypto = require('crypto');
var http = require('http');
var hyperglue = require('hyperglue');
var st = require('st');
var templates = require('./templates');
var url = require('url');

// Timestamp logs
require('logstamp')(console);

var port = process.argv[2] || process.env.PORT || 1041;

var serveStatic = st({path: __dirname + '/static', url: '/static'});

function shatag (req, res, next) {
  res.shatag = function (data) {
    var h = crypto.createHash("sha1")
    h.update(data)
    var etag = '"' + h.digest('base64') + '"'
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      return res.end();
    }
    res.statusCode = 200;
    res.setHeader('ETag', etag);
    res.end(data);
  };
  if (next) next();
};

var glue = function(template, updates) {
  return hyperglue(templates(template), updates).innerHTML;
};

var render = function (res, sections) {
  sections = sections || {};
  res.render = function (template, updates) {
    updates = updates || {};
    var main = glue(template, updates);
    updates['.main'] = {_html: main};
    for (var section in sections) {
      updates['.'+section] = {_html: templates(sections[section])};
    }
    res.shatag(glue('/layout.html', updates));
  };
};

var redirect = function (res, to) {
  console.log('Moved Permanently');
  res.statusCode = 301;
  res.setHeader('location', to);
  res.end('Moved Permanently');
};

var sub, subsites = ['ta', 'wgxc', 'mag'];
var page, wf_pages = [
  'about',
  'programs',
  'events',
  'archive',
  'newsroom',
  'support',
  'contact',
  'legal',
  'privacy'
];
var mag_pages = [
  'artists',
  'organizations',
  'map'
];

http.createServer(function (req, res) {
  console.log(req.method, req.url);

  // Short circuit to serve static files
  if (serveStatic(req, res)) return;

  req.parsedUrl = url.parse(req.url);
  res.setHeader('Content-Type', 'text/html');
  shatag(req, res);

  // Subsite routes
  for (var i=0; i<subsites.length; i++) {
    sub = '/'+subsites[i];
    if (req.url === sub) return redirect(res, sub+'/');
    if (RegExp('^'+sub).test(req.url)) {
      render(res, {head: sub+'/head.html', nav: sub+'/nav.html'});
    }
    if (req.url === sub+'/') return require('./routes'+sub)(req, res);
  }

  // MAG routes
  for (var i=0; i<mag_pages.length; i++) {
    page = mag_pages[i];
    if (req.parsedUrl.pathname === '/mag/'+page) {
      return res.render('/mag/'+page+'.html');
    }
  }

  // Wave Farm routes
  render(res, {head: '/head.html'});
  if (req.parsedUrl.pathname === '/') return require('./routes')(req, res);
  for (var i=0; i<wf_pages.length; i++) {
    page = '/'+wf_pages[i];
    if (req.parsedUrl.pathname === page) {
      return res.render(page+'.html');
    }
  }

  console.warn('Warning: Not Found');
  res.statusCode = 404;
  return res.end('Not Found');
}).listen(port, function () {
  console.log('Listening on port', port);
});
