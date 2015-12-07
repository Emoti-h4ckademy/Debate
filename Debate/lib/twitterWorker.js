var Twitter = require('twitter');
var config = require('config');

var twitter = new Twitter({
  consumer_key: config.get('TWITTER_KEYS').CONSUMER_KEY,
  consumer_secret: config.get('TWITTER_KEYS').CONSUMER_SECRET,
  access_token_key: config.get('TWITTER_KEYS').ACCESS_TOKEN_KEY,
  access_token_secret: config.get('TWITTER_KEYS').ACCESS_TOKEN_SECRET
});

/**
 * Posts a new status in the user account
 * @param {type} message - Message to be posted
 * @param {type} options - Options to be used, such as media
 * @param {type} callback (error, tweet)
 * @returns {undefined}
 */
exports._tweetStatus = function (message, options, callback){
    options = options || {};
    if (typeof(message) !== "string" || typeof(options) !== "object") {
        callback ("Invalid parameters");
        return;
    }
    options.status = message;
    console.log("Tweeting: " + JSON.stringify(options));
    twitter.post('statuses/update', options,  function(error, tweet){
        callback(error, tweet);
    });
};

/**
 * Posts media to Twitter to be used later
 * @param {type} image - Base64 image
 * @param {type} callback (error, twitterMediaID)
 * @returns {undefined}
 */
exports._tweetMedia = function(image, callback){
    if (!image || typeof(image) !== "string") {
        callback("Invalid image");
        return;
    }
    
    twitter.post('media/upload', {media_data: image},  function(error, media, response){
        callback(error, media.media_id_string);
    });
};

/**
 * Post a new Status in the user account
 * @param {type} message - Status message
 * @param {type} image - Image to be posted. Use undefined or base64 image
 * @param {type} callback (error, tweet)
 * @returns {undefined}
 */
exports.postTweet = function (message, image, callback) {
    var self = this;

    if (!image) {
        self._tweetStatus(message, {}, callback);
    } else {
        self._tweetMedia(image, function (error, mediaString) {
            if (error) {
                callback("Tweet media error: " + error);
                return;
            }
            self._tweetStatus(message, {"media_ids" : mediaString}, callback);
        });
    }
};