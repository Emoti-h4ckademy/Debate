var Twitter = require('twitter');
var Twit = require('twit')
var config = require('config');
var fs = require('fs');
var _ = require('underscore');

var T = new Twit({
  consumer_key: config.get('TWITTER_KEYS').CONSUMER_KEY,
  consumer_secret: config.get('TWITTER_KEYS').CONSUMER_SECRET,
  access_token: config.get('TWITTER_KEYS').ACCESS_TOKEN_KEY,
  access_token_secret: config.get('TWITTER_KEYS').ACCESS_TOKEN_SECRET
});

var client = new Twitter({
  consumer_key: config.get('TWITTER_KEYS').CONSUMER_KEY,
  consumer_secret: config.get('TWITTER_KEYS').CONSUMER_SECRET,
  access_token_key: config.get('TWITTER_KEYS').ACCESS_TOKEN_KEY,
  access_token_secret: config.get('TWITTER_KEYS').ACCESS_TOKEN_SECRET
});

exports.tweet = function ( message, options, callback ){
  var defaultOptions =  { status: message } ;

  options = _.extend( defaultOptions, options );
  client.post('statuses/update', options ,  function(err, tweet){
    if(err) console.log(err);
    callback(err, tweet );
  });

};

exports.postTweet = function (message, image, callback) {
  var options  = {};

  if ( image ){
    var that = this ;
    this.uploadImage(image, function(err, imageTweet){
      if ( err ) throw err;
      options.media_ids = imageTweet.media_id_string;
      return that.tweet( message, options , callback );
    });
    return ;
  }
  this.tweet( message, options, callback );
};

exports.prepareAnImageAsBase64 = function( file, callback ){
  var options ={flags: 'r', encoding: 'base64'} ;

  fs.readFile( file , options, function( err, data ){
    var data = fs.readFileSync( file, options )
    return callback( err, data );
  });
};

exports.uploadImage = function( file, callback ){

  this.prepareAnImageAsBase64( file , function( err, base64Image ){

    if(err) console.log(err);

    client.post('media/upload', {media_data: base64Image},  function(err, tweet, response){
      if(err) console.log(err);

      console.log("Just twitted: " + tweet);  // Tweet body.
      console.log("Response from twitter: " + response);  // Raw response object.
      callback(err , tweet);

    });

  });
};

exports.tweetWithMedia = function(text, data, callback) {
  var b64content = data;

  // first we must post the media to Twitter
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {

    // now we can reference the media and post a tweet (media will attach to the tweet)
    var mediaIdStr = data.media_id_string;
    var params = { status: text, media_ids: [mediaIdStr] }

    T.post('statuses/update', params, function (err, data, response) {
      callback(err, data);
    });
  });
};
