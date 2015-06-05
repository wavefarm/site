var api = require('../../api')
var hs = require('hyperstream')
var t = require('../../templates')
var util = require('../../lib/util')

var idRe = /\/ta\/works\/(\w{6})/
var validTypes = [
  'work'
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

    console.log(item);
    
    var main = item.main;
    var datesDesc = util.formatArchiveDate(item);    
    var credit = item.credit || '';
     
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    t('/layout.html').pipe(hs({
      title: item.main,
      '.head': t('/ta/head.html'),
      '.nav': t('/ta/nav.html'),
      '.listen': t('/listen.html'),      
      '.main': t('/ta/work.html').pipe(hs({
      	'.related-items-container': t('/related-items.html'),
        '.item-main span.main': main,
        //'.item-main-image': { src: imgSrc },
        '.item-credit strong': credit,                
        '.item-dates strong': datesDesc,
        '.description': typeof(item.description)!='undefined'?item.description:'No desc'
      }))
    })).pipe(res)
  })
}
