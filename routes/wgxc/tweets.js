var Twit = require('twit')

if (typeof(process.env.WGXC_TWITTER_CONSUMER_KEY)=='undefined') {
	var twit = new Twit({
	  consumer_key: process.env.TWITTER_CONSUMER_KEY,
	  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	  access_token: process.env.TWITTER_ACCESS_TOKEN,
	  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	})
	var screenName = 'free103point9';
}
else {
	var twit = new Twit({
	  consumer_key: process.env.WGXC_TWITTER_CONSUMER_KEY,
	  consumer_secret: process.env.WGXC_TWITTER_CONSUMER_SECRET,
	  access_token: process.env.WGXC_TWITTER_ACCESS_TOKEN,
	  access_token_secret: process.env.WGXC_TWITTER_ACCESS_TOKEN_SECRET
	})
	var screenName = 'WGXC';
}
var cache = {
  tweets: null,
  updated: null
}

module.exports = function (req, res) {
  var now = Date.now()
  res.setHeader('Content-Type', 'application/json')

  // Serve cache if less than a minute old
  if (cache.tweets && cache.updated > (now - 60000)) {
    return res.end(cache.tweets)
  }

  twit.get('statuses/user_timeline', {
    screen_name: screenName,
    count: 10,
    trim_user: true
  }, function (err, reply) {
    if (err) {
      console.error(err.message)
      res.statusCode = 500
      return res.end(JSON.stringify({
        error: err.message
      }))
    }

    cache.updated = now
    cache.tweets = JSON.stringify(reply.map(function (tweet) {
      return {
        id: tweet.id_str,
        timestamp: tweet.created_at,
        text: tweet.text
      }
    }))
    res.end(cache.tweets)
  })
}
