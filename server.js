//var api = require('./api')
var ecstatic = require('ecstatic')
var fs = require('fs')
var crypto = require('crypto')
var http = require('http')
var hyperglue = require('hyperglue')
var rut = require('rut')
var scalpel = require('scalpel')
var snout = require('snout')
var stack = require('stack')

// Timestamp logs
require('logstamp')(console)

var port = process.argv[2] || process.env.PORT || 1041

var reqLog = function (req, res, next) {
  console.log(req.method, req.url)
  next()
}

var resRender = function (req, res, next) {
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
  res.glue = function (template, data, cb) {
    fs.readFile(__dirname + '/static/templates/' + template, {encoding: 'utf8'}, function (err, tmplt) {
      if (err) return next(err)
      cb(hyperglue(tmplt, data).innerHTML)
    })
  }
  res.render = function (template, data) {
    res.glue(template, data, function (inner) {
      data['.main'] = {_html: inner}
      res.glue('layout.html', data, function (out) {
        res.send(out)
      })
    })
  }
  next()
}

//var getSchemas = function (req, res, next) {
//  api.schemas(function (err, apiRes, schemas) {
//    if (err) return next(err)
//    req.schemas = schemas
//    next()
//  })
//}

http.createServer(stack(
  reqLog,
  ecstatic({root: __dirname + '/static', handleError: false}),
  resRender,
  scalpel,
  //getSchemas,
  rut.get('/', require('./routes'))
  //rut.get(/^\/(\w{6})$/, require('./routes/itemGet')),
  //rut.post(/^\/(\w{6})$/, require('./routes/itemPost'))
)).listen(port, function () {
  console.log('Listening on port', port)
})
