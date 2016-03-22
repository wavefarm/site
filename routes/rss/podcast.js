var mustache = require('mustache')
var api = require('../../api')
var moment = require('moment')
var url = require('url')
var qs = require('querystring')
	
var idRe = /\/(\w+\/)schedule\/(\w{6})/
var validTypes = ['show']

module.exports = function (req, res) {

	var matches = idRe.exec(req.url)
	var site = matches[1] || ''
  var id = matches[2]

	
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }    
    if (validTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }
    
  	var dateFormat = 'ddd, DD MMM YYYY H:mm:ss -0500'
  	var basePath = 'https://wavefarm.org';
  	if (req.connection && req.headers.host)
  		basePath = 		req.connection.encrypted?'https://':'http://' + req.headers.host;		
    

  	var feedLastBuildDate = moment().subtract(1, 'years')

    
    //var params = qs.parse('q=type:news'+sites+'&sort=-date&size=40')

    var targetType = 'audio'
    var sort = '-date,sort,main'
    var relation = 'shows'
    var itemId = item.id
    
    var params = qs.parse('q=public:true%20type:'+targetType+'%20'+relation+'.id:'+itemId +'&size=50&sort='+sort)
    
    api.search(params, function (err, results) {
    	
      items = [];
      
      if (err) {
      	// allow API errors to render page, w/o items, bug log error
      	console.error(err);
      }
      else {
  	    for (var i = 0; i < results.hits.length; i++) {    	    	
  	      result = results.hits[i]
    	
		      if (result.timestamp && feedLastBuildDate.isBefore(moment(result.timestamp)))
		      	feedLastBuildDate = moment(result.timestamp)
		      
		      summary = ''	
		      subtitle = ''
		      	
		      listItem = {
		      		"title" : result.title,
		      		"description" : summary,
		      		"link" : basePath + '/archive/' + result.id,
		      		"pubDate" : moment(result.date).format(dateFormat),
		      		"guid" : result.id,
		      		"author" : result.credit,
		      		"summary" : summary,
		      		"enclosureURL": result.url,
		      		"mimetype" : result.mimetype
		      }            
		      items.push(listItem)
  	    }
  	    
	    	res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
	      res.end(mustache.render(res.t['rss/podcast.xml'], {
	        feedTitle:  item.title,
	        feedUrl:  basePath + req.url,
	        feedDescription: item.description,
	        feedCopyright: 'Copyright '+moment().format('YYYY')+' Wavefarm',
	        feedPubDate: moment().format(dateFormat),
	        feedLastBuildDate: feedLastBuildDate.format(dateFormat),
	        feedSummary:  item.description,
	        feedSubtitle: item.subtitle,
	        feedAuthor: item.credit,	        
	        items: items        
	      }))
      }    
    })
  })	
}