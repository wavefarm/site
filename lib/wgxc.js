var moment = require('moment')

module.exports = {
	formatDates: formatDates,
	formatTimes: formatTimes,
	getIconList: getIconList,
	formatArchiveDate: formatArchiveDate,
}

function getIconList(hit) {

	var iconList = [];
	
	
	if (typeof(hit.categories)!='undefined') { 
		for (i = 0; i<hit.categories.length; i++) {
	
			var category = hit.categories[i];
			
	    	var src = '';
	    	
	    	if (typeof(category)=='string') {
	    	
				if (category.indexOf('WGXC:')!=-1)
					src = '/images/wgxc-icon.png';
				else if (category.indexOf('Transmission Art')!=-1)
					src = '/images/ta-icon.png';
				else if (category.indexOf('Grant')!=-1)	// TODO: grant marker
					src = '/images/mag-icon.png';
	    	}
	    	else if (typeof(category)=='number') {
				if (category==18)
					src = '/images/wgxc-icon.png';
				else if (category==12)
					src = '/images/ta-icon.png';
				else if (category==-1)	// TODO: grant marker
					src = '/images/mag-icon.png';
	    	}
	    	    		
			if (src!='') {
				iconList[iconList.length] = src;
			}
		};
	};
    
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
	
   	var startDate = moment(hit.startDate);	
	var endDate = moment(hit.endDate);
	
	
	var dateDesc = '';
	
	if (startDate.diff(endDate)!=0 ) {
		
		// assume multi day events don't need start/end times (?)
		return  moment(hit.startDate).format('MMM D, YYYY') + ' - ' + moment(hit.endDate).format('MMM D, YYYY');
	}
	else if (hit.allDay) {
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