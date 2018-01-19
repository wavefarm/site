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
				  'width=350, height=1350, toolbar=no, menubar=no, location=no, directories=0, status=0,scrollbar=0,resize=0');
		  return false;
	  });    
	  
	  
	  // deal with nowPlaying and upNext via wgxc schedule if they are present
	  
	  var wgxcListenNowplaying = $('.wgxc .listen-nowplaying');
	  var wfListenNowplaying = $('.wf .listen-nowplaying');
	  var partnerStreamListDiv = $('.partner-stream-list');
	  if (!wgxcListenNowplaying.length && !wfListenNowplaying.length && !partnerStreamListDiv.length) return;
	  	  
	  updateNowPlaying();
	  	  	  
	  function updateNowPlaying() {
		  
		  if (wgxcListenNowplaying.length) {
			  getAndShowNowPlayingResults('wgxc');
		  }
		  if (wfListenNowplaying.length) {
			  getAndShowNowPlayingResults('wf');
		  }
		  updatePartnerStreams();
	  	
		  setTimeout(function() {
			  updateNowPlaying();
		  }, 300000);		  
	  }	 	  

	  function updatePartnerStreams(station) {
		  		  
		  var partnerStreamListDiv = $('.partner-stream-list');

		  var streamTemplateDiv = $('#partner-stream-template');
		  streamTemplateDiv.hide(0);
		  
		  //var partnerIcecastStatusUrl = 'http://partneraudio.wavefarm.org:8000/status-json.xsl'
		  var partnerIcecastStatusUrl = '/partneraudio/status'

		  $.getJSON( partnerIcecastStatusUrl, function( result ) {	
			  if (!result || !result.icestats || !result.icestats.source) {
				  partnerStreamListDiv.hide();
				  return;
			  }
			  partnerStreamListDiv.show();			  
			  var streams = result.icestats.source
			  // hack for Icecast JSON when there is only one stream (it's an object, not an array)
			  if (streams.server_name) {
				  streams = [streams];
			  }			  
			  // keep track of current streams so we can remove old ones below
			  var validStreamIds = ['partner-stream-template'];			  
			  for (i=0; i<streams.length; i++) {				  
				  var stream = streams[i];
				  stream.id = stream.listenurl.replace(/\W/g, '');				  
				  validStreamIds.push(stream.id);				  
				  streamDiv = $('#'+stream.id);
				  if (!streamDiv.length) {
					streamDiv = streamTemplateDiv.clone();
					partnerStreamListDiv.append(streamDiv);
					streamDiv.attr('id',stream.id);
					streamDiv.find('audio source').attr('src',stream.listenurl);
					streamDiv.find('audio').load();				  
					if (stream.listenurl.indexOf('/ta/')) {
						//streamDiv.find('img').attr('src','/images/ta-icon.png');
						streamDiv.find('img').remove()
					}
					else if (stream.listenurl.indexOf('/wgxc/')) {
						streamDiv.find('img').attr('src','/images/wgxc-icon.png');
					}
					streamDiv.show();
				  }
				  // always update the title and description
				  streamDiv.find('h1').html(stream.server_name);
				  streamDiv.find('.listen-contact').html(stream.server_description);
			  }			  			  
			  $('.listen-wf-partner-stream').each(function( index ) {
				  if (validStreamIds.indexOf($( this ).attr('id')) < 0) {
					  $(this).remove();
				  }
			  });			  
		  });
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
		  
		  var defaultText = 'From the Archives'
		  	
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
			  	//listenNowplaying.hide();
				  listenNowplaying.find('a').html(defaultText);
				  listenNowplaying.find('a').attr('href',broadcastBaseUrl);
				  listenNowplaying.show();
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
			  	//listenUpnext.hide();
			  	listenUpnext.find('a').html(defaultText);
			  	listenUpnext.find('a').attr('href',broadcastBaseUrl);
			  	listenUpnext.show();
			  	
			  }
		  }
	  }
};
