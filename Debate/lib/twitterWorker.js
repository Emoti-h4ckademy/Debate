var Twitter = require('twitter');
var config = require('config');
var fs = require('fs');

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

exports.prepareAnImageAsBase64 = function( file, callback ){
    var options ={flags: 'r', encoding: 'base64'} ;

    fs.readFile( file , options, function( err, data ){
        callback( err, data );
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
}
