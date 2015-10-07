var api = require('../api')
var render = require('mustache').render
var util = require('../lib/util')

var idRe = /\/(\w+)\/schedule\/(\w{6})/
var validTypes = [
  'broadcast',
  'show'
]

module.exports = function (req, res) {
	var matches = idRe.exec(req.url)
	var site = matches[1] || ''
  var id = matches[2]
  var view = {}
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (validTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    view.dates = util.formatDates(item);
    var main = item.main;
    var mainSubtitle = typeof(item.subtitle)!='undefined'?item.subtitle:'';
    var show = '';
    
    if (item.type=='broadcast' && typeof(item.shows)!='undefined') {
      show = '<a href="/'+site+'/schedule/'+item.shows[0].id+'">'+ item.shows[0].main +'</a>:&nbsp;';
    }
    
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
    
    var detailDesc = typeof(item.credit)!='undefined'?item.credit:'';
    var detail2Desc = typeof(item.airtime)!='undefined'?item.airtime:'';
     
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(render(res.t['layout.html'], {title: item.main}, {
      head: res.t[site+'/head.html'],
      nav: res.t[site+'/nav.html'],
      listen: res.t['listen.html'],
      announce: res.t['announce.html'],
      main: render(res.t['program-broadcast.html'], {
        show: show,
        main: main,
        subtitle: mainSubtitle,
        icons: icons,
        dates: datesDesc,
        locations: locations,
        detail: detailDesc,
        detail2: detail2Desc,
        description: typeof(item.description)!='undefined'?item.description:''
      }, {relatedItems: res.t['related-items.html']})
    }))
  })
}
