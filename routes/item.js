var api = require('../api')
var util = require('../lib/util')

var idRe = /\/(\w+\/)schedule\/(\w{6})/
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

    var dates = util.formatDates(item);
    var mainSubtitle = typeof(item.subtitle)!='undefined'?item.subtitle:'';
    var show = '';
    
    if (item.type=='broadcast' && typeof(item.shows)!='undefined') {
      show = '<a href="/'+site+'schedule/'+item.shows[0].id+'">'+ item.shows[0].main +'</a>:&nbsp;';
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
    
    
    var podcastURL = ''
    var itunesPodcastURL = ''
    if (item.type=='show' && typeof(item.audio)!='undefined') {
    	podcastURL = '/'+site+'schedule/'+item.id+'/rss'
    	/*
    	if (req.headers && req.headers.host)
    		itunesPodcastURL = 'itpc://' + req.headers.host + podcastURL
    	else
    		itunesPodcastURL = 'itpc://wavefarm.org' + podcastURL
    	*/
  		itunesPodcastURL = 'itpc://wavefarm.org' + podcastURL
    }
    
     
    res.render({
      title: item.main,
      show: show,
      itemMain: item.main,
      subtitle: mainSubtitle,
      icons: icons,
      dates: dates,
      locations: locations,
      detail: detailDesc,
      detail2: detail2Desc,
      description: typeof(item.description)!='undefined'?item.description:'',
      podcastURL : podcastURL,
      itunesPodcastURL : itunesPodcastURL
    }, {
      head: site+'head.html',
      nav: site+'nav.html',
      listen: 'listen.html',
      announce: 'announce.html',
      main: 'program-broadcast.html',
      relatedItems: 'related-items.html'
    })
  })
}
