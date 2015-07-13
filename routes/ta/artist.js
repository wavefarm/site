var api = require('../../api')
var hs = require('hyperstream')
var t = require('../../templates')
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
    
    var url = '';
  	if (typeof(item.url)!='undefined' && item.url.length>0) {
  		url = '<a href="'+item.url+'">'+item.url+'</a>';
  	}    
     
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t('/ta/head.html'),
      '.nav': t('/ta/nav.html'),
      '.listen': t('/listen.html'),      
      '.main': t('/ta/artist.html').pipe(hs({
      	'.related-items-container': t('/related-items.html'),
        '.item-main span.main': main,
        //'.item-main-image': { src: imgSrc },
        'div.bio': typeof(item.bio)!='undefined'?item.bio:'',
        'div.url': url,
      }))
    })).pipe(res)
  })
}
