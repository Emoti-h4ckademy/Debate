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
                callback ("Couldn't reach Oxford Service server");
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
