var api = require('../api')
var moment = require('moment')
var url = require('url')

module.exports = function (req, res) {

	// which site are we on? 
	var pathname = url.parse(req.url, true).pathname;
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/newsroom/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}

	var title = 'Wave Farm Newsroom';
	var sitePath = '';

	if (site=='wgxc') {
		title = 'WGXC Newsroom';
		sitePath = 'wgxc/';
	}
	else if (site=='ta') {
		title = 'Wave Farm Newsroom';
		sitePath = 'ta/';
	}
	
  res.render({title: title}, {
    head: sitePath+'head.html',
    nav: sitePath+'nav.html',
    listen: 'listen.html',
    announce: 'announce.html',
    main: sitePath+'news-calendar.html',
    datepicker: 'datepicker-container-body.html',
    calendar: 'news-calendar-body.html'
  })
}
