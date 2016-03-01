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
		  window.open('/listen','newwindow',
				  'width=350, height=540, toolbar=no, menubar=no, location=no, directories=0, status=0,scrollbar=0,resize=0');
		  return false;
	  });    
	  $(".listen-wf-window").on('click', function() {
		  window.open('/listen','newwindow',
				  'width=350, height=740, toolbar=no, menubar=no, location=no, directories=0, status=0,scrollbar=0,resize=0');
		  return false;
	  });    
	  
	  
	  // deal with nowPlaying and upNext via wgxc schedule if they are present
	  
	  var wgxcListenNowplaying = $('.wgxc .listen-nowplaying');
	  var wfListenNowplaying = $('.wf .listen-nowplaying');
	  if (!wgxcListenNowplaying.length && !wfListenNowplaying.length) return;
	  	  
	  updateNowPlaying();
	  	  	  
	  function updateNowPlaying() {
		  
	  	getAndShowNowPlayingResults('wgxc');
	  	getAndShowNowPlayingResults('wf');
	  	
		  setTimeout(function() {
			  updateNowPlaying();
		  }, 300000);		  
	  }	 	  

	  
	  function getAndShowNowPlayingResults(station) {
	  	
		  // leave this local time and then convert broadcast times to local (for comparison only)
		  var now = moment();
		  var yesterday = moment();
		  var tomorrow =  moment();
		  yesterday.add(-1,'days');
		  tomorrow.add(1,'days');
		  		  	
	  	var scheduleBaseUrl;
	  	if (station=='wgxc') {
	  		scheduleBaseUrl = '/api/wgxc/schedule/';
	  	}
	  	else if (station=='wf') {
	  		scheduleBaseUrl = '/api/ta/schedule/';
	  	}
	  		  	
	  	if (scheduleBaseUrl) {	  		
			  var hits = [];	  		
			  $.getJSON( scheduleBaseUrl+yesterday.format('YYYY-MM-DD'), function( result ) {	
				  if (typeof(result.hits)!='undefined')
				  	hits = hits.concat(result.hits);			  
				  $.getJSON( scheduleBaseUrl+now.format('YYYY-MM-DD'), function( result ) {				  
					  if (typeof(result.hits)!='undefined')
					  	hits = hits.concat(result.hits);				  
					  $.getJSON( scheduleBaseUrl+tomorrow.format('YYYY-MM-DD'), function( result ) {					  
						  if (typeof(result.hits)!='undefined')
						  	hits = hits.concat(result.hits);					  	
						  showNowPlayingResults(station,hits,now);						  
					  });				  
				  });			  
			  });
	  	}
	  }
	  
	  function showNowPlayingResults(station,hits,now) {
	  	
		  var nowPlaying = null;
		  var upNext = null;;

		  for (i=0; i<hits.length; i++) {
			  
		  	var offset = now.isDST()?'-04:00':'-05:00';
			  var startLocal = moment.parseZone(hits[i].start+offset).local();
			  var endLocal = moment.parseZone(hits[i].end+offset).local();
			  
			  // filter out broadcasts that last more than one day...
			  if (endLocal.diff(startLocal,'days')<=1) {
				  if (now.diff(startLocal)>=0 && now.diff(endLocal)<=0 ) {
				  	
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
		  					  	
		  if (station=='wgxc') {
			  var listenNowplaying = $('.wgxc .listen-nowplaying');
			  var listenUpnext = $('.wgxc .listen-upnext');					  
			  var broadcastBaseUrl = '/wgxc/schedule/';
		  }
		  else if (station=='wf') {
			  var listenNowplaying = $('.wf .listen-nowplaying');
			  var listenUpnext = $('.wf .listen-upnext');					  
			  var broadcastBaseUrl = '/ta/schedule/';
		  }
		  					  
		  if (listenNowplaying) {
			  if (nowPlaying!=null) {
				  if (typeof(nowPlaying.shows)!='undefined')
					  listenNowplaying.find('a').html(nowPlaying.shows[0].main +': '+nowPlaying.main);
				  else
					  listenNowplaying.find('a').html(nowPlaying.main);
				  listenNowplaying.find('a').attr('href',broadcastBaseUrl+nowPlaying.id);
				  listenNowplaying.show();
			  }
			  else {
			  	listenNowplaying.hide();
			  }
		  }
		  
		  if (listenUpnext) {
			  if (upNext!=null) {
				  if (typeof(upNext.shows)!='undefined')
					  listenUpnext.find('a').html(upNext.shows[0].main+': '+upNext.main);
				  else
					  listenUpnext.find('a').html(upNext.main);
				  listenUpnext.find('a').attr('href',broadcastBaseUrl+upNext.id);
				  listenUpnext.show();
			  }
			  else {
			  	listenUpnext.hide();
			  }
		  }
	  }
};