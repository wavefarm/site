var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var moment = require('moment')
var util = require('../lib/util')

var idRe = /(\/\w+)?\/calendar\/(\w{6})/
var validTypes = [
  'event'
]

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
        
    var datesDesc = util.formatDates(item);
    var locationName = '';
    var locationAddress = '';
    var imgSrc = '';
    
    var locations = '';
    if(typeof(item.locations)!='undefined') {
    	for (i = 0; i < item.locations.length; i++) { 
    		locations += '<strong>'+item.locations[i].main+'</strong>';
    		// place holder for address to be filled in client side
    		locations += '<p id="location-address-'+item.locations[i].id+'"></p>';
    	}    	
    }    
    
    var iconList = util.getIconList(item);   
    var icons = '';
    for (i=0; i<iconList.length; i++) {
    	icons += '<img src="' + iconList[i] +'" />';
    }
      	
    var url = '';
  	if (typeof(item.url)!='undefined' && item.url.length>0) {
  		url = '<a href="'+item.url+'">'+item.url+'</a>';
  	}
  	               
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t(site+'/head.html'),
      '.nav': t(site+'/nav.html'),
      '.listen': t('/listen.html'),
      '.announce': t('/announce.html'),
      '.main': t('/event.html').pipe(hs({
      	'.related-items-container': t('/related-items.html'),
        '.item-main span.main': item.main,
        '.item-main span.icons': icons,	       	        
        //'.item-main-image': { src: imgSrc },
        '.event-dates strong': datesDesc,
        '.item-location': locations,
        '.description': item.briefDescription,
        'div.url': url,
        '.start-date': item.startDate,
        '.end-date': item.endDate
      }))
    })).pipe(res)
  })
}
