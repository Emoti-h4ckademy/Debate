var config = require('config'),
    request = require('request');

/**
 * OxfordFace constructor.
 */
function OxfordFace() {
    this.apiKey         = config.get('OXFORD_FACE_API_KEY');
    this.faceBaseUrl    = config.get('OXFORD_FACE_DETECTION_URL');
    this.personBaseUrl  = config.get('OXFORD_PERSON_URL');
}
/*
 * Good response body: As we do not ask for any options
 * [
        {
            "faceId": "c5c24a82-6845-4031-9d5d-978df9175426",
            "faceRectangle": {
                "top": 54,
                "left": 394,
                "width": 78,
                "height": 78
            }
            "attributes":{}
        }
    ]
 */

OxfordFace.prototype._parseGetFaceResponse = function (response, callback) {
    var faces;
    var error;

    if (!response) {
        callback ("Empty response");
        return;
    }

    if (response.statusCode !== 200) {
        error = response.statusMessage;
        var message;
        var code;
        try {
            code = JSON.parse(response.body).code;
            message = JSON.parse(response.body).message;
            error += "("+message+"): " + code;
        } catch (error) {
            message = response.body;
            error += ": " + message;
        }
    } else {
        error = false;
        faces = response.body;
    }

    callback (error, faces);
};

OxfordFace.prototype._getFaces = function (binaryImage, callback) {
    var self = this;
    var oxfordContentType = "application/octet-stream";

    var urlPlusOptions = self.faceBaseUrl; //No extra options

    return request({
        url: urlPlusOptions,
        method: "POST",
        json: false,
        body: binaryImage,
        headers: {
                "content-type" : oxfordContentType,
                "Ocp-Apim-Subscription-Key" : self.apiKey
            }
        }, function (error, response, body) {
            if (error) {
                callback (error);
            }
            else {
                self._parseGetFaceResponse(response, callback);
            }
        });

};

/**
 * Analyzes an image (binary) calling oxford API
 * @param {type} binaryImage
 * @param {type} callback (error, facesArray)
 * @returns {undefined}
 */
OxfordFace.prototype.detectFaces = function (binaryImage) {
  return new Promise (function (resolve, reject) {
    var self = this;

    if (!binaryImage) {
        callback("Empty image");
        return;
    }

    self._getFaces(binaryImage, function(error, faces){
      if(error){
        return reject(err);
      }
      console.log('oxfordFace.detectFaces: ' + JSON.stringify(faces));
      return resolve(faces);
    });

  });

};

OxfordFace.prototype.createPerson = function (/*parameteres*/callback) {

    callback (/*error, oxfordPersonID*/true);
};

OxfordFace.prototype.createProject = function (/*parameteres*/callback) {

    callback (/*error, oxfordPersonGroupID*/true);
};

OxfordFace.prototype.trainProject = function (/*parameteres*/callback) {

    callback (/*error, status*/true);
};

OxfordFace.prototype.checkProjectStatus = function (/*parameteres*/callback) {

    callback (/*error, status*/true);
};

OxfordFace.prototype.identifyPersona = function (/*parameteres*/callback) {

    callback (/*error, persona*/true);
};


module.exports = new OxfordFace();
