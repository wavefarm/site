var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')
var wgxc = require('../lib/wgxc')
var url = require('url')

module.exports = function () {
	
	// Noop if no .calendar
	var calendar = $('.calendar');
	if (!calendar.length) return;
	
	$( "#datepicker" ).datepicker({
		inline: true,
		numberOfMonths: [ 3, 1 ],
		onSelect: function(dateText) {
			//renderWeek(dateText);
			var d = moment(dateText,'MM/DD/YYYY');
			document.location.href='/wgxc/calendar/'+d.format('YYYY-MM-DD');
			
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
			
			$data = $("#add-event-form").serializeArray();
			$json = JSON.stringify($data);

			/*
			$.post("/api/add-event",$json, function(data) {
				$("#error_message").empty();
				if(data=="OK"){
					$("#add-event-form").reset();
					$('#add-event-form').hide();
					$('#add-event-success').fadeIn(500);
				} else {
				   $("#error_message").html('<p>'+data+'</p>')
				}
			});
			*/
			// hide the form, reset it in case it gets shown again, 
			// show and scroll up to the the success message
			$('.add-event-div').hide();
			$("#add-event-form")[0].reset();
			$('#add-event-success').fadeIn(500);
			window.location.href="#add-event-success";
			
			
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
	var urlDateRe = /\/wgxc\/calendar\/(\d{4}-\d{2}-\d{2})/
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
		
   		$.getJSON( '/api/search?q=type:event%20sites:wgxc&sort=start&date='+date.format('YYYY-MM-DD'), function( result ) {
   			
   			ongoingEventHits = [];
   			
	        $.each( result.hits, function( i, hit ) {

	        	var startDate = moment(hit.startDate);
	        		        	
	        	// save ongoing events that have already started
	        	if (startDate.diff(date,'days')<0) {
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
				
    	var startDate = moment(hit.startDate);
    	
    	event.find('.weekday').html(startDate.format('dddd'));
        event.find('.month').html(startDate.format('MMMM'));
    	event.find('.monthday').html(startDate.format('DD'));
		event.find('.time').html(wgxc.formatTimes(hit));
		
    	renderBasicEventInfo(event,hit,false);
	}
	

	

	function renderBasicEventInfo(event,hit,isOngoing) {
		
	
		event.find('.event-dates strong').html( wgxc.formatDates(hit));    		
    	
    	var name = event.find('.event-name');
    	name.find('a').html(hit.name);
    		
    	var location = event.find('.event-location');
    	if (typeof(hit.locations)!='undefined' && hit.locations.length>0) {
    		
    		location.find('strong').html(hit.locations[0].main);
    		location.find('p').attr('id','location'+hit.locations[0].id);
       		
    		$.getJSON( '/api/'+hit.locations[0].id, function( locationResult ) {

    			var locationAddress = $('#location'+locationResult.id);
    			locationAddress.html(locationResult.address);
       			if (typeof(locationResult.city)!='undefined') {
       				locationAddress.append('&nbsp;|&nbsp;');
       				locationAddress.append(locationResult.city + ', ' + locationResult.state);
           			if (typeof(locationResult.postalCode)!='undefined') {
           				locationAddress.append(' ' + locationResult.postalCode);
           			}
       			}
       			if (typeof(locationResult.phone)!='undefined') {
       				locationAddress.append('&nbsp;|&nbsp;');
       				locationAddress.append(locationResult.phone);
       			}
       			
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
    	    	
    	if (typeof(hit.image)!='undefined') {
	        $.each( hit.image, function( imageIndex, image ) {
	
	        	if (image.main.indexOf('logo')!=-1) {
	        		
	        		longDescription.find('img').attr('id','image'+image.id);
	           		$.getJSON( '/api/'+image.id, function( imageResult ) {
	           			$('#image'+imageResult.id).attr('src',imageResult.url);
	           		});
	        	}
	        });
	    	
		}
    	else {
    		longDescription.find('img').remove();
    	}
    	
    	event.on('click', function () {
			shortDescription.toggle();
			longDescription.toggle();
		});						
    		
    
    	if (isCommunityEvent(hit)==true) {
	    	event.find('.more').remove();
    	}
    	else {
	    	event.find('.more').on('click', function () {
	    		document.location.href='/wgxc/calendar/' + hit.id;
	    		return false;
	    	});
    	}
    	
    	var iconList = wgxc.getIconList(hit);
    	$.each( iconList, function( iconIndex, iconSrc ) {
    			
    		var img = '<img src="'+iconSrc+'" alt="'+iconSrc+'" />';
        	event.find('.event-name').append(img);
    	});
    	
    	
    	/*
    	var eventIconUL = event.find('.event-icons ul');
    	eventIconLiTemplate = eventIconUL.find('li').clone();
    	eventIconUL.html('');
        
    	var iconList = wgxc.getIconList(hit);

    	$.each( iconList, function( iconIndex, iconSrc ) {
    	
			var eventIconLi = eventIconLiTemplate.clone();
    		eventIconUL.append(eventIconLi);
    		eventIconLi.find('img').attr('src',iconSrc);
    		eventIconLi.find('img').attr('alt',iconSrc);    			
    		
    	});
    	*/
        // end render the event		
	}		
		
	function isCommunityEvent(hit) {
		for (i = 0; i < hit.categories.length; i++) {
			if (hit.categories[i].indexOf('Community Calendar Event')!=-1)
				return true;
		}
		return false;
	}
	
};