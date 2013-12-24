;(function () {
  $.getJSON('/tweets', function (tweets) {
    var i = 0,
      $tweets = $('.tweets'),
      $current,
      $next;
    // Create tweet elements and append them to tweets
    $.each(tweets, function (tweet) {
      $tweet = $('<a class="tweet" href="//twitter.com/free103point9/status/' + tweet.id + '">' + tweet.text + '</a>');
      $tweets.append($tweet);
    });
    // Cycle through them, displaying one at a time
    console.log($tweets);
    $tweets[0].show();
    setInterval(function () {
      i++;
      if (i < tweets.length) {
        $next = $tweets[i];
      } else {
        $next = $tweets[0];
      }
      $current.slideUp();
      $next.slideDown();
      $current = $next;
    }, 5000);
  });
})();
