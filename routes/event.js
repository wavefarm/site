var api = require('../api')
var moment = require('moment')
var util = require('../lib/util')

var idRe = /\/(\w+\/)?calendar\/(\w{6})/
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
        locations += '<strong id="location-name-'+item.locations[i].id+'">'+item.locations[i].main+'</strong>';
        // place holder for address to be filled in client side
        locations += '<p id="location-address-'+item.locations[i].id+'"></p>';
      }     
    }    
    
    var iconList = util.getIconList(item);   

    res.render({
      title: item.main,
      icons: iconList,                 
      //'.item-main-image': { src: imgSrc },
      dates: datesDesc,
      locations: locations,
      description: item.briefDescription,
      url: item.url,
      startDate: item.startDate,
      endDate: item.endDate
    }, {
      head: site+'head.html',
      nav: site+'nav.html',
      listen: 'listen.html',
      announce: 'announce.html',
      main: 'event.html',
      relatedItems: 'related-items.html'
    })
  })
}
