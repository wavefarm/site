function itemUrl (item) {
	
  if (item.type == 'artist' && item.categories && item.categories.indexOf('Transmission Artist') != -1) {
    return '/ta/artists/' + item.id;
  }
  if (item.type == 'work' && item.sites && item.sites.indexOf('transmissionarts') != -1) {
    return '/ta/works/' + item.id;
  }
  
  if (item.type == 'event') {
  	
  	if (item.categories) {
      if (item.categories.indexOf('WGXC Calendar Event') != -1 && item.categories.indexOf('TA Calendar Event') != -1) {
        return '/calendar/' + item.id;
      }
      else if (item.categories.indexOf('WGXC Calendar Event') != -1) {
        return '/wgxc/calendar/' + item.id;
      }
      else if (item.categories.indexOf('TA Calendar Event') != -1) {
        return '/ta/calendar/' + item.id;
      }
      else if (item.start && item.categories.indexOf('WGXC Community Calendar Event') != -1 && item.categories.indexOf('TA International Calendar') != -1) {
    	  startDate = moment(item.start);	
        return '/calendar/' + startDate.format('YYYY-MM-DD')
      }
      else if (item.start && item.categories.indexOf('WGXC Community Calendar Event') != -1) {
    	  startDate = moment(item.start);	
        return '/wgxc/calendar/' + startDate.format('YYYY-MM-DD')
      }
      else if (item.start && item.categories.indexOf('TA International Calendar') != -1) {
    	  startDate = moment(item.start);	
        return '/ta/calendar/' + startDate.format('YYYY-MM-DD')
      }
  	}
  	else if (item.sites) {
      if (item.sites.indexOf('wgxc') != -1 && item.sites.indexOf('transmissionarts') != -1) {
        return '/calendar/' + item.id;
      }
      else if (item.sites.indexOf('wgxc') != -1) {
        return '/wgxc/calendar/' + item.id;
      }
      else if (item.sites.indexOf('transmissionarts') != -1) {
        return '/ta/calendar/' + item.id;
      }
  	}
  	
  	return '/calendar/' + item.id;
  }
  
  if ((item.type == 'broadcast' || item.type == 'show') && item.sites) {
    if (item.sites.indexOf('wgxc') != -1) {
      return '/wgxc/schedule/' + item.id;
    }
    if (item.sites.indexOf('transmissionarts') != -1) {
      return '/ta/schedule/' + item.id;
    }
  }
  
  if (item.type == 'news') {
  	if (item.sites) {
	    if (item.sites.indexOf('wgxc') != -1 && item.sites.indexOf('transmissionarts') != -1) {
	      return '/newsroom/' + item.id;
	    }
	    if (item.sites.indexOf('wgxc') != -1) {
	      return '/wgxc/newsroom/' + item.id;
	    }
	    if (item.sites.indexOf('transmissionarts') != -1) {
	      return '/ta/newsroom/' + item.id;
	    }
  	}
  	else {
      return '/newsroom/' + item.id;
  	}
  }
  
  return '/archive/' + item.id;
}
