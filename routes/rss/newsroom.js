var mustache = require('mustache')
var api = require('../../api')
var moment = require('moment')
var url = require('url')
var qs = require('querystring')
	
module.exports = function (req, res) {
	
	var pathname = url.parse(req.url, true).pathname;	
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/newsroom\/rss/
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
	var feedTitle = 'Newsroom';
	//var feedUrl =  'https://wavefarm.org/newsroom';
	var feedUrl =   basePath + req.url;
	var feedDescription = 'This page combines the posts from both the Wave Farm Newsroom (Transmission Art news, radio news, open calls, media news, radio theatre, and more) and the WGXC Newsroom (Scripts and sounds for WGXC radio hosts to play on the WGXC Morning Show or WGXC Afternoon Show. Breaking news, features, local audio, video, analysis, music, links to events in Greene and Columbia counties, NY.)';
	var feedCopyright = 'Wave Farm Newsroom RSS';
	var feedPubDate =  moment().format(dateFormat)
	var feedLastBuildDate = 'Mon, 14 Dec 2015 20:01:51 GMT';

	if (site=='wgxc') {
		feedTitle = 'WGXC Newsroom';
		feedDescription = 'Scripts and sounds for WGXC radio hosts to play on the WGXC Morning Show or WGXC Afternoon Show. Breaking news, features, local audio, video, analysis, music, links to events in Greene and Columbia counties, NY.';
		sitePath =  'wgxc/';
		feedUrl =  basePath + '/wgxc/newsroom';
	}
	else if (site=='ta') {
		feedTitle = 'Waver Farm Newsroom';
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
	    	if (i==0) {
	    		feedLastBuildDate = moment(result.date).format(dateFormat)
	    		feedPubDate = feedLastBuildDate
	    	}            
	      item = {
	      		"title" : result.title,
	      		"description" : result.description,
	      		"link" : basePath + '/' + sitePath + 'newsroom/' + result.id,
	      		"pubDate" : moment(result.date).format(dateFormat),
	      		"guid" : result.id,
	      		"authod" : result.author
	      }            
	      items.push(item)
	    }
    }
      	
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    res.end(mustache.render(res.t['rss/newsroom.xml'], {
      feedTitle: feedTitle,
      feedUrl:  feedUrl,
      feedDescription: feedDescription,
      feedCopyright: feedCopyright,
      feedPubDate: feedPubDate,
      feedLastBuildDate: feedLastBuildDate,
      items: items        
    }))   
  })	
	
	
	
	
	/*
	var items =[
    { "title": "Moe", "link":"/newsroom/abcdef"},
    { "title": "Larry", "link":"/newsroom/abcdefg" },
    { "title": "Curly", "link":"/newsroom/abcdefgh" }
	]
	*/
		          
	

	
}