module.exports = function () {
  var dest; // pointer destination number of pixels
  var i; // iterator
  var loc; // current location of pointer
  var pointer; // pointer element
  var rotate; // boolean for start/stop of auto-rotation
  var slides; // slide image elements
  var subPos; // subsite pointer positions
  var subs; // subsite elements

  pointer = document.getElementById('pointer');

  // Do nothing on pages without the pointer
  if (!pointer) return;

  // Pointer positions for subsites (each element is 210px wide)
  subPos = {
    ta: 348,
    wgxc: 558,
    mag: 768
  };

  // Pointer location and destination
  loc = dest = subPos.ta;

  // Whether to rotate through the subsites automatically
  // (stopped by mouse hover)
  rotate = true;

  slides = document.getElementsByClassName('slide');
  subs = document.getElementsByClassName('sub');

  // Set event listeners for hover
  for (i=0; i<subs.length; i++) {
    subs[i].addEventListener('mouseenter', function (event) {
      focusSub(event.toElement);
    })
    subs[i].addEventListener('mouseleave', function (event) {

    });
  }

  function focusSub (sub) {
    var i;
    var icon;
    var subIndex;

    for (i=0; i<subs.length; i++) {
      // Fade all icons
      icon = subs[i].getElementsByClassName('subicon')[0];
      icon.style.backgroundPositionY = '-60px';

      // Grab index for slides
      if (subs[i] === sub) {subIndex = i}
    }

    // Make this icon brighter
    icon = sub.getElementsByClassName('subicon')[0];
    icon.style.backgroundPositionY = '0px';

    // Hide all slides
    for (i=0; i<slides.length; i++) {
      slides[i].style.display = 'none';
    }

    // Grab slide element
    slide = slides[subIndex];

    // Show corresponding slide
    slide.style.display = 'block';

    // Move pointer
    dest = subPos[sub.classList[0]];
  }

  setInterval(function() {
    var dodecachotomy = (dest - loc) / 12;
    // short circuit when we get close
    if (dodecachotomy < 0.001 && dodecachotomy > -0.001) {
      return;
    } 
    loc += dodecachotomy;
    pointer.style.left = loc+'px';
  }, 30);
};
