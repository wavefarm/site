var mustache = require('mustache')
var api = require('../../api')
var moment = require('moment')
var url = require('url')
var qs = require('querystring')
	
module.exports = function (req, res) {
	
	var pathname = url.parse(req.url, true).pathname;	
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/newsroom\/rss/
	var mp3Re = /\n(https?:\/\/.+\.mp3)/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}
	
	var dateFormat = 'ddd, DD MMM YYYY H:mm:ss -0500'
	var basePath = 'https://wavefarm.org';
	if (req.connection && req.headers.host)
		basePath = 		req.connection.encrypted?'https://':'http://' + req.headers.host;		
	var sitePath = '';	
	var feedTitle = 'Wave Farm Newsroom';
	//var feedUrl =  'https://wavefarm.org/newsroom';
	var feedUrl =   basePath + req.url;
	var feedDescription = 'This page combines the posts from both the Wave Farm Newsroom (Transmission Art news, radio news, open calls, media news, radio theatre, and more) and the WGXC Newsroom (Scripts and sounds for WGXC radio hosts to play on the WGXC Morning Show or WGXC Afternoon Show. Breaking news, features, local audio, video, analysis, music, links to events in Greene and Columbia counties, NY.)';
	//var feedCopyright = 'Wave Farm Newsroom RSS';
	var feedCopyright = '';
	var feedPubDate =  moment().format(dateFormat)
	var feedLastBuildDate = moment().subtract(1, 'years');

	var dateFilter = moment().add(6, 'hours');

	if (site=='wgxc') {
		feedTitle = 'WGXC Newsroom';
		feedDescription = 'Scripts and sounds for WGXC radio hosts to play on the WGXC Morning Show or WGXC Afternoon Show. Breaking news, features, local audio, video, analysis, music, links to events in Greene and Columbia counties, NY.';
		sitePath =  'wgxc/';
		feedUrl =  basePath + '/wgxc/newsroom';
	}
	else if (site=='ta') {
		feedTitle = 'Transmission Art Newsroom';
		feedDescription = 'Transmission Art news, radio news, open calls, media news, radio theatre, and more, from Wave Farm.';
		sitePath =  'ta/';
		feedUrl =  basePath + '/ta/newsroom';
	}	

	var sites = '';
	if (site=='wgxc') sites = '%20sites:wgxc';
	else if (site=='ta') sites = '%20sites:transmissionarts';					
		
	var params = qs.parse('q=type:news'+sites+'&sort=-date&size=40')	
  api.search(params, function (err, results) {
  	
    items = [];
    
    if (err) {
    	// allow API errors to render page, w/o items, bug log error
    	console.error(err);
    }
    else {
	    for (var i = 0; i < results.hits.length; i++) {    	    	
	      result = results.hits[i]
	      
	      // filter out items too far in the future
	      if (result.date && moment(result.date).isBefore(dateFilter)) {

		      if (result.timestamp && feedLastBuildDate.isBefore(moment(result.timestamp)))
		      	feedLastBuildDate = moment(result.timestamp)
		      
		    	var fullDescription = result.description || ''
		    	// deal with embedded mp3 URLs
		  		var mp3Url = false;		
		    	var matches = mp3Re.exec(fullDescription)
		    	if (matches!=null) {	
		    		mp3Url = matches[1]
		    		fullDescription = fullDescription.replace(mp3Re,'')	    		
	        	var audioTag = '<audio controls="controls" preload="none"><source src="'+mp3Url+'" type="audio/mpeg"></audio>'
	        	fullDescription = fullDescription + '<br /><br />' + audioTag	    		
		    	}
		      	      
		      item = {
		      		"title" : result.title,
		      		"description" : fullDescription,
		      		"link" : basePath + '/' + sitePath + 'newsroom/' + result.id,
		      		"pubDate" : moment(result.date).format(dateFormat),
		      		"guid" : result.id,
		      		"authod" : result.author
		      }            
		      items.push(item)
	      
	      }
	    }
    }
      	
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    res.end(mustache.render(res.t['rss/newsroom.xml'], {
      feedTitle: feedTitle,
      feedUrl:  feedUrl,
      feedDescription: feedDescription,
      feedCopyright: feedCopyright,
      feedPubDate: feedPubDate,
      feedLastBuildDate: feedLastBuildDate.format(dateFormat),
      items: items        
    }))   
  })	
}