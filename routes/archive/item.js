var api = require('../../api')
var util = require('../../lib/util')

module.exports = function (req, res, id) {
  api.get(id, function (err, item) {
    if (err) {
      if (err.message === '[API] Not Found') return res.error(404, err)
      return res.error(500, err)
    }

    if (['artist', 'audio', 'image', 'location', 'text', 'video'].indexOf(item.type) === -1) {
      return res.error(404, {message: 'Not Found'})
    }

    item.dateFormatted = util.formatArchiveDate(item)
    item.addressFull = util.concoctFullAddress(item)

    item.hasVideoDownload = false
    item.hasVideoLink = false
    if (item.type == 'video' && item.url) {
    	if ((item.url.indexOf('data.wavefarm.org') > -1) ||
    			(item.url.indexOf('data.free103point9.org') > -1)  ||
    			(item.url.indexOf('free103point9.org') > -1) ) {    		
    		item.hasVideoDownload = true
    	}
    	else {
    		item.hasVideoLink = true
    	}
    }
    
    res.render({title: item.main, item: item}, {
      head: 'head.html',
      listen: 'listen.html',
      main: 'archive/' + item.type + '.html',
      relatedItems: 'related-items.html'      
    })
  })
}
