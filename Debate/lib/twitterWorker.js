var Twitter = require('twitter');
var config = require('config');

var client = new Twitter({
  consumer_key: config.get('TWITTER_KEYS').CONSUMER_KEY,
  consumer_secret: config.get('TWITTER_KEYS').CONSUMER_SECRET,
  access_token_key: config.get('TWITTER_KEYS').ACCESS_TOKEN_KEY,
  access_token_secret: config.get('TWITTER_KEYS').ACCESS_TOKEN_SECRET
});

exports.postTweet = function (message, image, callback) {
  client.post('statuses/update', {status: message},  function(error, tweet, response){
    if(error) console.log(error);
    console.log("Just twitted: " + tweet);  // Tweet body.
    console.log("Response from twitter: " + response);  // Raw response object.
    callback(error, tweet, response);
  });
};
