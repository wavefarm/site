var moment = require('moment')

module.exports = {
	formatDates: formatDates,
	formatTimes: formatTimes,
	formatArchiveDate: formatArchiveDate,
	isCommunityEvent: isCommunityEvent,
	getIconList: getIconList,
}


function isCommunityEvent(hit) {
	if (typeof(hit.categories)!='undefined') { 
		for (i = 0; i < hit.categories.length; i++) {
			var category = hit.categories[i];
	    	if (typeof(category)=='string') {
	    		if (category.indexOf('Community Calendar Event')!=-1)
	    			return true;
	    	}
		}
	}
	return false;
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

	console.log(hit.sites);
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

/*
function getIconListFromCategories(hit) {

	
	var wgxc = false;
	var ta = false;
	var mag = false;
	
	if (typeof(hit.categories)!='undefined') { 
		for (i = 0; i<hit.categories.length; i++) {
			var category = hit.categories[i];
	    	if (typeof(category)=='string') {
		    	
				if (category.indexOf('WGXC 90.7-FM Broadcast Event')!=-1)
					wgxc = true;
				else if (category.indexOf('WGXC Calendar Event')!=-1)
					wgxc = true;
				else if (category.indexOf('Wave Farm Radio Broadcast')!=-1)
					ta = true;
				else if (category.indexOf('TA Calendar Event')!=-1)
					ta = true;
				else if (category.indexOf('TA International Calendar')!=-1)
					ta = true;
				// TODO: grant marker
				//else if (category.indexOf('Grant')!=-1)	
				//	mag = true;
	    	}
	    	else if (typeof(category)=='number') {
				if (category==18 || category==23)
					wgxc = true;
				else if (category==12 || category==22 || category==3)
					ta = true;
				//else if (category==-1)	// TODO: grant marker
				//	mag = true;
	    	}
		}		
	}
	
	var iconList = [];

	if (wgxc) iconList[iconList.length] = '/images/wgxc-icon.png';
	if (ta) iconList[iconList.length] = '/images/ta-icon.png';
	if (mag) iconList[iconList.length] = '/images/mag-icon.png';

    return iconList;	
}
*/

function formatTimes(hit) {
	
	var timeDesc = '';
	
	if (typeof(hit.startTime)!='undefined') {
	
		var startTime = moment(hit.startDate + 'T'+ hit.startTime+'.000');
		
		if (startTime.format('mm')!=0)
			timeDesc = startTime.format('h:mm a');
		else
			timeDesc = startTime.format('ha');
	
		if (typeof(hit.endTime)!='undefined') {
			var endTime = moment(hit.endDate + 'T'+ hit.endTime+'.000');
			if (endTime.format('m')!='0')
				timeDesc = timeDesc + ' - ' + endTime.format('h:mm a');
			else
				timeDesc =  timeDesc + ' - ' + endTime.format('ha');
		}
	}

	return timeDesc;
}
function formatArchiveDate(hit) {

	if (typeof(hit.date)!='undefined') {
		var d = moment(hit.date);	
		return d.format('MMM D, YYYY')
	} else if (typeof(hit.startDate)!='undefined') {
		var d = moment(hit.startDate);	
		return d.format('MMM D, YYYY')
	}
	else {
		return '';
	}
	
}


function formatDates(hit) {
	
	// formats all combinations of start and end date+time;
	// accomodates items with start/end? as well as 
	// startDate,endDate?,startTime,endTime?,allDay?;
	// start is prioritized over startDate
	
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
	
	var startDate;
	var endDate;
	var startTime;
	var endTime;
	var allDay = typeof(hit.allDay)!='undefined'?hit.allDay:false;
	
	if (typeof(hit.start)!='undefined') {
	  startDate = moment(hit.start);	
		endDate = moment(hit.end);
	  startTime = moment(hit.start);	
		endTime = moment(hit.end);
	}
	else {
	  startDate = moment(hit.startDate);	
		endDate = moment(hit.endDate);
	  startTime = moment(hit.startTime);	
		endTime = typeof(hit.endTime)!='undefined'?moment(hit.endTime):false;
	}
	
	var dateDesc = '';
	
	if (startDate.diff(endDate,'days')!=0 ) {
		
		// assume multi day events don't need start/end times (?)
		return  startDate.format('MMM D, YYYY') + ' - ' + endDate.format('MMM D, YYYY');
	}
	else if (allDay) {
		return  startDate.format('MMM D, YYYY');
	}
	else  {
		
		var timeDesc = '';
		
		if (startTime.format('mm')!=0)
			timeDesc = startTime.format('h:mm a');
		else
			timeDesc = startTime.format('ha');

		if (endTime) {
    		if (endTime.format('m')!='0')
    			timeDesc = timeDesc + ' - ' + endTime.format('h:mm a');
    		else
    			timeDesc =  timeDesc + ' - ' + endTime.format('ha');
		}    		

		return startDate.format('MMM D, YYYY') + ": "+timeDesc;
	}
	
	
}