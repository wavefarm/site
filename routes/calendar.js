var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var moment = require('moment')
var templates = require('../templates')
var url = require('url')

module.exports = function (req, res) {

	// which site are we on? 
	var pathname = url.parse(req.url, true).pathname;
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/calendar/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}

	var title = 'Wave Farm Events';
	var sitePath = '';

	if (site=='wgxc') {
		title = 'WGXC Community Calendar';
		sitePath = '/wgxc';
	}
	else if (site=='ta') {
		title = 'Transmission Arts Events';
		sitePath = '/ta';
	}
	
	res.setHeader('Content-Type', 'text/html; charset=utf-8')
  t('/layout.html').pipe(hs({
    title: title,
    '.head': t(sitePath+'/head.html'),
    '.nav': t(sitePath+'/nav.html'),
    '.listen': templates('/listen.html'),
    '.announce': templates('/announce.html'),
    '.main': t(sitePath+'/calendar.html').pipe(hs({
      '.datepicker-container': t('/datepicker-container-body.html'),
      '.add-event-form-div': t('/add-event-form-body.html'),
      '.calendar-div': t('/calendar-body.html')
    }))
  })).pipe(res)
}
