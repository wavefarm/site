module.exports = function () {

  // set up radio dial
  // for artists and works
	
  var nav = $('#alpha nav');
  if (!nav.length) return;

  var current, move;
  current = nav.find('a:contains("'+$('.letter-title').text()+'")');
  //current = $('.letter-title').text();
  
  

  radioDial(nav, current, move);

  // some ideas borrowed from 
  // http://stackoverflow.com/questions/4847726/how-to-animate-following-the-mouse-in-jquery
  function radioDial(nav, selected, move) {
    // do nothing if nav isn't on this page
    if (!nav.length) return;
    var x = selected.position().left;
    var w = selected.outerWidth();
    // divide width by 2 to hit center of div
    // arrow image is 20px wide
    var placement = x + w/2 - 10 - nav.position().left;
    //console.log(x);
    //console.log(w);
    //console.log(nav.position().left);
    var mouseX = placement;
    var rightEdge = nav.outerWidth()-23;
    nav.mousemove(function(e) {
      mouseX = e.pageX - nav.offset().left - 10;
      // keep the cursor from going over the edges of the nav
      if (mouseX < 0) mouseX = 0;
      if (mouseX > rightEdge) mouseX = rightEdge;
    });
    nav.mouseleave(function(e) {
      mouseX = placement;
    });
    var arrow = $('.arrow');
    var startSpot = placement;
    if (arrow.hasClass('move') || move) {
      startSpot = rightEdge;
    }
    var xp = startSpot;
    arrow.css('left', startSpot).css('display', 'block');
    setInterval(function() {
        var dodecachotomy = (mouseX - xp) / 12;
        // short circuit when we get close
        if (dodecachotomy < 0.001 && dodecachotomy > -0.001) {
          dodecachotomy = 0;
        } 
        xp += dodecachotomy;
        arrow.css({left: xp});
    }, 30);
  }
	

};