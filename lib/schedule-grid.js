var http = require('http')
var moment = require('moment')
var url = require('url')
//var concat = require('concat-stream');
//var strip = require('strip')

module.exports = function () {
  // Noop if no .schedule

	var table = $('table.schedule-grid');
  if (!table.length) return;
  
	var pathname = url.parse(document.URL, true).pathname;  
	var site = '';	// default/main site
	var subsiteRe = /\/(\w+)\/schedule-grid/
	var matches = subsiteRe.exec(pathname)
	if (matches!=null) {				
		if (matches[1]=='wgxc') site = 'wgxc';
		else if (matches[1]=='ta') site = 'ta';					
	}  
	
	var sites = '';
	if (site=='wgxc') sites = '%20sites:wgxc';
	else if (site=='ta') sites = '%20sites:transmissionarts';
	else return;
  
	var dayNames = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
	var weekNames = ['1st','2nd','3rd','4th','5th'];
	
	
	var gridTimes;
	var gridShows;
  
	
	$.getJSON( '/api/search?q=type:show%20public:true%20airtime:*'+sites+'&size=1000', function( result ) {
  	
		getGridTimes(result.hits);
		getGridShows(result.hits)
							
		// -1 to drop trailiong midnight
		for (var timeIndex=0; timeIndex<gridShows.length-1; timeIndex++) {			
			row = '<tr>'
			row += '<td>'+minutesToTime(gridTimes[timeIndex])+'</td>'							
			for (var dayIndex=0; dayIndex<gridShows[timeIndex].length; dayIndex++) {

				var showList = gridShows[timeIndex][dayIndex]
				
				var rowSpan = getRowSpan(timeIndex,dayIndex)
				var colSpan =  getColSpan(rowSpan,timeIndex,dayIndex)
	
				if (rowSpan>0 && colSpan>0 )	{				
					row += '<td colspan="'+colSpan+'" rowspan="'+rowSpan+'"><ul>'						
					if (showList.length == 0)
						row += '<li>TBD</li>'
					else
						for(var showIndex=0; showIndex<showList.length; showIndex++) {
							row += '<li><a href="/wgxc/schedule/'+showList[showIndex].id+'">' 
							row += formatWeeksOfTheMonth(showList[showIndex].weeksOfTheMonth)
							row += showList[showIndex].main 
							row += '</a></li>' 
						}					
					row += '</ul></td>'					
				}				
			}			
			row += '</tr>'
			table.append(row)		
		}
		
		$('#loading').hide();
		
	});	
		
	function showListSort(a,b) {
		if (a.weeksOfTheMonth.length==0 && b.weeksOfTheMonth.length==0)
			return a.main.localeCompare(b.main)
		else if (a.weeksOfTheMonth.length==0)
			return -1
		else if (b.weeksOfTheMonth.length==0)
			return 1
		else
			return a.weeksOfTheMonth[0] - b.weeksOfTheMonth[0]
	}	
	
	function formatWeeksOfTheMonth(weeksOfTheMonth) {
		if (weeksOfTheMonth.length == 0)
			return ''
		else {
			var formatted = ''
			for (var i=0; i<weeksOfTheMonth.length; i++) {
				if (i>0) formatted += ', '
				formatted += weekNames[weeksOfTheMonth[i]]
			}
			formatted += ': '
			return formatted
		}		
	}
	
	
	// returns 2d array [times][day_of_week] = shows(s)
	// show(s) can be an array in the case of different shows on 
	// different instances of day of the week (1st, 2nd, 3rd, 4th, 5th Monday)
	function getGridShows(shows) {
		
		gridShows = new Array(gridTimes.length);
		for (var i=0; i<gridShows.length; i++) {
			gridShows[i] = new Array(7);
			for (var j=0; j<gridShows[i].length; j++)
				gridShows[i][j] = new Array() 
		}

	  for (var i=0; i<shows.length;i++) {
	  	var show = shows[i];
	  	//console.log('show '+ i)
  	  var fullGenbAirtime = show.genbAirtime?show.genbAirtime:show.airtime;  
	  	//console.log(show.main + ' = ' + fullGenbAirtime)
  	  var genbAirtimeParts = fullGenbAirtime.split(';')		  
  	  for (var j=0; j<genbAirtimeParts.length;j++) {		  	
			  var fixupAirtime = genbAirtimeParts[j];
			  if (fixupAirtime.toLowerCase().indexOf('every')==-1)
			  	fixupAirtime = 'Every '+fixupAirtime;
			  fixupAirtime = fixupAirtime.replace('noon','12 p.m.');
			  fixupAirtime = fixupAirtime.replace('midnight','12 a.m.');
			  
			  var showAirtimes = parseAirtime(fixupAirtime);  	  		  					  
			  if (showAirtimes) {			  	
			  	var daysOfTheWeek = parseDaysOfTheWeek(fixupAirtime)
			  	
			  	if (daysOfTheWeek) {

			  		//var start = showAirtimes.start.hours*60 + showAirtimes.start.minutes
				  	//var end = showAirtimes.end.hours*60 + showAirtimes.end.minutes
			  		var start = normalizeTime(showAirtimes.start)
				  	var end = normalizeTime(showAirtimes.end)
				  	var startTimeIndex = getIndexOfTime(start)
				  	var endTimeIndex = getIndexOfTime(end)
				  	show.weeksOfTheMonth = parseWeeksOfTheMonth(fixupAirtime)
				  	
			  	  for (var d=0; d<daysOfTheWeek.length; d++) {			  	  	
			  	  	for (var t=startTimeIndex; t<endTimeIndex; t++) {
			  	  		gridShows[t][daysOfTheWeek[d]].push(show)
			  	  	}
			  	  }			  	
			  	}			  	
			  }
  	  }
	  }
			  
	  
	  // sort them for weeksOfTheMonth
		for (var timeIndex=0; timeIndex<gridShows.length-1; timeIndex++) {			
			for (var dayIndex=0; dayIndex<gridShows[timeIndex].length; dayIndex++) {	  
				gridShows[timeIndex][dayIndex].sort(showListSort)
			}
		}
	  
		//console.log(grid)
		//return grid;
	}	
	
	function getRowSpan(timeIndex,dayIndex) {		
		var shows = gridShows[timeIndex][dayIndex];		
		if (timeIndex>0 && compareShowLists(gridShows[timeIndex-1][dayIndex],shows))
			return 0		
		var rowSpan = 1;
		for (var t = timeIndex+1; t<gridShows.length; t++) {
			if (compareShowLists(gridShows[t][dayIndex], shows))
				rowSpan += 1
			else
				return rowSpan
		}
		return rowSpan
	}
	
	function getColSpan(rowSpan,timeIndex,dayIndex) {
		
		var shows = gridShows[timeIndex][dayIndex];
		
		if (dayIndex>0 && compareShowLists(gridShows[timeIndex][dayIndex-1],shows) && getRowSpan(timeIndex,dayIndex-1)==rowSpan)
			return 0		
		var colSpan = 1;
		
		for (var d = dayIndex+1; d<gridShows[timeIndex].length; d++) {
			if (compareShowLists(gridShows[timeIndex][d], shows) && getRowSpan(timeIndex,d)==rowSpan)
				colSpan += 1
			else
				return colSpan
		}
		return colSpan;
	}
	
	
	function compareShowLists(shows1,shows2) {
		if (shows1.length!=shows2.length)
			return false;
		for (var i=0; i<Math.min(shows1.length); i++)
			if (shows1[i].id!=shows2[i].id)
				return false		
		return true
	}
	
		
	function getGridTimes(shows) {
		
		gridTimes = []
		var uniqueGridTimes = {}
		
	  for (var i=0; i<shows.length;i++) {		  	
  	//$.each( result.hits, function( i, show ) {
	  	var show = shows[i];

  	  var fullGenbAirtime = show.genbAirtime?show.genbAirtime:show.airtime;  
  	  var genbAirtimeParts = fullGenbAirtime.split(';')
		  
  	  for (var j=0; j<genbAirtimeParts.length;j++) {		  	
			  var fixupAirtime = genbAirtimeParts[j];
			  if (fixupAirtime.toLowerCase().indexOf('every')==-1)
			  	fixupAirtime = 'Every '+fixupAirtime;
			  fixupAirtime = fixupAirtime.replace('noon','12 p.m.');
			  fixupAirtime = fixupAirtime.replace('midnight','12 a.m.');
			  
			  var showAirtimes = parseAirtime(fixupAirtime);  	  		  					  
			  if (showAirtimes) {			  	
			  	//var start = showAirtimes.start.hours*60 + showAirtimes.start.minutes
			  	//var end = showAirtimes.end.hours*60 + showAirtimes.end.minutes
		  		var start = normalizeTime(showAirtimes.start)
			  	var end = normalizeTime(showAirtimes.end)			  	
			  	if (!uniqueGridTimes.hasOwnProperty(start)) {
			  		gridTimes.push(start)
			  		uniqueGridTimes[start] = 1			  	  	
			  	}
			  	if (!uniqueGridTimes.hasOwnProperty(end)) {
			  		gridTimes.push(end)
			  		uniqueGridTimes[end] = 1			  	  	
			  	}
			  }
  	  }
	  }
		
		gridTimes = gridTimes.sort(function sortNumber(a,b) { return a - b; })
		
		return gridTimes;
	}	
	

	
	function getIndexOfTime(time) {		
	  for (var i=0; i<gridTimes.length; i++) {
	  	if (gridTimes[i] ==  time)
	  		return i;	  	
	  }		
		return -1;
	}
	
	// returns array of weeks of the month (0-4) in which shows airs
	// or empty array if show airs all weeks
	function parseWeeksOfTheMonth(fixupAirtime) {

		var weeksOfTheMonth = [];
	  for (var i=0; i<weekNames.length; i++) {
		  if (fixupAirtime.toLowerCase().indexOf(weekNames[i])>=0)
		  	weeksOfTheMonth.push(i);			
		}
	  return weeksOfTheMonth;			
		
	}
	
	// returns an array of days of the week, 0 = Monday, 1 = Tuesday, etc
	function parseDaysOfTheWeek(fixupAirtime) {
		
		if (fixupAirtime.toLowerCase().indexOf('daily')>=0 || fixupAirtime.toLowerCase().indexOf('every day')>=0) {
			console.log(fixupAirtime)
			return [0,1,2,3,4,5,6];
		}

		var daysOfTheWeek = [];

		/*
		if (fixupAirtime.toLowerCase().indexOf('through')>=0) {
			var started = false
		  for (var i=0; i<dayNames.length; i++) {		  	
			  if (!started && fixupAirtime.toLowerCase().indexOf(dayNames[i])>=0) {
			  	started = true
			  	daysOfTheWeek.push(i);			
			  }
			  else {
				  if (started)
				  	daysOfTheWeek.push(i);				
				  if (fixupAirtime.toLowerCase().indexOf(dayNames[i])>=0)
				  	break;
			  }
			}			
			return daysOfTheWeek;
		} 
		*/
				
	  for (var i=0; i<dayNames.length; i++) {
		  if (fixupAirtime.toLowerCase().indexOf(dayNames[i])>=0)
		  	daysOfTheWeek.push(i);			
		}
	  return daysOfTheWeek;		
	}
	
	
	function minutesToTime(minutes) {		
		var time = moment().hours(Math.floor(minutes/60.0));
		time.minutes(minutes%60);
		return time.format('h:mm a')
	}
		
	
	//Returns an object with all of the airtime bits parsed out
	//Or undefined on parse error
	function parseAirtime (airtime) {
	 var times, parsed;	
	 if (!airtime) return;	
	 times = getTimes(airtime);	
	 if (times.length < 2) {
	   console.log('Bad times', airtime);
	   return;
	 }	
	 parsed = {start: times[0], end: times[1]};	
	 return parsed;
	}
		
	function getTimes (airtime) {
		var timeRe = /\d+:?\d* *(?:a|p).?m/ig;
		var ampm, hours, minutes, time, times, timeMatch, timeSplit;
		times = [];
		while (timeMatch = timeRe.exec(airtime)) {
			time = timeMatch[0];
		  //console.log(time)
		  time = time.replace('.', '');		   
		  // Split off am/pm
		  timeSplit = time.split(' ');
		  if (timeSplit.length < 2) return console.log('no ampm');
		  time = timeSplit[0];
		  ampm = timeSplit[1];		   
		  // Split into hours and minutes
		  timeSplit = time.split(':');
		  hours = timeSplit[0];
		  minutes = (timeSplit.length == 2) ? timeSplit[1] : '0';		
		  if (ampm == 'am' && hours == '12') hours = '0';
		  if (ampm == 'pm' && hours != '12') hours = String(Number(hours) + 12);
		  //hours = ('0' + hours).substr(hours.length - 1);		
		  time = {hours: Number(hours), minutes: Number(minutes)};
		  //console.log(time);
		  times.push(time);
		}		 
		// Reset the regex index for the start of next string
		timeRe.lastIndex = 0;
		return times;
	}	
	
		
	function normalizeTime(time) {
		return round5(time.hours*60 + time.minutes)
	}
	
	function round5(x) {
    return Math.ceil(x/5)*5;
	}	
	
	
};