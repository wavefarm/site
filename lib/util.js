var moment = require('moment')

module.exports = {
	formatDates: formatDates,
	formatStartDateTimes: formatStartDateTimes,
	formatDateTimes: formatDateTimes,
	formatArchiveDate: formatArchiveDate,
	isCommunityEvent: isCommunityEvent,
	getIconList: getIconList,
	getSubsitePath: getSubsitePath,
	getItemLink: getItemLink,
	formatLocationContactInfo: formatLocationContactInfo,
	concoctFullAddress: concoctFullAddress,
}

function formatLocationContactInfo(locationResult) {

	var locationContactInfo = '';	
	if (locationResult.address) {	
		locationContactInfo += locationResult.address;
		if (typeof(locationResult.city)!='undefined') {
			locationContactInfo += '&nbsp;|&nbsp;';
			locationContactInfo += locationResult.city;
			if (typeof(locationResult.state)!='undefined') {
				locationContactInfo += ', ' + locationResult.state;
			}
			if (typeof(locationResult.postalCode)!='undefined') {
				locationContactInfo += ' ' + locationResult.postalCode;
			}
		}
	}
	
	if (typeof(locationResult.phone)!='undefined') {
		if (locationContactInfo.length>0)
			locationContactInfo += '&nbsp;|&nbsp;';
		locationContactInfo += locationResult.phone;
	}       			
	
	
	return locationContactInfo;
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
	
	if (item.type =='artist' && item.categories && item.categories.indexOf('Transmission Artist') != -1) {
		return '/ta/artists/'+item.id;
	}
	
	else if (item.type =='work' && item.sites && item.sites.indexOf('transmissionarts') != -1) {
		return '/ta/works/'+item.id;		
	}

	else if (item.type =='event' && item.sites) {
		if (item.sites.indexOf('wgxc') != -1) {
			return '/wgxc/calendar/'+item.id;
		}
		if (item.sites.indexOf('transmissionarts') != -1) {
			return '/ta/calendar/'+item.id;
		}
	}	
	else if ((item.type =='show' || item.type =='broadcast') && item.sites) {
		if (item.sites.indexOf('wgxc') != -1) {
			return '/wgxc/schedule/'+item.id;
		}
		if (item.sites.indexOf('transmissionarts') != -1) {
			return '/ta/schedule/'+item.id;
		}
	}
	else if (item.type =='news' && item.sites) {
		if (item.sites.indexOf('wgxc') != -1) {
			return '/wgxc/newsroom/'+item.id;
		}
		if (item.sites.indexOf('transmissionarts') != -1) {
			return '/ta/newsroom/'+item.id;
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

/* Formats time only for calendar card currently; used for
 * types that have only a single "date" datetime, as opposed to
 * start/end datetimes as above.
 */
function formatDateTimes(hit) {	
	if (typeof(hit.date)=='undefined') {
		return '';
	}		
	var date = moment(hit.date);		
	if (date.format('mm')!=0)
		return date.format('h:mm a');
	else
		return date.format('ha');
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
	
	var spansMidnight = startDate && endDate 
		&& startDate.date()!=endDate.date() && startDate.diff(endDate,'days')==0; 
	
	
	var dateDesc = '';
		
	// possible cases:
	// nothing (no startDate)
	// startDate
	// startDate: startTime
	// startDate: startTime - endTime
	// startDate - endDate
	// startDate: startTime - endDate
	// startDate - endDate: startTime
	// startDate: startTime - endDate: endTime
	
	if (!startDate) {
		// nothing
	}
	else if (multiDay) {		
		dateDesc += startDate.format('MMM D, YYYY');
		dateDesc = dateDesc + ' - ' + endDate.format('MMM D, YYYY');
	}
	else if (spansMidnight) {
		// special case: this is mostly like a single day item but it spans midnight so we
		// want the date in front of the end time
		dateDesc += startDate.format('MMM D, YYYY');		
		if (startTime) {
			dateDesc += ': '+(startTime.format('m')!='0'?startTime.format('h:mm a'):startTime.format('ha'));
		}				
		dateDesc = dateDesc + ' - ' + endDate.format('MMM D, YYYY');
		if (endTime)
			dateDesc += ': '+(endTime.format('m')!='0'?endTime.format('h:mm a'):endTime.format('ha'));
		
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

function concoctFullAddress (item) {
  var addy = ''
  addy += item.address ? item.address + '<br>' : ''
  addy += item.address2 ? item.address2 + '<br>' : ''
  addy += item.city || ''
  addy += item.city && item.state ? ', ' : ''
  addy += item.state ? item.state + ' ' : ''
  addy += item.postalCode ? item.postalCode + '<br>' : ''
  addy += item.country || ''
  return addy
}
