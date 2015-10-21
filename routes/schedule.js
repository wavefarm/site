var api = require('../api')
var moment = require('moment')
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
		sitePath = 'wgxc/';
	}
	else if (site=='ta') {
		title = 'Wave Farm Radio';
		sitePath = 'ta/';
	}	
	
  res.render({title: title}, {
    head: sitePath+'head.html',
    nav: sitePath+'nav.html',
    listen: 'listen.html',
    announce: 'announce.html',
    main: sitePath+'schedule.html',
    datepicker: 'datepicker-container-body.html'
  })
}
