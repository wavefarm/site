var moment = require('moment')
var strip = require('strip')

module.exports = function () {
	
	  var listen = $('.listen');
	  if (!listen.length) return;
	
	  // disable sliding for pop-out
	  if (!listen.hasClass('pop-out')) {	  
		  var open = false;
		  $( ".listen" ).on('click', function() {
		    open = !open;
		    $( ".listen" ).animate({
		      left: open?"-20":"-300",
		    }, 250, function() {
		      // Animation complete.
		    });
		  });    
	  }
	  
	  $(".listen-wgxc-window").on('click', function() {
		  window.open('/listen/wgxc','newwindow',
				  'width=350, height=540, toolbar=no, menubar=no, location=no, directories=0, status=0,scrollbar=0,resize=0');
		  return false;
	  });    
	  $(".listen-wf-window").on('click', function() {
		  window.open('/listen/wfro','newwindow',
				  'width=350, height=540, toolbar=no, menubar=no, location=no, directories=0, status=0,scrollbar=0,resize=0');
		  return false;
	  });    
	  

	  
	  
	  // deal with nowPlaying and upNext via wgxc schedule if they are present
	  
	  var listenNowplaying = $('.listen-nowplaying');
	  if (!listenNowplaying.length) return;
	  	  
	  updateNowPlaying();
	  	  	  
	  function updateNowPlaying() {
		  
		  //console.log('updateNowPlaying()');
		  
		  // leave this local time and then convert broadcast times to local (for comparison only)
		  var now = moment();
		  var yesterday = moment();
		  var tomorrow =  moment();
		  yesterday.add(-1,'days');
		  tomorrow.add(1,'days');
		  
		  
		  // build up three days of schedule (due to show's time zones and shows that span days, etc)
		  var hits = [];
		  
		  
		  $.getJSON( '/api/wgxc/schedule/'+yesterday.format('YYYY-MM-DD'), function( result ) {
	
			  if (typeof(result.hits)!='undefined')
				  hits = hits.concat(result.hits);
			  
			  $.getJSON( '/api/wgxc/schedule/'+now.format('YYYY-MM-DD'), function( result ) {
				  
				  if (typeof(result.hits)!='undefined')
					  hits = hits.concat(result.hits);
				  
				  $.getJSON( '/api/wgxc/schedule/'+tomorrow.format('YYYY-MM-DD'), function( result ) {
					  
					  if (typeof(result.hits)!='undefined')
						  hits = hits.concat(result.hits);
	
					  var nowPlaying = null;
					  var upNext = null;;
	
					  for (i=0; i<hits.length; i++) {
						  
					  	var offset = now.isDST()?'-04:00':'-05:00';
						  var startLocal = moment.parseZone(hits[i].start+offset).local();
						  var endLocal = moment.parseZone(hits[i].end+offset).local();
						  
						  // filter out broadcasts that last more than one day...
						  if (endLocal.diff(startLocal,'days')<=1) {
							  if (now.diff(startLocal)>=0 && now.diff(endLocal)<=0 ) {
							  	
							  	console.log(now);
							  	console.log(startLocal);
							  	console.log(endLocal);
							  	console.log(now.diff(startLocal));
							  	console.log(now.diff(endLocal));
							  	
								  nowPlaying = hits[i];
								  if (hits.length>i+1)
									  upNext = hits[i+1];
								  break;
							  }
							  else if (now.diff(startLocal)<0 ) {
								  // we did not find a now playing
								  nowPlaying = null;
								  upNext = hits[i];
								  break;
							  }
						  }
					  }
					  					  		  
					  if (nowPlaying!=null) {
						  if (typeof(nowPlaying.shows)!='undefined')
							  $('.listen-nowplaying a').html(nowPlaying.shows[0].main +': '+nowPlaying.main);
						  else
							  $('.listen-nowplaying a').html(nowPlaying.main);
						  $('.listen-nowplaying a').attr('href','/wgxc/schedule/'+nowPlaying.id);
						  $('.listen-nowplaying').show();
					  }
					  else {
						  $('.listen-nowplaying').hide();
					  }
					  
					  if (upNext!=null) {
						  if (typeof(upNext.shows)!='undefined')
							  $('.listen-upnext a').html(upNext.shows[0].main+': '+upNext.main);
						  else
							  $('.listen-upnext a').html(upNext.main);
						  $('.listen-upnext a').attr('href','/wgxc/schedule/'+upNext.id);
						  $('.listen-upnext').show();
					  }
					  else {
						  $('.listen-upnext').hide();
					  }				  
					  
				  });				  
			  });			  
		  });
		  		  
		  setTimeout(function() {
			  updateNowPlaying();
		  }, 300000);		  
	  }	 	  
};