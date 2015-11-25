var api = require('../api')
var moment = require('moment')
var util = require('../lib/util')

var idRe = /\/(\w+\/)?newsroom\/(\w{6})/
var validTypes = [
  'news'
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
        
    
	  var date = moment(item.date);			
	  var datesDesc =  date.format('MMM D, YYYY h:mm a')+' &bull; '+item.author;
	  
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

		var audioPlayerTemplate = 
			'<audio controls="controls" preload="none"><source src="{{audioUrl}}" type="audio/mpeg"></audio>';    
		var audioPlayer = '';
    
    // have to deal with embedded audio URLs in description
    var fullDescription = item.description;
		var mp3Url = false;		
		var mp3Re = /\n(https?:\/\/.+\.mp3)/
  	var matches = mp3Re.exec(fullDescription)
  	if (matches!=null) {	
  		mp3Url = matches[1];
  		fullDescription = fullDescription.replace(mp3Re,'');  		
  		audioPlayer = audioPlayerTemplate.replace('{{audioUrl}}',mp3Url);
  	}    
    		
		var  newsTagList = '';		
		if (typeof(item.keywords)!='undefined' && item.keywords!=='') {			
			var keywords = item.keywords.split(',');
			var sitesValue = site.replace('/','');
			if (sitesValue=='ta') sitesValue = 'transmissionarts';
      for (i = 0; i < keywords.length; i++) {
      	var url = '/archive?q=keywords:'+encodeURIComponent((keywords[i])+' sites:'+sitesValue+' type:news' );
      	newsTagList = newsTagList + '<a href="'+url+'+">' + keywords[i] + '</a>';
      	if (i<keywords.length-1) newsTagList = newsTagList + ', ';
      }
		}
					
    res.render({
      title: item.main,
      icons: iconList,                 
      //'.item-main-image': { src: imgSrc },
      dates: datesDesc,
      locations: locations,
      description: fullDescription,
      audioPlayer: audioPlayer,
      newsTagList: newsTagList
      //url: item.url
    }, {
      head: site+'head.html',
      nav: site+'nav.html',
      listen: 'listen.html',
      announce: 'announce.html',
      main: 'news.html',
      relatedItems: 'related-items.html'
    })
  })
}
