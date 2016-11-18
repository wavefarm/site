var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')
var util = require('../lib/util')
var url = require('url')

module.exports = function () {
	
	// Noop if no .calendar
	var calendar = $('.news-calendar');
	if (!calendar.length) return;
	
	var pathname = url.parse(document.URL, true).pathname;
	
	// which calendar are we on? 
	var site = '';	// default/main site
	var subsiteRe = /\/(\w+)\/newsroom/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}
	var sitePath = (site=='')?'':'/'+site;
				
	$( "#datepicker" ).datepicker({
		inline: true,
		numberOfMonths: [ 3, 1 ],
		onSelect: function(dateText) {
			//renderWeek(dateText);
			var d = moment(dateText,'MM/DD/YYYY');
			document.location.href=sitePath+'/newsroom/'+d.format('YYYY-MM-DD');			
		},	
		showButtonPanel: true,
		stepMonths: 3,
	});
	
	$( "#id_start_date" ).datepicker({
		nextText: ">",
		prevText: "<"
	});	
	$( "#id_end_date" ).datepicker({
		nextText: ">",
		prevText: "<"
	});	
	
	var event = $('.event');
	var eventTemplate = event.clone();
	
	var date = moment();
	var daysToGet;
	
	var pathname = url.parse(document.URL, true).pathname;

	// change the start date if one was passed in URL
	var urlDateRe = /\w*\/newsroom\/(\d{4}-\d{2}-\d{2})/
	var matches = urlDateRe.exec(pathname)
	if (matches!=null) {
		date = moment(matches[1],'YYYY-MM-DD');
		//alert(date.format('MM/DD/YYYY'));
		$( "#datepicker" ).datepicker( "setDate", date.format('MM/DD/YYYY') );
	}
	
	
	// run week starting today on page load
	renderDateRange(date.format('MM/DD/YYYY'),site);

	function renderDateRange(dateText,site) {
		
		// clear out any existing events
		 $('.news-calendar').html('');
		
		date = moment(dateText,'MM/DD/YYYY'); // This one will be changed for each get
		//var eventsToGet = 10;
		daysToGet = site=='ta'?14:7;
		
		renderDaysOfEvents();
		
		$('#more').on('click', function () {
			daysToGet = site=='ta'?14:7;
			
			renderDaysOfEvents();	
		});
							
	}
	
	
	function renderDaysOfEvents () {
		
			var sites = '';
			if (site=='wgxc') sites = '%20sites:wgxc';
			else if (site=='ta') sites = '%20sites:transmissionarts';					
		
			// want to search on a date range in DESC chron order, so
			// date2 is the passed target date and date is X days earlier
			// date range is inclusive, so to get 7 days substract 6
			var date2 = moment(date);
      date = date.add(-daysToGet+1, 'days');
			
			//console.log('/api/search?q=type:news'+sites+'&sort=-date&size=300&date='
   		//		+date.format('YYYY-MM-DD')+'&date2='
   		//		+date2.format('YYYY-MM-DD'));
			
   		$.getJSON( '/api/search?q=type:news'+sites+'&sort=-date&size=300&date='
   				+date.format('YYYY-MM-DD')+'&date2='
   				+date2.format('YYYY-MM-DD'), function( result ) {

	       $.each( result.hits, function( i, hit ) {
        		event = eventTemplate.clone();
        		calendar.append(event);
		        renderEvent(event,hit);
	        });
	        								
	       	// setup the next chunk to start in the preceeding day
	        date = date.add(-1, 'days');
   		});  
	}
				
	function renderEvent(event,hit) {				
		var start = moment(hit.date);    	
		event.find('.weekday').html(start.format('dddd'));
		event.find('.month').html(start.format('MMMM'));
		event.find('.monthday').html(start.format('DD'));
		event.find('.time').html(util.formatDateTimes(hit));		
    renderBasicEventInfo(event,hit);
	}
	

	function renderBasicEventInfo(event,hit) {
			
	  var date = moment(hit.date);			
		event.find('.item-dates strong').html( date.format('MMM D, YYYY h:mm a')+' &bull; '+hit.author);
		    	
  	var name = event.find('.event-name');
  	name.find('a').html(hit.main);
  		
  	var location = event.find('.event-location');
  	if (typeof(hit.locations)!='undefined' && hit.locations.length>0) {  		
  		location.find('strong').html(hit.locations[0].main);
  		location.find('p').attr('id','location'+hit.locations[0].id);     		
  		$.getJSON( '/api/'+hit.locations[0].id, function( locationResult ) {
  			$('#location'+locationResult.id).html(util.formatLocationContactInfo(locationResult));
     	});    		    		
  	}	
    	     	   	
  	var shortDescription = event.find('.event-description-short');
  	var longDescription = event.find('.event-description-long');
  	var fullDescription = hit.description || '';
    	    	
		// extract any .mp3 URLs that need to be turned into players
  	
		var mp3Url = false;		
		var mp3Re = /\n(https?:\/\/.+\.mp3)/
  	var matches = mp3Re.exec(fullDescription)
  	if (matches!=null) {	
  		mp3Url = matches[1];
  		fullDescription = fullDescription.replace(mp3Re,'');
  	}
  	  	
    // build the short-description
		var hd = fullDescription || '';
		hd = strip(hd);		
		if (hd.length > 200) hd = hd.substr(0, 200) + '...';
		shortDescription.find('p').html(hd);
			
  	// build the long-description	
  	var hd = fullDescription|| '';
  	//hd = strip(hd);
  	longDescription.find('p').html(hd);

  	// populate mp3 player
  	if (mp3Url) {	
    	var audioTag = longDescription.find('audio');
    	audioTag.find('source').attr('src',matches[1]);  	  		
  	}
  	else {
  		longDescription.find('audio').remove();    	
  	}
  	
  	if (typeof(hit.url)!='undefined' && hit.url.length>0) {
    	var link = longDescription.find('div.url a');
    	link.attr('href',hit.url);
    	link.html(hit.url);  		
  	}
  	    	
  	if (typeof(hit.image)!='undefined' && hit.image.length>0) {

  		var image = hit.image[0];
  		longDescription.find('img').attr('class','image'+image.id);
  		/*
   		$.getJSON( '/api/'+image.id, function( imageResult ) {
   			$('.image'+imageResult.id).each(
   					function() { $( this).attr('src',imageResult.url); }
   				);
   		});
   		*/
	    	
    }
    else {
    		longDescription.find('img').remove();
    }
    	
  	event.find('h3').on('click', function () {

    	// load the image on click if there is one
    	var img = $(this).parent().find('.event-description-long img');
    	if (img.length>0 && typeof($(img).attr('src'))=='undefined') {
    		var id = $(img).attr('class');
    		id = id.substring(5);
    		
     		$.getJSON( '/api/'+id, function( imageResult ) {
     			$('.image'+imageResult.id).each(
     					function() { $( this).attr('src',imageResult.url); }
     				);
     		});
    	}
    	
			shortDescription.toggle();
			longDescription.toggle();
		});						
    		
		// fix up individual event page URL to handle links from
		// main site calendar where subsite unknown
  	/*
		eventPath = sitePath;
		if (eventPath=='') eventPath = util.getSubsitePath(hit);		
		event.find('a.more').attr('href',eventPath+'/newsroom/' + hit.id);
		*/
		event.find('a.more').attr('href',itemUrl(hit));
  	event.find('.more').on('click', function () {
  		document.location.href=$(this).attr('href');
  		return false;
  	});
  	  	
  	// show icons on main site newsroom only
  	if (sitePath=='') {
	  	var iconList = util.getIconList(hit);
	  	$.each( iconList, function( iconIndex, iconSrc ) {
	  			
	  		var img = '<img src="'+iconSrc+'" alt="'+iconSrc+'" />';
	      	event.find('.event-name').append(img);
	  	});  	
  	}
    	  	  	
  	// end render the event		
	}		
		
};