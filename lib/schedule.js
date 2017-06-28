var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')
var strip = require('strip')
var url = require('url')

module.exports = function () {
  // Noop if no .schedule
  var schedule = $('.schedule');
  if (!schedule.length) return;
  
  
	var pathname = url.parse(document.URL, true).pathname;
	
	// which schedule are we on? 
	var site = '';	// default
	var subsiteRe = /\/(\w+)\/schedule/
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
			//renderDate(dateText);
			var d = moment(dateText,'MM/DD/YYYY');
			document.location.href=sitePath+'/schedule/'+d.format('YYYY-MM-DD');
		},	
		showButtonPanel: true,
		stepMonths: 3,
	});
  
  
  var now = moment();
  var date = moment(); // This one will be changed for each get

  // change the start date if one was passed in URL
  //var urlDateRe = /\/wgxc\/schedule\/(\d{4}-\d{2}-\d{2})/
  var urlDateRe = /\w*\/schedule\/(\d{4}-\d{2}-\d{2})/
  var matches = urlDateRe.exec(pathname)
  if (matches!=null) {
	  date = moment(matches[1],'YYYY-MM-DD');
	  //alert(date.format('MM/DD/YYYY'));
	  $( "#datepicker" ).datepicker( "setDate", date.format('MM/DD/YYYY') );
  }
  
  // Grab .day as a template for future days, then fill it in with
  // today's broadcasts
  //var now = moment();
  //var date = moment(); // This one will be changed for each get
  var day = $('.day');
  var dayTemplate = day.clone();
  var broadcastTemplate = day.find('.broadcast').detach().clone();
  var daysToGet = 7;
  var today = true;
  
  /* this is called for a specific date via date picker */
  function renderDate(dateString) {

	  //now = moment(dateString);
	  date =moment(dateString,'MM/DD/YYYY'); // This one will be changed for each get

	  daysToGet = 7;
	  
	  //schedule = schedule.clone();
	  schedule.html('');
	  //$('.schedule').replaceWith(schedule);
	  
	  renderDay();
  }

  function renderDay () {
    http.get({
      path: '/api/'+site+'/schedule/' + date.format('YYYY-MM-DD')
    }, function (res) {
      res.pipe(concat(function (data) {
        var result = JSON.parse(data);
        if (today) {
          today = false;
        } else {
          day = dayTemplate.clone();
          schedule.append(day);
          day.find('.weekday').html(date.format('dddd'));
        }
        day.find('.month').html(date.format('MMMM'));
        day.find('.monthday').html(date.format('DD'));
        var broadcastList = day.find('.broadcast-list');
        result.hits.forEach(function (hit) {
          var broadcast = broadcastTemplate.clone();
          var name = broadcast.find('.broadcast-name');
          var description = broadcast.find('.broadcast-description');
          var start = moment(hit.start);
          var hd = hit.description || '';
          hd = strip(hd);
          if (hd.length > 210) hd = hd.substr(0, 210) + '...';
          broadcast.find('.broadcast-time').html(start.format('h:mma'));
          var displayName = hit.name;
          if (typeof(hit.shows)!='undefined') displayName = hit.shows[0].main + ': ' +displayName;
          name.find('span').html(displayName).on('click', function () {
            description.slideToggle(); 
          	if (description.find('div.item-detail').html() == "") {
          		if (hit.shows && hit.shows.length && hit.shows[0].id) {
		        		$.getJSON( '/api/'+hit.shows[0].id, function( showResult ) {
		              var detailDesc = typeof(showResult.credit)!='undefined'?showResult.credit:'';          
		              description.find('div.item-detail').html(detailDesc);
		              console.log('show '+hit.shows[0].id)
		           	});    		    		
            	}
            }
          });
          description.find('p').html(hd);

          broadcast.find('.more').attr('href', sitePath+'/schedule/' + hit.id)
          
          // Highlight the broadcast happening now
          if (start.isBefore(now) && moment(hit.end).isAfter(now)) {
            name.addClass('current');
            description.addClass('current');
          }

          broadcastList.append(broadcast);
        });

        // And around again!
        date = date.add(1, 'days');
        if (--daysToGet > 0) renderDay();
      }));
    });
  }

  // Run on page load
  renderDay();

  $('#more').on('click', function () {
    daysToGet = 7;
    renderDay();
  });
};
