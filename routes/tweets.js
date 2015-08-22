var Twit = require('twit')

function getTwits (opts) {
  opts = opts || {}

  var creds = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
  var handle = 'free103point9'

  if (opts.wgxc) {
    creds = {
      consumer_key: process.env.WGXC_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.WGXC_TWITTER_CONSUMER_SECRET,
      access_token: process.env.WGXC_TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.WGXC_TWITTER_ACCESS_TOKEN_SECRET
    }
    handle = 'WGXC'
  }

  // noop if no twitter credentials
  if (!creds.consumer_key) {
    return function (req, res) {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 401
      res.end('{"message": "Unauthorized"}')
    }
  }

  var twit = new Twit(creds)

  var cache = {
    tweets: null,
    updated: null
  }

  return function (req, res) {
    var now = Date.now()
    res.setHeader('Content-Type', 'application/json')

    // Serve cache if less than a minute old
    if (cache.tweets && cache.updated > (now - 60000)) {
      return res.end(cache.tweets)
    }

    twit.get('statuses/user_timeline', {
      screen_name: handle,
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
}

module.exports = getTwits
