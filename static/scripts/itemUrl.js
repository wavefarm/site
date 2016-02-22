function itemUrl (item) {
  if ((item.type == 'broadcast' || item.type == 'show') && item.sites) {
    if (item.sites.indexOf('wgxc') != -1) {
      return '/wgxc/schedule/' + item.id;
    }
    if (item.sites.indexOf('transmissionarts') != -1) {
      return '/ta/schedule/' + item.id;
    }
  }
  if (item.type == 'event' && item.sites) {
    if (item.sites.indexOf('wgxc') != -1) {
      return '/wgxc/calendar/' + item.id;
    }
    if (item.sites.indexOf('transmissionarts') != -1) {
      return '/ta/calendar/' + item.id;
    }
  }
  if (item.type == 'news') {
  	if (item.sites) {
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
  if (item.type == 'artist' && item.categories && item.categories.indexOf('Transmission Artist') != -1) {
    return '/ta/artists/' + item.id;
  }
  if (item.type == 'work' && item.sites && item.sites.indexOf('transmissionarts') != -1) {
    return '/ta/works/' + item.id;
  }
  return '/archive/' + item.id;
}
