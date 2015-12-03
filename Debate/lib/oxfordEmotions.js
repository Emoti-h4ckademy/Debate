var config = require('config'),
    request = require('request');

/**
 * Oxford constructor.
 *
 * The exports object of the `oxford` module is an instance of this class.
 * Most apps will only use this one instance.
 *
 * @api public
 */

function Oxford () {
    this.oxfordApiKey = process.env.OXFORD_EMOTION_API_KEY || config.get('OXFORD_EMOTION_API_KEY');
    this.oxfordUrl = process.env.OXFORD_EMOTION_URL || config.get('OXFORD_EMOTION_URL');
    /**
     * Response when either an error is found or no emotions are detected
     */
    this.emptyResponse = "[]";
    /**
     * Main emotion when an error is found or no emotions where detected
     */
    this.emptyEmotion = {emotion: undefined, max: undefined};
}

/**
 * Extract the main emotion from a PARSED Oxford Response
 * @param {type} responseObj PARSED response
 * @param {type} position Select which of the faces in the response to calculate
 * @returns JSON in the form {emotion: String, max: number}
 *  if there's an error it returns this.emptyEmotion
 */
Oxford.prototype.extractMainEmotion = function(responseObj, position) {
    position = position || 0;
    
    if ((!responseObj) || (responseObj === this.emptyResponse))
    {
        return this.emptyEmotion;
    }
    
    var faces = JSON.parse(responseObj);
    if (position >= faces.length)
    {
        return this.emptyEmotion;
    }

    var scores = faces[position].scores;
    if (!scores) {
        return this.emptyEmotion;
    }
    
    var tempVal = 0, max = 0;
    var emotion;
    for(var key in scores) {
        tempVal = scores[key];
        if (tempVal > max) {
            max = tempVal;
            emotion = key;
        }
    }
    return {emotion : emotion, max: max};
    
};

/**
 * Parses the response of the Oxford API returning to check for errors
 * @param {type} response - Response from the API
 * @param {type} callback - Function to be callback (error, emotionArray)
 * If an error is found, error will contain an error message an emotionArray will
 * be equal to emptyResponse
 * @returns {undefined}
 */
Oxford.prototype._parseResponse = function (response, callback) {
    var emotion;
    var err;
    
    if (!response) {
        callback ("Empty response", this.emptyResponse);
        return;
    }

    if (response.statusCode !== 200) {
        err = response.statusMessage;
        var message;
        try {
            message = JSON.parse(response.body).message;
        } catch (error) {
            message = response.body;
        }
        err += ": " + message;
        emotion = this.emptyResponse;
    } else {
        err = false;
        emotion = response.body;
    }

    callback (err, emotion);
};

/**
 * Handles the comunication with the API
 * @param {type} image Image to be sent
 * @param {type} callback (error, emotionArray). This function internally
 * will call _parseResponse so refer to its documentation for the callback
 * @returns {undefined}
 */
Oxford.prototype._getEmotion = function (image, callback) {
    var self = this;    
    var oxfordContentType = "application/octet-stream";

    return request({
        url: self.oxfordUrl,
        method: "POST",
        json: false,
        body: image,
        headers: {
                "content-type" : oxfordContentType,
                "Ocp-Apim-Subscription-Key" : self.oxfordApiKey
            }
        }, function (error, response, body) {
            if (error) {
                callback ("Couldn't reach Oxford Service server", self.emptyResponse);
            }
            else {
                self._parseResponse(response, callback);
            }
        });
};

/**
 *
 * @param {type} imageB64 Image to be check in base64
 * @param {type} callback Function to be callback (error, emotionArray)
 * If an error is found, error will contain an error message an emotionArray will
 * be equal to emptyResponse
 * @returns {undefined}
 */
Oxford.prototype.recognizeImageB64 = function (imageB64, callback) {
    var self = this;
    
    if (!imageB64) {
        callback("Empty image", self.emptyResponse);
        return;
    }
    
    var buf = Buffer(imageB64, 'base64');
    self._getEmotion(buf, callback);
};

/*!
 * The exports object is an instance of Oxford.
 *
 * @api public
 */

var oxford = module.exports = exports = new Oxford();