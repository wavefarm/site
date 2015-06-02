var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var moment = require('moment')
var templates = require('../templates')
var url = require('url')

module.exports = function (req, res) {
	
	// which calendar are we on? 
	var pathname = url.parse(req.url, true).pathname;
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/schedule/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}

	var title = 'Wave Farm Radio';
	var sitePath = '';

	if (site=='wgxc') {
		title = 'WGXC Schedule';
		sitePath = '/wgxc';
	}
	else if (site=='ta') {
		title = 'Wave Farm Radio';
		sitePath = '/ta';
	}	
	
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  t('/layout.html').pipe(hs({
    'title': title,
    '.head': t(sitePath+'/head.html'),
    '.nav': t(sitePath+'/nav.html'),
    '.listen': templates('/listen.html'),
    '.announce': templates('/announce.html'),
    '.main': t(sitePath+'/schedule.html').pipe(hs({
      '.datepicker-container': t('/datepicker-container-body.html'),
    }))
  })).pipe(res)
}
