var concat = require('concat-stream');
var http = require('http')
var strip = require('strip')
var url = require('url')

module.exports = function () {

	// Noop if no .schedule
  var artistsList = $('.artists-list');
  if (!artistsList.length) return;
  
  var artistInfo = $('.artist-info');
  var artistInfoTemplate = artistInfo.clone();
  var firstArtist = true;
  
  // get the letter, default to 'A'
	var pathname = url.parse(document.URL, true).pathname;

	var letter = 'A';
	var subsiteRe = /\/ta\/artists\/(\w*)/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) letter = matches[1];
  
  // set current letter indicator
  var letterTitle = letter;
  if (letterTitle=='0') letterTitle = '0-9';  
  $('.letter-title').html(letterTitle.toUpperCase());
 
  renderArtists(letter);
   
  function renderArtists (letter) {
    http.get({
      	path: '/api/ta/artists/' + letter
    	}, 
    	function (res) {
    		res.pipe(concat(function (data) {
    			
    			var result = JSON.parse(data);        
    			result.hits.forEach(function (hit) {
    				
    				// TODO: couldn't get API to filter these, so doing it here for now
    				if (typeof(hit.categories)=='undefined' 
    					|| hit.categories.length<1 
    					|| $.inArray('Transmission Artist', hit.categories) < 0) {
    					// skip it
    					return;
    				}
    				
    				if (firstArtist) {
    					firstArtist = false;
    				} else {
      				artistInfo = artistInfoTemplate.clone();
      				artistsList.append(artistInfo);
    				}
    				
            var name = artistInfo.find('.artist-name');
            var description = artistInfo.find('.artist-description');
    				
            name.find('span').html(hit.main).on('click', function () {
              description.slideToggle();
            });
            var hd = hit.bio || '';
            hd = strip(hd);
            if (hd.length > 280) hd = hd.substr(0, 280) + '...';
            
            description.find('p').html(hd);
            artistInfo.find('.more').attr('href', '/ta/artists/' + hit.id)
            
    			})
    		}))      
    	}
    )
  };
};
