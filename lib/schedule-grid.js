var http = require('http')
var moment = require('moment')
var url = require('url')
// var concat = require('concat-stream');
// var strip = require('strip')

module.exports = function() {
	// Noop if no .schedule

	var table = $('table.schedule-grid');
	if (!table.length)
		return;

	var pathname = url.parse(document.URL, true).pathname;
	var site = ''; // default/main site
	var subsiteRe = /\/(\w+)\/schedule-grid/
	var matches = subsiteRe.exec(pathname)
	if (matches != null) {
		if (matches[1] == 'wgxc')
			site = 'wgxc';
		else if (matches[1] == 'ta')
			site = 'ta';
	}

	var sites = '';
	if (site == 'wgxc')
		sites = '%20sites:wgxc';
	else if (site == 'ta')
		sites = '%20sites:transmissionarts';
	else
		return;

	var dayNames = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
			'saturday', 'sunday' ];
	var weekNames = [ '1st', '2nd', '3rd', '4th', '5th' ];

	var gridTimes;
	var gridShows;

	$.getJSON('/api/search?q=type:show%20public:true%20airtime:*' + sites + '&size=1000', function(result) {
	
		getGridTimes(result.hits);
		getGridShows(result.hits)
		
		// -1 to drop trailiong midnight
		for (var timeIndex = 0; timeIndex < gridShows.length - 1; timeIndex++) {
			row = '<tr>'
			row += '<td>' + minutesToTime(gridTimes[timeIndex]) + '</td>'
			for (var dayIndex = 0; dayIndex < gridShows[timeIndex].length; dayIndex++) {


				var rowSpan = getRowSpan(timeIndex, dayIndex)
				var colSpan = getColSpan(rowSpan, timeIndex,
						dayIndex)

				if (rowSpan > 0 && colSpan > 0) {
					row += '<td colspan="' + colSpan
							+ '" rowspan="' + rowSpan
							+ '"><ul>'
							
					// showList is 6 element array where index 0 means no week_of_month, index 1 is 1st week_of_month, etc; 
					// shows can appear more than once
					var showListByWeekOfMonth = gridShows[timeIndex][dayIndex]
					
					if (isShowListByWeekOfMonthEmpty(showListByWeekOfMonth)) {
						// no shows at all
						row += '<li>TBA</li>'
					}
					else if (!isShowListHasWeeksOfMonth(showListByWeekOfMonth)) {
						// just one show with non week_of_the_ month
						row += '<li><a href="/' + site
						+ '/schedule/'
						+ showListByWeekOfMonth[0].id
						+ '">'
						row += showListByWeekOfMonth[0].main
						row += '</a></li>'								
					}
					else {
						var consolidatedShowListByWeekOfMonth = getConsolidatedShowListByWeekOfMonth(showListByWeekOfMonth)
						for (var showIndex = 0; showIndex < consolidatedShowListByWeekOfMonth.length; showIndex++) {
							var showAndFormattedWeeksOfTheMonth = consolidatedShowListByWeekOfMonth[showIndex]
							row += '<li>'
							row += '<a href="/' + site
							+ '/schedule/'
							+ showAndFormattedWeeksOfTheMonth.show.id
							+ '">'
							row += showAndFormattedWeeksOfTheMonth.weeksOfTheMonthNames
							row += showAndFormattedWeeksOfTheMonth.show.main
							row += '</a></li>'								
						}						
					}
					row += '</ul></td>'
				}
			}
			row += '</tr>'
			table.append(row)
		}
		$('#loading').hide();
	});

	function getConsolidatedShowListByWeekOfMonth(showListByWeekOfMonth) {
	
		var dummyTbaShow = {'id':0, 'main':'TBA'}
		var showIds = []; 
		
		var showAndWeekNames = []
		// skip first one w/o week_of_the_month, it's handled elsewhere
		for (var i=1; i<showListByWeekOfMonth.length; i++) {			
			var show = showListByWeekOfMonth[i]			
			if (typeof(show) != 'undefined' && findValueInArray(show.id,showIds) == -1) {
				showAndWeekNames.push( { 
					'show': show,
					'weeksOfTheMonth' : getWeeksOfTheMonthForShow(show.id,showListByWeekOfMonth)
				})
				showIds.push(show.id)
			}
		}		
		
		// TBA this should be last in list
		var tbaWeeksOfTheMonth = getWeeksOfTheMonthForTba(showListByWeekOfMonth)
		if (tbaWeeksOfTheMonth.length > 0) {
			showAndWeekNames.push( { 
				'show': dummyTbaShow,
				'weeksOfTheMonth' : tbaWeeksOfTheMonth
			})
		}
		
		for (var i = 0; i < showAndWeekNames.length; i++) {			
			showAndWeekNames[i].weeksOfTheMonthNames = formatWeeksOfTheMonth(showAndWeekNames[i].weeksOfTheMonth);			
		}		
		
		return showAndWeekNames
	}
	
	function getWeeksOfTheMonthForShow(id,showListByWeekOfMonth) {
		var weeks = []
		for (var i=1; i<showListByWeekOfMonth.length; i++) {
			if (typeof(showListByWeekOfMonth[i]) != 'undefined' && showListByWeekOfMonth[i].id == id) {
				weeks.push(i)
			}
		}
		return weeks
	}
	function getWeeksOfTheMonthForTba(showListByWeekOfMonth) {
		var weeks = []
		for (var i=1; i<showListByWeekOfMonth.length; i++) {
			if (typeof(showListByWeekOfMonth[i]) == 'undefined') {
				weeks.push(i)
			}
		}
		return weeks
	}
	
	function isShowListByWeekOfMonthEmpty(showListByWeekOfMonth) {
		for (var weekIndex = 0; weekIndex < showListByWeekOfMonth.length; weekIndex++) {
			if (typeof(showListByWeekOfMonth[weekIndex]) != 'undefined') {
				return false
			} 
		}
		return true
	}
	function isShowListHasWeeksOfMonth(showListByWeekOfMonth) {
		for (var weekIndex = 1; weekIndex < showListByWeekOfMonth.length; weekIndex++) {
			if (typeof(showListByWeekOfMonth[weekIndex]) != 'undefined') {
				return true
			} 
		}
		return false
	}	

	function formatWeeksOfTheMonth(weeksOfTheMonth) {
		if (weeksOfTheMonth.length == 0)
			return ''
		else {
			var formatted = ''
			for (var i = 0; i < weeksOfTheMonth.length; i++) {
				if (i > 0)
					formatted += ', '
				formatted += weekNames[weeksOfTheMonth[i] - 1]
			}
			formatted += ': '
			return formatted
		}
	}

	// returns array of weeks of the month (0-4) in which shows airs
	// or empty array if show airs all weeks
	function parseWeeksOfTheMonth(fixupAirtime) {
		var weeksOfTheMonth = [];
		for (var i = 0; i < weekNames.length; i++) {
			if (fixupAirtime.toLowerCase().indexOf(weekNames[i]) >= 0)
				weeksOfTheMonth.push(i + 1);
		}
		return weeksOfTheMonth;
	}

	// returns 3d array [times][day_of_week][week_of_month] = show
	// day_of_month will always be an array with 6 slots such that:
	//	0: shows without any week_of_month desigination
	//	1: show with 1st week_of_month, i.e. 1st Friday 
	//	2: show with 2nd week_of_month, i.e. 2nd Friday 
	//  etc.
	//  note one show can occupy multiple slots
	function getGridShows(shows) {

		gridShows = new Array(gridTimes.length);
		for (var i = 0; i < gridShows.length; i++) {
			gridShows[i] = new Array(7);
			for (var j = 0; j < gridShows[i].length; j++)
				gridShows[i][j] = new Array(6)
		}

		for (var i = 0; i < shows.length; i++) {
			var show = shows[i];
			//console.log('show '+ i)
			var fullGenbAirtime = show.genbAirtime ? show.genbAirtime
					: show.airtime;
			// console.log(show.main + ' = ' + fullGenbAirtime)
			var genbAirtimeParts = fullGenbAirtime.split(';')
			for (var j = 0; j < genbAirtimeParts.length; j++) {
				if (genbAirtimeParts[j]) {
					var fixupAirtime = getFixupAirtime(genbAirtimeParts[j]) 
					var showAirtimes = parseAirtime(fixupAirtime)
				
					if (showAirtimes) {
						var daysOfTheWeek = parseDaysOfTheWeek(fixupAirtime)
						if (daysOfTheWeek) {
							// var start = showAirtimes.start.hours*60 +
							// showAirtimes.start.minutes
							// var end = showAirtimes.end.hours*60 +
							// showAirtimes.end.minutes
							var start = normalizeTime(showAirtimes.start)
							var end = normalizeTime(showAirtimes.end)
							var startTimeIndex = getIndexOfTime(start)
							var endTimeIndex = getIndexOfTime(end)
							var weeksOfTheMonth = parseWeeksOfTheMonth(fixupAirtime)					
							for (var d = 0; d < daysOfTheWeek.length; d++) {
								for (var t = startTimeIndex; t < endTimeIndex; t++) {
									if (weeksOfTheMonth.length == 0) {
										gridShows[t][daysOfTheWeek[d]][0] = show	// no week_of_the_month
									}
									else {
										for (var w = 0; w < weeksOfTheMonth.length; w++) {
											var weekOfTheMonth  = weeksOfTheMonth[w]
											if (gridShows[t][daysOfTheWeek[d]][weekOfTheMonth]) {
												console.log('multiple shows for slot: ' + gridShows[t][daysOfTheWeek[d]][weekOfTheMonth].id + ', ' + show.id)
											}
											gridShows[t][daysOfTheWeek[d]][weekOfTheMonth] = show
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	function getRowSpan(timeIndex, dayIndex) {
		var shows = gridShows[timeIndex][dayIndex];
		if (timeIndex > 0
				&& compareShowLists(gridShows[timeIndex - 1][dayIndex], shows))
			return 0
		var rowSpan = 1;
		for (var t = timeIndex + 1; t < gridShows.length; t++) {
			if (compareShowLists(gridShows[t][dayIndex], shows))
				rowSpan += 1
			else
				return rowSpan
		}
		return rowSpan
	}

	function getColSpan(rowSpan, timeIndex, dayIndex) {
		var shows = gridShows[timeIndex][dayIndex];
		if (dayIndex > 0
				&& compareShowLists(gridShows[timeIndex][dayIndex - 1], shows)
				&& getRowSpan(timeIndex, dayIndex - 1) == rowSpan)
			return 0
		var colSpan = 1;
		for (var d = dayIndex + 1; d < gridShows[timeIndex].length; d++) {
			if (compareShowLists(gridShows[timeIndex][d], shows)
					&& getRowSpan(timeIndex, d) == rowSpan)
				colSpan += 1
			else
				return colSpan
		}
		return colSpan;
	}

	function compareShowLists(shows1, shows2) {
		if (shows1.length != shows2.length) {
			return false;
		}
		for (var i = 0; i < Math.min(shows1.length); i++) {
			if (typeof(shows1[i]) != 'undefined' &&  typeof(shows2[i]) == 'undefined') {
				return false
			}
			else if (typeof(shows1[i]) == 'undefined' &&  typeof(shows2[i]) != 'undefined') {
				return false
			}
			else if (typeof(shows1[i]) != 'undefined' &&  typeof(shows2[i]) != 'undefined' && shows1[i].id != shows2[i].id) {
				return false
			}
		}
		return true
	}

	function getGridTimes(shows) {
		gridTimes = []
		var uniqueGridTimes = {}
		for (var i = 0; i < shows.length; i++) {
			var show = shows[i];
			var fullGenbAirtime = show.genbAirtime ? 
					show.genbAirtime : show.airtime;
			var genbAirtimeParts = fullGenbAirtime.split(';')
			for (var j = 0; j < genbAirtimeParts.length; j++) {
				if (genbAirtimeParts[j]) {
					var fixupAirtime = getFixupAirtime(genbAirtimeParts[j]) 
					var showAirtimes = parseAirtime(fixupAirtime)				
					if (showAirtimes) {
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
		}

		gridTimes = gridTimes.sort(function sortNumber(a, b) {
			return a - b;
		})
		return gridTimes;
	}

	function getFixupAirtime(airtime) {
		var fixupAirtime = airtime
		if (fixupAirtime.toLowerCase().indexOf('every') == -1) {
			fixupAirtime = 'Every ' + fixupAirtime
		}
		fixupAirtime = fixupAirtime.replace('noon', '12 p.m.')
		fixupAirtime = fixupAirtime.replace('midnight', '12 a.m.')
		return fixupAirtime
	}
	
	function getIndexOfTime(time) {
		for (var i = 0; i < gridTimes.length; i++) {
			if (gridTimes[i] == time)
				return i;
		}
		return -1;
	}

	// returns an array of days of the week, 0 = Monday, 1 = Tuesday, etc
	function parseDaysOfTheWeek(fixupAirtime) {
		if (fixupAirtime.toLowerCase().indexOf('daily') >= 0
				|| fixupAirtime.toLowerCase().indexOf('every day') >= 0) {
			//console.log(fixupAirtime)
			return [ 0, 1, 2, 3, 4, 5, 6 ];
		}
		var daysOfTheWeek = [];
		for (var i = 0; i < dayNames.length; i++) {
			if (fixupAirtime.toLowerCase().indexOf(dayNames[i]) >= 0)
				daysOfTheWeek.push(i);
		}
		return daysOfTheWeek;
	}

	function minutesToTime(minutes) {
		var time = moment().hours(Math.floor(minutes / 60.0));
		time.minutes(minutes % 60);
		return time.format('h:mm a')
	}

	// Returns an object with all of the airtime bits parsed out
	// Or undefined on parse error
	function parseAirtime(airtime) {
		var times, parsed;
		if (!airtime)
			return;
		times = getTimes(airtime);
		if (times.length < 2) {
			console.log('Bad times: ' + airtime);
			return;
		}
		parsed = {
			start : times[0],
			end : times[1]
		};
		return parsed;
	}

	function getTimes(airtime) {
		var timeRe = /\d+:?\d* *(?:a|p).?m/ig;
		var ampm, hours, minutes, time, times, timeMatch, timeSplit;
		times = [];
		while (timeMatch = timeRe.exec(airtime)) {
			time = timeMatch[0];
			// console.log(time)
			time = time.replace('.', '');
			// Split off am/pm
			timeSplit = time.split(' ');
			if (timeSplit.length < 2)
				return console.log('no ampm');
			time = timeSplit[0];
			ampm = timeSplit[1];
			// Split into hours and minutes
			timeSplit = time.split(':');
			hours = timeSplit[0];
			minutes = (timeSplit.length == 2) ? timeSplit[1] : '0';
			if (ampm == 'am' && hours == '12')
				hours = '0';
			if (ampm == 'pm' && hours != '12')
				hours = String(Number(hours) + 12);
			// hours = ('0' + hours).substr(hours.length - 1);
			time = {
				hours : Number(hours),
				minutes : Number(minutes)
			};
			// console.log(time);
			times.push(time);
		}
		// Reset the regex index for the start of next string
		timeRe.lastIndex = 0;
		return times;
	}

	function normalizeTime(time) {
		return round5(time.hours * 60 + time.minutes)
	}

	function round5(x) {
		return Math.ceil(x / 5) * 5;
	}
	
	function findValueInArray(value,array) {
		for (var i=0; i<array.length; i++) {
			if (array[i] == value) {
				return i
			}
		}
		return -1		
	}

};