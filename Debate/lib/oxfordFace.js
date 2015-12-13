var config = require('config'),
    request = require('request');
    fs = require('fs');
    path = require('path');
    hash = require('hash-string');

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
        error = "(" + response.statusCode + ") " + response.statusMessage;
    } else {
        error = false;
        faces = response.body;
    }

    callback (error, faces);
};

OxfordFace.prototype._getFaces = function (binaryImage, callback) {
    var self = this;
    var urlPlusOptions = self.faceBaseUrl; //No extra options

    return request({
        url: urlPlusOptions,
        method: "POST",
        json: false,
        body: binaryImage,
        headers: {
                "content-type" : "application/octet-stream",
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

OxfordFace.prototype._getFacesIds = function (directoryPath, callback) {
  var self = this;
      var files = fs.readdirSync(directoryPath);
      var faceIds = [];
      var faceImg;
      var error = [];

      var numberOfFiles = callsReamining = files.length;
      for (var i = 0; i < numberOfFiles; i++) {
        var filename = files[i];
        setTimeout(function(f){
          var fullPath = directoryPath + path.sep + f;
          var faceImg = fs.readFileSync(fullPath);
          self.detectFaces(faceImg, function(err, faces){
            --callsReamining;
            if(err) {
              error.push(err);
              console.log("_getFacesIds Error detecting face of " + fullPath + ", error: " + JSON.stringify(err));
            } else {
              var result = JSON.parse(faces)[0];
              faceIds.push({faceId : result.faceId, path : fullPath, date : new Date()});
              console.log("Face Id detected: " + result.faceId + ", path: " + fullPath + ", hash: " + hash(JSON.stringify(faceImg)));
            }
            if (callsReamining <= 0) {
              callback(error, faceIds);
            }
          });
        }(filename), 1);
      };
};

/**
 * Analyzes an image (binary) calling oxford API
 * @param {type} binaryImage
 * @param {type} callback (error, facesArray)
 * @returns {undefined}
 */
OxfordFace.prototype.detectFaces = function (binaryImage, callback) {
    var self = this;

    if (!binaryImage) {
        callback("Empty image");
        return;
    }

    self._getFaces(binaryImage, callback);
};

OxfordFace.prototype.createPerson = function (/*parameteres*/callback) {

    callback (/*error, oxfordPersonID*/true);
};

OxfordFace.prototype._getPersonGroup = function (personGroupID, callback) {
    var self = this;

    if (!personGroupID) {
        return callback ("Empty personGroupID");
    }

    var urlPlusOptions = self.personBaseUrl + "/" + personGroupID; //No extra options

    return request({
        url: urlPlusOptions,
        method: "PUT",
        json: {
              "name":       personGroupID,
              "userData":   personGroupID
        },
        headers: {
                "Ocp-Apim-Subscription-Key" : self.apiKey
            }
        }, function (error, response, body) {
            if (error) {
                callback ("Couldn't reach Oxford Service server");
            }
            else {
                self._parseGetFaceResponse(response, callback);
            }
        });
};


OxfordFace.prototype.createPersonGroup = function (personGroupID, callback) {
    var self = this;

    if (!personGroupID) {
        return callback ("Empty personGroupID");
    }

    self._getPersonGroup(personGroupID, callback);
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
