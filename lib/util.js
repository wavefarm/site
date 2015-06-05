var moment = require('moment')

module.exports = {
	formatDates: formatDates,
	formatStartDateTimes: formatStartDateTimes,
	formatArchiveDate: formatArchiveDate,
	isCommunityEvent: isCommunityEvent,
	getIconList: getIconList,
	getSubsitePath: getSubsitePath,
	getItemLink: getItemLink,
}


function isCommunityEvent(hit) {
	if (typeof(hit.categories)!='undefined') { 
		for (i = 0; i < hit.categories.length; i++) {
			var category = hit.categories[i];
    	if (typeof(category)=='string') {
    		if (category.indexOf('Community Calendar Event')!=-1)
    			return true;
    		else if (category.indexOf('TA International Calendar')!=-1)
    			return true;
    	}
		}
	}
	return false;
}

// Temporary version of item links until /ta launches.
// TODO: probably all sched/cal links should use this instead of just 
// related item lists
function getItemLink (item) {
	
	if (item.type =='artist') {
		//return 'http://transmissionarts.org/artist/'+item.id;
		if (typeof(item.categories)!='undefined' && item.categories.indexOf('Transmission Artist')>-1)
			return '/ta/artists/'+item.id;
		else
			return '/archive/'+item.id;
	}
	else if (item.type =='work') {
		return '/ta/works/'+item.id;		
	}
	else if (typeof(item.sites)!='undefined') {
	  
		if (item.sites.indexOf('wgxc') != -1) {
			 if (item.type == 'broadcast' || item.type == 'show') {
				 return '/wgxc/schedule/' + item.id;
			 }
			 else if (item.type == 'event' ) {
				 return '/wgxc/calendar/' + item.id;
			 }
	  }
	  else if (item.sites.indexOf('transmissionarts') != -1) {
	  	
			 if (item.type == 'broadcast' || item.type == 'show') {
				 return '/ta/schedule/' + item.id;
			 }
			 else if (item.type == 'event' ) {
				 return '/ta/calendar/' + item.id;
			 }
			
	  } 
	}
		
	// default to archive
	return '/archive/'+item.id;
}

// returns '', '/ta', or '/wgxc' based on contents of sites;
// used to build URL for individual show, broadcast, and event pages
// from main site and archive where subsite is unknown;
// if sites contains both transmissionarts and wgxc, wgxc is preferred.
function getSubsitePath(hit) {
	
	var wgxc = false;
	var ta = false;
	var mag = false;
	
	// "transmissionarts","wgxc"

	if (typeof(hit.sites)!='undefined') { 
		for (i = 0; i<hit.sites.length; i++) {
			var site = hit.sites[i];
			if (site.indexOf('wgxc')!=-1)
				wgxc = true;
			else if (site.indexOf('transmissionarts')!=-1)
				ta = true;
			// TODO: grant marker
			//else if (category.indexOf('Grant')!=-1)	
			//	mag = true;
		}		
	}
	
	if (wgxc) return '/wgxc';
	if (ta) return '/ta';
	return '';
}

function getIconList(hit) {

	var iconList = [];
	
	// filter out community events
	if (isCommunityEvent(hit))
		return iconList;
		
	var wgxc = false;
	var ta = false;
	var mag = false;
	
	// "transmissionarts","wgxc"

	//console.log(hit.sites);
	if (typeof(hit.sites)!='undefined') { 
		for (i = 0; i<hit.sites.length; i++) {
			var site = hit.sites[i];
			if (site.indexOf('wgxc')!=-1)
				wgxc = true;
			else if (site.indexOf('transmissionarts')!=-1)
				ta = true;
			// TODO: grant marker
			//else if (category.indexOf('Grant')!=-1)	
			//	mag = true;
		}		
	}
	
	if (wgxc) iconList[iconList.length] = '/images/wgxc-icon.png';
	if (ta) iconList[iconList.length] = '/images/ta-icon.png';
	if (mag) iconList[iconList.length] = '/images/mag-icon.png';

  return iconList;	
}


/* Formats time only for calendar card currently. Only
 * returns time info relevant to first day of event. So if
 * start and end are on same day, this might be a time range,
 * otherwise it is just the start time even if there is an end date.
 * If allDay = true OR no start time, then return empty string.
 * Also suppresses endTimes of 23:59:59.
 */
function formatStartDateTimes(hit) {
	
	var timeDesc = '';
			
	var startDate = moment(hit.start);
	var endDate = typeof(hit.end)!='undefined'?moment(hit.end):false;
	var startTime = false;
	var endTime = false;
	var allDay = typeof(hit.allDay)!='undefined'?hit.allDay:false;
	var multiDay = endDate && startDate.diff(endDate,'days')<0;
	
	if (typeof(hit.start)!='undefined') {
		if (hit.start.indexOf('T')>-1 && hit.start.substring(hit.start.indexOf('T')).length>1) {
		  startTime = moment(hit.start);
			if (typeof(hit.end)!='undefined' && hit.end.indexOf('T')>-1 && hit.end.substring(hit.end.indexOf('T')).length>1)		
				endTime = moment(hit.end);
		}
	}
	else if (typeof(hit.startTime)!='undefined') {
	  startTime = moment(hit.startTime);	
		endTime = typeof(hit.endTime)!='undefined'?moment(hit.endTime):false;
	}
	
	if (startTime && !allDay) {
	
		if (startTime.format('mm')!=0)
			timeDesc = startTime.format('h:mm a');
		else
			timeDesc = startTime.format('ha');
	
		if (!multiDay && endTime && endTime.format('H:m')!='23:59') {
			if (endTime.format('m')!='0')
				timeDesc = timeDesc + ' - ' + endTime.format('h:mm a');
			else
				timeDesc =  timeDesc + ' - ' + endTime.format('ha');
		}
	}

	return timeDesc;
}


/* Full start/end date/time Formatting. The only part
 * required is start date. Also handles legecy fields
 * startDate/startTime, etc, but start/end are preferred.
 */
function formatDates(hit) {
		
	if (typeof(hit.type)=='undefined')
		return '';

	// don't return anything for show (they have start,end fields 
	// but data not currently accurate
	if (hit.type=='show')
		return '';
	
	// some items have no start info,
	if (typeof(hit.startDate)=='undefined' && typeof(hit.start)=='undefined')
		return '';
	
	// normalize various fields...
	
	var startDate = false;
	var endDate = false;
	var startTime = false;
	var endTime = false;
	var allDay = typeof(hit.allDay)!='undefined'?hit.allDay:false;
	
	if (typeof(hit.start)!='undefined') {
	  startDate = moment(hit.start);	
		endDate = moment(hit.end);
		
		if (hit.start.indexOf('T')>-1 && hit.start.substring(hit.start.indexOf('T')).length>1)		
	  	startTime = moment(hit.start);	
		if (hit.end.indexOf('T')>-1 && hit.end.substring(hit.end.indexOf('T')).length>1)		
			endTime = moment(hit.end);
	}
	else {
	  startDate = moment(hit.startDate);	
		endDate = moment(hit.endDate);
	  startTime = moment(hit.startTime);	
		endTime = typeof(hit.endTime)!='undefined'?moment(hit.endTime):false;
	}
		
	if (allDay) {
		startTime = false;
		endTime = false;
	}
	
	if (endTime && endTime.format('H:m')=='23:59')
		endTime = false;
		
	var multiDay = startDate && endDate && startDate.diff(endDate,'days')!=0 ;
	
	var dateDesc = '';
		
	// possible cases:
	// nothing (no startDate)
	// startDate
	// startDate: startTime
	// startDate: startTime - endTime
	// startDate - endDate
	// startDate: startTime - endDate
	// startDate - endDate: startTime
	// startDate: startTime - endDate: startTime
	
	if (!startDate) {
		// nothing
	}
	else if (multiDay) {
		
		dateDesc += startDate.format('MMM D, YYYY');
		
		//if (startTime)
		//	dateDesc = dateDesc + ': '+(startTime.format('m')!='0'?startTime.format('h:mm a'):startTime.format('ha'));
				
		dateDesc = dateDesc + ' - ' + endDate.format('MMM D, YYYY');
		
		//if (endTime)
		//	dateDesc += ': '+(endTime.format('m')!='0'?endTime.format('h:mm a'):endTime.format('ha'));
			
	}
	else {
		// single Day

		dateDesc += startDate.format('MMM D, YYYY');		
		if (startTime) {
			dateDesc += ': '+(startTime.format('m')!='0'?startTime.format('h:mm a'):startTime.format('ha'));
			if (endTime)
				dateDesc += ' - '+(endTime.format('m')!='0'?endTime.format('h:mm a'):endTime.format('ha'));
		}		
	}
	
	return dateDesc;	
}

/* formats dates for many different types of records, used
 * in associated links on event/show/broadcast pages
 */
function formatArchiveDate(hit) {

	if (hit.type=='work' && typeof(hit.date)!='undefined') {
		var d = moment(hit.date);	
		return d.format('YYYY')
	} else if (typeof(hit.date)!='undefined') {
		var d = moment(hit.date);	
		return d.format('MMM D, YYYY')
	} else if (typeof(hit.start)!='undefined') {
		var d = moment(hit.start);	
		return d.format('MMM D, YYYY')
	} else if (typeof(hit.startDate)!='undefined') {
		var d = moment(hit.startDate);	
		return d.format('MMM D, YYYY')
	}
	else {
		return '';
	}
	
}
