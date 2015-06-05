var api = require('../api')
var hs = require('hyperstream')
var t = require('../templates')
var util = require('../lib/util')

var idRe = /(\/\w+)\/schedule\/(\w{6})/
var validTypes = [
  'broadcast',
  'show'
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
    var main = item.main;
    var mainSubtitle = typeof(item.subtitle)!='undefined'?item.subtitle:'';
    var show = '';
    
    if (item.type=='broadcast' && typeof(item.shows)!='undefined') {
    	show =  '<a href="'+site+'/schedule/'+item.shows[0].id+'">'+ item.shows[0].main +'</a>:&nbsp;';
    }
    
    if(typeof(item.locations)!='undefined' && item.locations.length>0) {
      var locationName = item.locations[0].main;    	
    }
        
    var iconList = util.getIconList(item);   
    var icons = '';
    for (i=0; i<iconList.length; i++) {
    	icons += '<img src="' + iconList[i] +'" />';
    }
    
    var detailDesc = typeof(item.credit)!='undefined'?item.credit:'';
    var detail2Desc = typeof(item.airtime)!='undefined'?item.airtime:'';
     
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t(site+'/head.html'),
      '.nav': t(site+'/nav.html'),
      '.listen': t('/listen.html'),      
      '.main': t('/program-broadcast.html').pipe(hs({
      	'.related-items-container': t('/related-items.html'),
        '.item-main strong': show,
        '.item-main span.main': main,
        '.item-main span.subtitle': mainSubtitle,                
        '.item-main span.icons': icons,
        //'.item-main-image': { src: imgSrc },
        '.item-dates strong': datesDesc,
        '.item-location strong': locationName,
        '.item-detail strong': detailDesc,
        '.item-detail2 strong': detail2Desc,
        '.description': typeof(item.description)!='undefined'?item.description:''
      }))
    })).pipe(res)
  })
}
