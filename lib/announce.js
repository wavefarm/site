var moment = require('moment')
var strip = require('strip')
var url = require('url')

module.exports = function () {
	
	  var announce = $('.announce');
	  if (!announce.length) return;
	  
	  
	  // .announce turned off in .css by defualt
	  
		var pathname = url.parse(document.URL, true).pathname;
		
		if (pathname.indexOf('/wgxc')==0) {
		
			// turn it on for /wgxc
			$( ".announce" ).css('display','block');

			// close it unless we're on /wgxc home
		  var open = pathname==='/wgxc';
		  
			$( ".announce" ).css('right',open?-20:-290);
			$( ".outer-announce-container" ).css('width',open?300:30);
		  		  
		  $( ".announce" ).on('click', function() {
		    open = !open;
		    if (open)
		    	$( ".outer-announce-container" ).css('width',300);		    
		    $( ".announce" ).animate({
		      right: open?"-20":"-290",
		    }, 250, function() {
			    if (!open)
			    	$( ".outer-announce-container" ).css('width',30);		    
		    });
		  });   
		}	  
};