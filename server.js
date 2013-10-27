//var api = require('./api')
var ecstatic = require('ecstatic');
var crypto = require('crypto');
var http = require('http');
var hyperglue = require('hyperglue');
var templates = require('./templates');

// Timestamp logs
require('logstamp')(console);

var port = process.argv[2] || process.env.PORT || 1041;

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
    res.tag(glue('layout.html', updates));
  };
};

var redirect = function (res, to) {
  console.log('Moved Permanently');
  res.statusCode = 301;
  res.setHeader('location', to);
  res.end('Moved Permanently');
};

var sub, subsites = ['ta', 'wgxc', 'mag'];
var page, wf_pages = ['about', 'contact', 'support'];

http.createServer(function(req, res) {
  console.log(req.method, req.url);

  res.tag = function (out) {
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

  // Subsite routes
  for (var i=0; i<subsites.length; i++) {
    sub = subsites[i];
    if (req.url === '/'+sub) return redirect(res, '/'+sub+'/');
    if (RegExp('^/'+sub).test(req.url)) {
      render(res, {head: sub+'/head.html', nav: sub+'/nav.html'});
    }
    if (req.url === '/'+sub+'/') return require('./routes/'+sub)(req, res);
  }

  // Wave Farm routes
  render(res, {head: 'head.html'});
  if (req.url === '/') return require('./routes')(req, res);
  for (var i=0; i<wf_pages.length; i++) {
    page = wf_pages[i];
    if (req.url === '/'+page) {
      return res.render(page+'.html');
    }
  }

  ecstatic({root: __dirname + '/static'})(req, res, function() {
    console.log('Not Found');
    res.statusCode = 404;
    return res.end('Not Found');
  });
}).listen(port, function () {
  console.log('Listening on port', port);
});
