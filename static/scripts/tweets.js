$.getJSON('/tweets', function (tweets) {
  var i = 0,
    $tweet,
    $current,
    $next;
  // Append to .tweets
  $('.tweets').append($.map(tweets, function (tweet) {
    return '<a class="tweet" target="_blank" href="//twitter.com/free103point9/status/' + tweet.id + '">' + tweet.text + '</a>';
  }).join(''));
  // Cycle through them, displaying one at a time
  $tweet = $('.tweet');
  $current = $($tweet[i]);
  $current.show();
  setInterval(function () {
    i++;
    if (i >= $tweet.length) i = 0;
    $next = $($tweet[i]);
    $current.hide(function () {
      $next.show();
      $current = $next;
    });
  }, 8000);
});
