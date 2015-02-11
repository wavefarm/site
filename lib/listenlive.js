module.exports = function () {
	  var open = false;
	  $( ".listen" ).click(function() {
	    open = !open;
	    $( ".listen" ).animate({
	      left: open?"-20":"-300",
	    }, 250, function() {
	      // Animation complete.
	    });
	  });        
};