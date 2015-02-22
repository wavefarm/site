var fade = require('fade');
var concat = require('concat-stream');
var http = require('http')
var moment = require('moment')


module.exports = function () {
	
  var path = '/tweets';
  var baseHref = '//twitter.com/free103point9/status/';
	
  // move tweets to top for wgxc
  if (window.location.pathname.indexOf('/wgxc')==0) {
	  
	path = '/wgxc/tweets';
	baseHref = '//twitter.com/WGXC/status/';
	  	  
    var tweetsContainer = $('.tweets-container');
    tweetsContainer.remove();
    $('.nav').after(tweetsContainer);
  }
	
	
  http.get({path: path}, function (res) {
    res.pipe(concat(function (data) {
      var i, a, t, current, next, tweetsDiv, tweets = JSON.parse(data);
      // Append to .tweets
      tweetsDiv = document.getElementsByClassName('tweets')[0];
      for (i=0; i<tweets.length; i++) {
        t = tweets[i];
        a = document.createElement('a');
        a.setAttribute('class', 'tweet');
        a.setAttribute('target', '_blank');
        a.setAttribute('href', baseHref + t.id);
        a.innerHTML = t.text + ' (' + moment(t.timestamp, 'MMM DD HH:mm:ss ZZ YYYY').fromNow() + ')';
        tweetsDiv.appendChild(a);
      }
      // Cycle through them, displaying one at a time
      tweets = tweetsDiv.getElementsByClassName('tweet');
      current = tweets[i=0];
      current.style.display = 'inline';
      setInterval(function () {
        if (++i >= tweets.length) i = 0;
        next = tweets[i];
        fade.out(current, function () {
          current.style.display = 'none';
          fade.in(current); // fade it back in for the next cycle
          next.style.display = 'inline';
          current = next;
        });
      }, 8000);
    }));
  });
};
