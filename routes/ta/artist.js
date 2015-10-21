var api = require('../../api')
var util = require('../../lib/util')

var idRe = /\/ta\/artists\/(\w{6})/
var validTypes = [
  'artist'
]

module.exports = function (req, res) {
  var matches = idRe.exec(req.url)
  var id = matches[1]
  api.get(id, function (err, item) {
    if (err) {
      return res.error(500, err)
    }

    if (validTypes.indexOf(item.type) === -1) {
      return res.error(404, new Error('No type "' + item.type + '"'))
    }

    var main = item.main;
    
    res.render({
      title: item.main,
      //'.item-main-image': { src: imgSrc },
      bio: typeof(item.bio)!='undefined'?item.bio:'',
      url: item.url
    }, {
      head: 'ta/head.html',
      nav: 'ta/nav.html',
      listen: 'listen.html',      
      main: 'ta/artist.html',
      relatedItems: 'related-items.html',
    })
  })
}
