var moment = require('moment')

module.exports = {
	formatDates: formatDates,
	formatTimes: formatTimes,
	getIconList: getIconList,
	formatArchiveDate: formatArchiveDate,
}

function getIconList(hit) {

	
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
	
	// some itmes, like shows, don't have dates...
	if (typeof(hit.startDate)=='undefined')
		return '';
	
	
   	var startDate = moment(hit.startDate);	
	var endDate = moment(hit.endDate);
	
	
	var dateDesc = '';
	
	if (startDate.diff(endDate)!=0 ) {
		
		// assume multi day events don't need start/end times (?)
		return  moment(hit.startDate).format('MMM D, YYYY') + ' - ' + moment(hit.endDate).format('MMM D, YYYY');
	}
	else if (hit.allDay || typeof(hit.startTime)=='undefined') {
		return  moment(hit.startDate).format('MMM D, YYYY');
	}
	else  {
		
		var timeDesc = '';
		
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

		return moment(hit.startDate).format('MMM D, YYYY') + ": "+timeDesc;
	}
	
	
}