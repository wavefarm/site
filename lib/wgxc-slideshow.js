module.exports = function () {
	
	var slideshow = $('.wgxc-slideshow');
	
	//Do nothing on pages without the slideshow
	if (!slideshow) return;

	var auto = true;
	var turnOffAutoOnNextPrev = true;
	var frequency = 5000;
	var currentIndex = 0;
	var size = slideshow.find('a').length;
	
	$( "#wgxc-slideshow-prev").click(function() {
		if (turnOffAutoOnNextPrev)
			auto=false;
		showSlide((currentIndex+size-1)%size);
	});
	$( "#wgxc-slideshow-next").click(function() {
		if (turnOffAutoOnNextPrev)
			auto=false;
		showSlide((currentIndex+1)%size);
	});

	// start the slideshow
	setTimeout(function() {
		updateSlideshow();
	}, frequency);
		
	function updateSlideshow() {
		if (!auto)
			return;
		showSlide((currentIndex+1)%size);		
		setTimeout(function() {
			updateSlideshow(true);
		}, frequency);
	}
	
	function showSlide(slideIndex) {
		slideshow.find('a').css('display','none');	
		$('#slide-'+slideIndex).css('display','block');	
		currentIndex = slideIndex;
	}
	
	
	
};
