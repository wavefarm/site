;(function () {
  function current (section) { document.getElementById(section+'-nav').style.color = 'white'; }
  if (window.location.pathname == '/wgxc/about') current('about');
  else if (window.location.pathname.indexOf('/wgxc/schedule')==0) current('schedule');
  else if (window.location.pathname == '/wgxc/newsroom') current('newsroom');
  else if (window.location.pathname == '/wgxc/volunteer') current('volunteer');
  else if (window.location.pathname.indexOf('/wgxc/calendar')==0) current('calendar');
  else if (window.location.pathname == '/wgxc/donate') current('support');  
})();
