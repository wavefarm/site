var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')


module.exports = function () {

	
	// Noop if no .calendar
	var calendar = $('.calendar');
	if (!calendar.length) return;
	
	$( "#datepicker" ).datepicker({
		inline: true,
		numberOfMonths: [ 3, 1 ],
		onSelect: function(dateText) {
			renderWeek(dateText);
		},		
	});

	
	var event = $('.event');
	var eventTemplate = event.clone();
	var now = moment();

	/*
	var now = moment();
	var date = moment(); // This one will be changed for each get
	//var eventsToGet = 10;
	var daysToGet = 7;
	var first = true;
	*/
	
	var now;
	var date;
	var daysToGet;
	var first;
	
	// run week starting today on page load
	renderWeek(now.format('MM/DD/YYYY'));

	function renderWeek(dateText) {
		
		// clear out any existing events
		 $('.calendar').html('');
		
		now = moment(dateText);
		date = moment(dateText); // This one will be changed for each get
		//var eventsToGet = 10;
		daysToGet = 7;
		first = true;
		
		renderDayOfEvents();
		
		$('#more').on('click', function () {
			daysToGet = 7;
			
			renderDayOfEvents();	
		});
							
	}
	
	
	
	function renderDayOfEvents () {
		
   		$.getJSON( '/api/search?q=type:event&sort=start&date='+date.format('YYYY-MM-DD'), function( result ) {
   			
   			ongoingEvents = [];
   			
	        $.each( result.hits, function( i, hit ) {

	        	var startDate = moment(hit.startDate);
	        		        	
	        	// save ongoing events that have already started
	        	if (startDate.diff(date,'days')<0) {
	        		ongoingEvents[ongoingEvents.length] = hit;
	        	}
	        	else {
	        	
			        if (first) {
						first = false;
			        } else {
			          event = eventTemplate.clone();
			          calendar.append(event);
			        }

			        renderEvent(event,hit);
	        	}
	        	
			});

	        
	        if (ongoingEvents.length>0) {
		        if (first) {
					first = false;
		        } else {
		          event = eventTemplate.clone();
		          calendar.append(event);
		        }
		        renderOngoingEvents(event,ongoingEvents,date);
			}
				
				
	        // And around again!
	        date = date.add(1, 'days');
	        if (--daysToGet > 0) renderDayOfEvents();		        

   		});

        
	}
				

	
	function renderEvent(events,hit) {
		
		
    	var startDate = moment(hit.startDate);

    	// render the event
    	
        //event.find('.tag').html('ON');
    	event.find('.weekday').html(startDate.format('dddd'));
        event.find('.month').html(startDate.format('MMMM'));
    	event.find('.monthday').html(startDate.format('DD'));
		event.find('.time').html('');
		
    	if (!hit.allDay) {
    		var startTime = moment(hit.startDate + 'T'+ hit.startTime+'.000');
    		var endTime = moment(hit.endDate + 'T'+ hit.endTime+'.000');	
    		var timeDesc;
    		if (startTime.format('mm')!=0)
    			timeDesc = startTime.format('h:mm a');
    		else
    			timeDesc = startTime.format('ha');
    		
    		if (endTime.format('m')!='0')
    			timeDesc = timeDesc + ' - ' + endTime.format('h:mm a');
    		else
    			timeDesc =  timeDesc + ' - ' + endTime.format('ha');
    		
    		event.find('.time').html(timeDesc);
    	}			

    	var name = event.find('.event-name');
    	name.find('a').html(hit.name);
    	
    	var shortDescription = event.find('.event-description-short');
    	var longDescription = event.find('.event-description-long');

    	
    	
    	
    	// build the short-description
    	
		var hd = hit.briefDescription || '';
		hd = strip(hd);
		if (hd.length > 200) hd = hd.substr(0, 200) + '...';
		
		//hd = hd + '&nbsp;&nbsp;<a>+++&nbsp;more</a>';
		
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
    	
    	event.on('click', function () {
			shortDescription.toggle();
			longDescription.toggle();
		});						
    		
    	
    	event.find('.more').on('click', function () {
    		location.href='/wgxc/calendar/' + hit.id;
    		return false;
    	});
    	
    	

    	var eventIconUL = event.find('.event-icons ul');
        $.each( hit.sites, function( siteIndex, site ) {
        	var li = '<li><img src="';
    		if (site=='wgxc')
        		li = li + '/images/wgxc-icon.png';
    		else if (site=='transmissionarts')
        		li = li + '/images/ta-icon.png';
    		else if (site=="mediaartsgrant")
        		li = li + '/images/mag-icon.png';
    		li = li + '" alt="'+site+'" ></li>';
    		eventIconUL.append(li);
        });
        
        
        // end render the event		
		
		
	}	
	
	
	function renderOngoingEvents(event,hits,startDate) {
				
        event.find('.tag').html('CONTINUING');
    	event.find('.weekday').html(startDate.format('dddd'));
        event.find('.month').html(startDate.format('MMMM'));
    	event.find('.monthday').html(startDate.format('DD'));


    	var name = event.find('.event-name');
    	name.find('a').html('Ongoing Events');
    	//name.find('a').attr('href','/wgxc/calendar/'+hit.id);
    	
    	var shortDescription = event.find('.event-description-short');
    	//var longDescription = event.find('.event-description-long');

    	sd = ''; 
    	
        $.each( hits, function( i, hit ) {
    	
        	sd += '<p><a href="/wgxc/calendar/' + hit.id+'">'+ hit.name+'</a></p>';
        });
    	shortDescription.find('p').html(sd);
        	    	
        // end render the event		
		
		
	}	
	
};