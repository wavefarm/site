var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var moment = require('moment')

var idRe = /\/listen\/(\w{4})/


module.exports = function (req, res) {

	var id = idRe.exec(req.url)[1]
	
	var title = 'WGXC 90.7-FM: Listen Now'
  
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/listen.html').pipe(res)
    /*
    t('/layout.html').pipe(hs({
      title: title,
      '.head': '',
      '.nav': '',
      '.header-container': '',
      '.listen-container': '',
      '.tweets-container': '',
      '.footer-container': '',
      '.main': t('/listen.html')
    })).pipe(res)
    */	
}
