module.exports = function () {
  var dest; // pointer destination number of pixels
  var i; // iterator
  var intervalID; // ID for the rotation interval
  var loc; // current location of pointer
  var pointer; // pointer element
  var slides; // slide image elements
  var subIndex; // index for current sub
  var subPos; // subsite pointer positions
  var subs; // subsite elements

  pointer = document.getElementById('pointer');

  // Do nothing on pages without the pointer
  if (!pointer) return;

  slides = document.getElementsByClassName('slide');
  slideshow = document.getElementsByClassName('slideshow')[0];
  subs = document.getElementsByClassName('sub');

  // Pointer positions for subsites (each element is 210px wide)
  subPos = {
    ta: 348,
    wgxc: 558,
    mag: 768
  };

  // Pointer location and destination
  loc = dest = subPos.ta;

  subIndex = 0;

  function nextSub () {
    var i = subIndex + 1;
    return subs[i < subs.length ? i : 0]
  }

  function rotate () {
    focusSub(nextSub());
  }

  function startRotate () {
    intervalID = setInterval(rotate, 7000);
  }

  function stopRotate () {
    clearInterval(intervalID);
  }

  startRotate();

  // Set event listeners for hover
  for (i=0; i<subs.length; i++) {
    subs[i].addEventListener('mouseenter', function (event) {
      focusSub(event.toElement);
      stopRotate();
    });
    subs[i].addEventListener('mouseleave', function (event) {
      startRotate();
    });
  }
  slideshow.addEventListener('mouseenter', function (event) {
    stopRotate();
  });
  slideshow.addEventListener('mouseleave', function (event) {
    startRotate();
  });

  function focusSub (sub) {
    var i;
    var icon;

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
