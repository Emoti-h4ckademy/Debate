var config = require('config'),
    request = require('request');

/**
 * OxfordEmotion constructor.
 *
 * The exports object of the `oxford` module is an instance of this class.
 * Most apps will only use this one instance.
 *
 * @api public
 */

function OxfordEmotion () {
    this.apiKey = process.env.OXFORD_EMOTION_API_KEY || config.get('OXFORD_EMOTION_API_KEY');
    this.url = process.env.OXFORD_EMOTION_URL || config.get('OXFORD_EMOTION_URL');
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
 * Extract the main emotion from a PARSED Oxford Emotion Response
 * @param {type} responseObj PARSED response
 * @param {type} position Select which of the faces in the response to calculate
 * @returns JSON in the form {emotion: String, max: number}
 *  if there's an error it returns this.emptyEmotion
 */
OxfordEmotion.prototype.extractMainEmotion = function(responseObj, position) {
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
 * Parses the response of the Oxford Emotion API returning to check for errors
 * @param {type} response - Response from the API
 * @param {type} callback - Function to be callback (error, emotionArray)
 * If an error is found, error will contain an error message an emotionArray will
 * be equal to emptyResponse
 * @returns {undefined}
 */
OxfordEmotion.prototype._parseResponse = function (response, callback) {
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
 * Handles the comunication with the Oxford Emotion API
 * @param {type} image Image to be sent
 * @param {type} callback (error, emotionArray). This function internally
 * will call _parseResponse so refer to its documentation for the callback
 * @returns {undefined}
 */
OxfordEmotion.prototype._getEmotion = function (image, callback) {
    var self = this;    
    var oxfordContentType = "application/octet-stream";

    return request({
        url: self.url,
        method: "POST",
        json: false,
        body: image,
        headers: {
                "content-type" : oxfordContentType,
                "Ocp-Apim-Subscription-Key" : self.apiKey
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
 * Analyzes an image emotions
 * @param {type} imageB64 Image to be check in base64
 * @param {type} callback Function to be callback (error, emotionArray)
 * If an error is found, error will contain an error message an emotionArray will
 * be equal to emptyResponse
 * @returns {undefined}
 */
OxfordEmotion.prototype.recognizeImageB64 = function (imageB64, callback) {
    var self = this;
    
    if (!imageB64) {
        callback("Empty image", self.emptyResponse);
        return;
    }
    
    var buf = Buffer(imageB64, 'base64');
    self._getEmotion(buf, callback);
};

/*!
 * The exports object is an instance of OxfordEmotion.
 *
 * @api public
 */

module.exports = new OxfordEmotion();