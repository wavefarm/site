var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')
var util = require('../lib/util')
var url = require('url')

module.exports = function () {
	
	// Noop if no .calendar
	var calendar = $('.calendar');
	if (!calendar.length) return;
	
	var pathname = url.parse(document.URL, true).pathname;
	
	// which calendar are we on? 
	var site = '';	// default/main site
	var subsiteRe = /\/(\w+)\/calendar/
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
			document.location.href=sitePath+'/calendar/'+d.format('YYYY-MM-DD');			
		},	
		showButtonPanel: true,
		stepMonths: 3,
	});
	
	
	// Add An Event button shows the form
	$('#add-event-button').click(function(){
		$('.add-event-div').toggle();
		$("#error_message").empty();
		$('#add-event-success').hide();
	});
	
	$( "#id_start_date" ).datepicker({
		nextText: ">",
		prevText: "<"
	});	
	$( "#id_end_date" ).datepicker({
		nextText: ">",
		prevText: "<"
	});	
	
	
	$("#add-event-form").validate({
		submitHandler: function(form) {
			
			data = $("#add-event-form").serializeArray();
			
			obj = new Object();
			for (i = 0; i < data.length; i++)
				obj[data[i].name] = data[i].value;
			
			// marshal dates from startDate,startTime,endDate,endTime 
			// to start, end with opitonal times			
			if (typeof(obj.startDate)!='undefined' && obj.startDate.length>0) {
				obj.start =  moment(obj.startDate).format('YYYY-MM-DDT');
				if (typeof(obj.startTime)!='undefined' && obj.startTime.length>0)
					obj.start = obj.start + obj.startTime;
			}
			if (typeof(obj.endDate)=='undefined' || obj.endDate.length==0)
				obj.endDate=obj.startDate;
			obj.end =  moment(obj.endDate).format('YYYY-MM-DDT');
			if (typeof(obj.endTime)!='undefined' && obj.endTime.length>0)
				obj.end = obj.end + obj.endTime;
			
			
			delete obj['startDate'];			
			delete obj['startTime'];			
			delete obj['endDate'];			
			delete obj['endTime'];			
			
			// mark the source, defaulting to wgxc
			obj.source = site=='ta'?'ta':'wgxc';

			json = JSON.stringify(obj);
			//console.log(json);
						
			$.ajax({
			  type: "POST",
			  url: "/api/add-event",
			  data: json,
			  success: function(data) {
					$("#error_message").empty();
					if(typeof(data.id)!='undefined') {
						console.log('Added User Event #'+data.id);
						// hide the form, reset it in case it gets shown again, 
						// show and scroll up to the the success message
						$('.add-event-div').hide();
						$("#add-event-form")[0].reset();
						$('#add-event-success').fadeIn(500);
						window.location.href="#add-event-success";
				} else {
					   $("#error_message").html('<p>'+data+'</p>')
					}
				},
		    contentType: "application/json",
		    dataType: 'json'		  
			});		
		}
	});	
	
	// add event submit
	$('#add-event-submit').click(function(){
		$("#add-event-form").submit();
	});
	

	
	var event = $('.event');
	var eventTemplate = event.clone();

	var ongoingEvents = $('.ongoing-events');
	var ongoingEventsTemplate = ongoingEvents.clone();

	var ongoingEventsEvent = ongoingEventsTemplate.find('.ongoing-event');
	var ongoingEventsEventTemplate = ongoingEventsEvent.clone();
	
	var date = moment();
	var daysToGet;
	
	var pathname = url.parse(document.URL, true).pathname;

	// change the start date if one was passed in URL
	var urlDateRe = /\w*\/calendar\/(\d{4}-\d{2}-\d{2})/
	var matches = urlDateRe.exec(pathname)
	if (matches!=null) {
		date = moment(matches[1],'YYYY-MM-DD');
		//alert(date.format('MM/DD/YYYY'));
		$( "#datepicker" ).datepicker( "setDate", date.format('MM/DD/YYYY') );
	}
	
	
	// run week starting today on page load
	renderWeek(date.format('MM/DD/YYYY'));

	function renderWeek(dateText) {
		
		// clear out any existing events
		 $('.calendar').html('');
		
		date = moment(dateText,'MM/DD/YYYY'); // This one will be changed for each get
		//var eventsToGet = 10;
		daysToGet = 7;
		
		renderDayOfEvents();
		
		$('#more').on('click', function () {
			daysToGet = 7;
			
			renderDayOfEvents();	
		});
							
	}
	
	
	function renderDayOfEvents () {
		
			var sites = '';
			if (site=='wgxc') sites = '%20sites:wgxc';
			else if (site=='ta') sites = '%20sites:transmissionarts';					
		
   		$.getJSON( '/api/search?q=type:event'+sites+'&sort=start&size=50&date='
   				+date.format('YYYY-MM-DD'), function( result ) {
   			
   			ongoingEventHits = [];
   			
	       $.each( result.hits, function( i, hit ) {

	        	var start = moment(hit.start);
	        		        	
	        	if (site=='' && util.isCommunityEvent(hit)) {
	        		// don't show community events on main site cal
	        	} else if (start.isBefore(date,'day')) {
		        	// save ongoing events that have already started
	        		ongoingEventHits[ongoingEventHits.length] = hit;
	        	}
	        	else {
	        	
	        		event = eventTemplate.clone();
	        		calendar.append(event);
			        renderEvent(event,hit);
	        	}	        	
	        });
	        
	        if (ongoingEventHits.length>0) {
	        	
		        ongoingEvents = ongoingEventsTemplate.clone();
		        calendar.append(ongoingEvents);
		        	        	
		        ongoingEvents.find('.weekday').html(date.format('dddd'));
		        ongoingEvents.find('.month').html(date.format('MMMM'));
		        ongoingEvents.find('.monthday').html(date.format('DD'));	        		        	
	        	
		        var first = true;
		        var eventList = ongoingEvents.find('.ongoing-events-list');
		        eventList.html('');
		        $.each( ongoingEventHits, function( i, hit ) {
		        			 
	            	ongoingEventsEvent = ongoingEventsEventTemplate.clone();
	            	eventList.append(ongoingEventsEvent);		
	            	
	            	if (i==ongoingEventHits.length-1)
	            		ongoingEventsEvent.find('.event-info').addClass('event-info-ongoing-last');
	            	
			        renderBasicEventInfo(ongoingEventsEvent,hit,true);
		        });
	        }
								
	        // And around again!
	        date = date.add(1, 'days');
	        if (--daysToGet > 0) renderDayOfEvents();		        

   		});  
	}
				
	function renderEvent(event,hit) {				
		var start = moment(hit.start);    	
		event.find('.weekday').html(start.format('dddd'));
		event.find('.month').html(start.format('MMMM'));
		event.find('.monthday').html(start.format('DD'));
		event.find('.time').html(util.formatStartDateTimes(hit));		
    renderBasicEventInfo(event,hit,false);
	}
	

	function renderBasicEventInfo(event,hit,isOngoing) {
			
		event.find('.item-dates strong').html( util.formatDates(hit));    		
    	
  	var name = event.find('.event-name');
  	name.find('a').html(hit.name);
  		
  	var location = event.find('.event-location');
  	if (typeof(hit.locations)!='undefined' && hit.locations.length>0) {  		
  		location.find('strong').html(hit.locations[0].main);
  		location.find('p').attr('class','location'+hit.locations[0].id);     		
  		$.getJSON( '/api/'+hit.locations[0].id, function( locationResult ) {
  			$('.location'+locationResult.id).html(util.formatLocationContactInfo(locationResult));
     	});    		    		
  	}	
    	     	   	
  	var shortDescription = event.find('.event-description-short');
  	var longDescription = event.find('.event-description-long');
    	    	
    // build the short-description
    	
		var hd = hit.briefDescription || '';
		hd = strip(hd);
		if (hd.length > 200) hd = hd.substr(0, 200) + '...';
		
		//hd = hd + '&nbsp;&nbsp;<a>+++&nbsp;more</a>';
		
		if (!isOngoing)
			shortDescription.find('p').html(hd);
			
  	// build the long-description
	
  	var hd = hit.briefDescription || '';
  	//hd = strip(hd);
  	longDescription.find('p').html(hd);
  	
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
    		
  
  	if (util.isCommunityEvent(hit)==true) {
    	event.find('.more').remove();
  	}
  	else {
  		
  		// fix up individual event page URL to handle links from
  		// main site calendar where subsite unknown
  		eventPath = sitePath;
  		if (eventPath=='') eventPath = util.getSubsitePath(hit);
  		
  		event.find('a.more').attr('href',eventPath+'/calendar/' + hit.id);  		
    	event.find('.more').on('click', function () {
    		document.location.href=$(this).attr('href');
    		return false;
    	});
    	
    
  	}
  	
  	var iconList = util.getIconList(hit);
  	$.each( iconList, function( iconIndex, iconSrc ) {
  			
  		var img = '<img src="'+iconSrc+'" alt="'+iconSrc+'" />';
      	event.find('.event-name').append(img);
  	});
  	
  	
  	// end render the event		
	}		
		
};