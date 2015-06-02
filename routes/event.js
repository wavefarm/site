var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var moment = require('moment')
var util = require('../lib/util')
var templates = require('../templates')

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
    
    if(typeof(item.locations)!='undefined' && item.locations.length>0) {
        var locationName = item.locations[0].main;    	
    }
    
    var iconList = util.getIconList(item);   
    var icons = '';
    for (i=0; i<iconList.length; i++) {
    	icons += '<img src="' + iconList[i] +'" />';
    }
        
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t(site+'/head.html'),
      '.nav': t(site+'/nav.html'),
      '.listen': templates('/listen.html'),
      '.announce': templates('/announce.html'),
      '.main': t('/event.html').pipe(hs({
        '.item-main span.main': item.main,
        '.item-main span.icons': icons,	       	        
        //'.item-main-image': { src: imgSrc },
        '.event-dates strong': datesDesc,
        '.item-location strong': locationName,
        '.description': item.briefDescription,
        '.start-date': item.startDate,
        '.end-date': item.endDate
      }))
    })).pipe(res)
  })
}
