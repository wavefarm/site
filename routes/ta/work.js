var api = require('../../api')
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

    var datesDesc = util.formatArchiveDate(item);    
    var credit = item.credit || '';
     
    res.render({
      title: item.main,
      credit: credit,                
      dates: datesDesc,
      description: typeof(item.description)!='undefined'?item.description:' '
      //'.item-main-image': { src: imgSrc },
    }, {
      head: 'ta/head.html',
      nav: 'ta/nav.html',
      listen: 'listen.html',      
      main: 'ta/work.html',
      relatedItems: 'related-items.html'
    })
  })
}
