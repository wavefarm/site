var api = require('../../api')
var hs = require('hyperstream')
var t = require('../../templates')
var moment = require('moment')
var wgxc = require('../../lib/wgxc')

var idRe = /\/wgxc\/calendar\/(\w{6})/
var wgxcTypes = [
  'broadcast',
  'show',
  'event'
]

module.exports = function (req, res) {
  var id = idRe.exec(req.url)[1]
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (wgxcTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }
    
    
    //var datesDesc = moment(item.startDate).format('MMM D, YYYY') + ' - ' + moment(item.endDate).format('MMM D, YYYY');
    var datesDesc = wgxc.formatDates(item);

    var locationName = '';
    var locationAddress = '';
    var imgSrc = '';
    
    if(typeof(item.locations)!='undefined' && item.locations.length>0) {
        var locationName = item.locations[0].main;    	
    }
    
    var iconList = wgxc.getIconList(item);   
    var icons = '';
    for (i=0; i<iconList.length; i++) {
    	icons += '<img src="' + iconList[i] +'" />';
    }
        

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t('/wgxc/head.html'),
      '.nav': t('/wgxc/nav.html'),
      '.main': t('/wgxc/event.html').pipe(hs({
        '.item-main span.main': item.main,
        '.item-main span.icons': icons,	       	        
        //'.item-main-image': { src: imgSrc },
        '.event-dates strong': datesDesc,
        '.event-location strong': locationName,
        //'.event-location p': locationAddress,
        '.description': item.briefDescription,
        '.start-date': item.startDate,
        '.end-date': item.endDate
      }))
    })).pipe(res)
  })
}
