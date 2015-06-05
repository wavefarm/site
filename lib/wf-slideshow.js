var util = require('../lib/util')

module.exports = function () {
	
	var slideshow = $('.wf-slideshow');
		
	//Do nothing on pages without the slideshow
	if (!slideshow.length) return;
		
	// index.html contains 3 default slides which 
	// will get replaced with featured content
	// as available.
	
	// featured conten is inserted at top of list
	var appendAfter = $('#wf-slideshow-prev');
	
	var site = 'wgxc';
	if (location.pathname.indexOf('/ta')===0)
		site = 'ta';
	
	$.getJSON( '/api/'+site+'/index-gallery', function( results ) {
	
		// insert the content		    
	  var slideTemplate = $('.slide').first().clone();

	  // TODO: possible secondary sort on results.hits
    
    $.each( results.hits, function( i, hit ) {
    	
    	slide = slideTemplate.clone();
    	
      slide.css('display','none');
      slide.css('background-image',"url('"+hit.featuredImage+"')");
      slide.find('.slide-credit').html(hit.featuredImageCredit||'');
      if (!hit.featuredImageCredit)
      	slide.find('.slide-credit').css('display','none');
      
      // TODO: handle TA events as well as WGXC events
      var url = '';
      if (hit.type=='event') url = '/wgxc/calendar/'+hit.id;
      if (hit.type=='broadcast') url = '/wgxc/schedule/'+hit.id;
      slide.attr('href',url);
      
      var info = hit.main;
      
      if (hit.type=='event') {      	
      	if (typeof(hit.locations)!='undefined' && hit.locations.length>0)      		
      		info += ', ' + hit.locations[0].main;
      	if (typeof(hit.startDate)!='undefined' || typeof(hit.start)!='undefined')      		
      		info += ', ' + util.formatDates(hit);
      }
      else if (hit.type=='broadcast') {
      	if (typeof(hit.shows)!='undefined' && hit.shows.length>0)      		
      		info = hit.shows[0].main + ": " + info;
      	if (typeof(hit.start)!='undefined')      		
      		info += ', ' + util.formatDates(hit);
      }
      
      slide.find('.slide-info').html(info);
      
      appendAfter.after(slide);    	
    	
    });	
    
    startSlideshow();
	});
    
		
	// vars to control slide show
	var auto = true;
	var turnOffAutoOnNextPrev = true;
	var frequency = 5000;
	var currentIndex = 0;
	var size;
		
	function startSlideshow() {

		size = slideshow.find('a').length;
		
		// remove defaults as indicated by number of dynamic bits
		var numToShow = size-3;
		if (numToShow<3) numToShow = 3;
		
		// remove any unneeded default slides
		slideshow.find('.slide:gt(' + (numToShow-1) + ')' ).remove();

		// update size
		size = slideshow.find('a').length;

		// number them via id
	  $('.slide').each(function(index,value){
	  	$(value).attr('id','slide-'+index);
	  	$(value).css('display',(index==0)?'block':'none');
	  });

	  $( "#wf-slideshow-prev").click(function() {
			if (turnOffAutoOnNextPrev)
				auto=false;
			showSlide((currentIndex+size-1)%size);
		});
		$( "#wf-slideshow-next").click(function() {
			if (turnOffAutoOnNextPrev)
				auto=false;
			showSlide((currentIndex+1)%size);
		});
	
		// start the slideshow
		setTimeout(function() {
			updateSlideshow();
		}, frequency);
			
	
	}
		
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
