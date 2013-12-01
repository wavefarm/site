;(function () {
  function current (section) { document.getElementById(section+'-nav').style.color = 'white'; }
  if (window.location.pathname == '/mag/artists') current('artists');
  else if (window.location.pathname == '/mag/organizations') current('organizations');
  else if (window.location.pathname == '/mag/map') current('map');
})();
