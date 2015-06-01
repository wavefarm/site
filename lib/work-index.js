var concat = require('concat-stream');
var http = require('http')
var strip = require('strip')
var url = require('url')
var util = require('../lib/util')

module.exports = function () {

	// Noop if no .schedule
  var worksList = $('.works-list');
  if (!worksList.length) return;
  
  var workInfo = $('.work-info');
  var workInfoTemplate = workInfo.clone();
  var firstWork = true;
  
  // get the letter, default to 'A'
	var pathname = url.parse(document.URL, true).pathname;

	var letter = 'A';
	var subsiteRe = /\/ta\/works\/(\w*)/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) letter = matches[1];
  
  // set current letter indicator
  var letterTitle = letter;
  if (letterTitle=='0') letterTitle = '0-9';  
  $('.letter-title').html(letterTitle.toUpperCase());

  renderWorks(letter);
    
  function renderWorks (letter) {
    http.get({
      	path: '/api/ta/works/' + letter
    	}, 
    	function (res) {
    		res.pipe(concat(function (data) {
    			
    			var result = JSON.parse(data);        
    			result.hits.forEach(function (hit) {
    				
    				if (firstWork) {
    					firstWork = false;
    				} else {
      				workInfo = workInfoTemplate.clone();
      				worksList.append(workInfo);
    				}
    				
            var name = workInfo.find('.work-name');
            var description = workInfo.find('.work-description');
                				
            name.find('span').html(hit.main).on('click', function () {
              description.slideToggle();
            });
            var hd = hit.description || '';
            hd = strip(hd);
            if (hd.length > 280) hd = hd.substr(0, 280) + '...';
            
            workInfo.find('.work-dates strong').html( util.formatArchiveDate(hit));    		
            workInfo.find('.work-credit strong').html(hit.credit);    		
            
            
            description.find('p').html(hd);
            workInfo.find('.more').attr('href', '/ta/works/' + hit.id)
            
    			})
    		}))      
    	}
    )
  };
};
