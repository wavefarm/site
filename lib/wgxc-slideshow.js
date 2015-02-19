module.exports = function () {
	
	var slideshow = $('.wgxc-slideshow');
	
	//Do nothing on pages without the slideshow
	if (!slideshow) return;
	
	var frequency = 5000;
	
	setTimeout(function() {
		updateSlideshow();
	}, frequency);	
	
	
	var currentIndex = 0;
	var size = slideshow.children().length;
	
	function updateSlideshow() {
		
		$('#slide-'+currentIndex).css('display','none');
		currentIndex = (currentIndex+1)%size;
		$('#slide-'+currentIndex).css('display','block');	
		
		setTimeout(function() {
			updateSlideshow();
		}, frequency);	
		
	}
	
	
};
