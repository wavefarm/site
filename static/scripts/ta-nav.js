;(function () {
  function current (section) { document.getElementById(section+'-nav').style.color = 'white'; }
  function current2nd (section) { document.getElementById(section+'-nav').style.color = '#ffcd32'; }
  
  if (window.location.pathname == '/ta/residencies') current('residencies');
  else if (window.location.pathname == '/ta/schedule') current('schedule');
  else if (window.location.pathname == '/ta/calendar') current('calendar');
  else if (window.location.pathname.indexOf('/ta/support')==0) current('support');
  
  else if (window.location.pathname.indexOf('/ta/archive')==0)	{ 
  	document.getElementById('nav-secondary-ta').style.display = 'block'; 
  	current('archive');
  }
  else if (window.location.pathname.indexOf('/ta/artists')==0) { 
  	document.getElementById('nav-secondary-ta').style.display = 'block'; 
  	current('archive'); 
  	current2nd('artists'); 
  }
  else if (window.location.pathname.indexOf('/ta/works')==0) { 
  	document.getElementById('nav-secondary-ta').style.display = 'block'; 
  	current('archive'); 
  	current2nd('works');
  }
  else if (window.location.pathname.indexOf('/ta/research')==0) { 
  	document.getElementById('nav-secondary-ta').style.display = 'block'; 
  	current('archive'); 
  	current2nd('research');
  }
  
})();
