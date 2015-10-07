var api = require('../api')
var moment = require('moment')
var render = require('mustache').render
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
		sitePath = 'wgxc';
	}
	else if (site=='ta') {
		title = 'Transmission Arts Events';
		sitePath = 'ta';
	}
	
	res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(render(res.t['layout.html'], {title: title}, {
    head: res.t[sitePath+'/head.html'],
    nav: res.t[sitePath+'/nav.html'],
    listen: res.t['listen.html'],
    announce: res.t['announce.html'],
    main: res.t[sitePath+'/calendar.html'],
    datepicker: res.t['datepicker-container-body.html'],
    addEventForm: res.t['add-event-form-body.html'],
    calendar: res.t['calendar-body.html']
  }))
}
