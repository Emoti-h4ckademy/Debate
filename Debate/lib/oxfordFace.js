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

/**
 * Parses an Oxford Response to the FACE API
 * @param {type} response - Response from Oxford
 * @param {type} body - Body response
 * @param {type} callback (error, data)
 * @returns {undefined}
 */
OxfordFace.prototype._parseResponse = function (response, body, callback) {
    var data;
    var error;

    if (!response) {
        callback ("Empty response");
        return;
    }

    if (response.statusCode !== 200) {
        error = "(" + response.statusCode + ") " + response.statusMessage + ": " + body.code + "->" + body.message;
    } else {
        error = false;
        data = response.body;
    }

    callback (error, data);
};

/**
 * Given a binary image, it communicates with Oxofrd to detect the faces in it
 * @param {type} binaryImage
 * @param {type} callback (error, data)
 * @returns {unresolved}
 */
OxfordFace.prototype._getFaces = function (binaryImage, callback) {
    var self = this;
    var urlPlusOptions = self.faceBaseUrl; //No extra options

    return request({
        url:        urlPlusOptions,
        method:     "POST",
        json:       false,
        body:       binaryImage,
        headers: {
            "content-type" :                "application/octet-stream",
            "Ocp-Apim-Subscription-Key" :   self.apiKey
        }
    }, function (error, response, body) {
        if (error) {
            callback("Could not connect with Oxford");
        } else {
            self._parseResponse(response, body, callback);
        }
    });
};

/**
 * Creates a new PersonGroup in the Oxford System
 * @param {type} groupId - User-provided personGroupId as a string.
 * @param {type} name - Person group display name
 * @param {type} userGroupData - User-provided data attached to the person group
 * @param {type} callback (error, data)
 * @returns {unresolved}
 */
OxfordFace.prototype._createPersonGroup = function (groupId, name, userGroupData, callback) {
    var self = this;
    var urlPlusOptions = self.personBaseUrl + '/' + groupId; //No extra options

    return request({
        url:        urlPlusOptions,
        method:     "PUT",
        json:       true,
        body:
        {
            name :      name,
            userData :  userGroupData
        },
        headers: {
            "content-type" :                "application/json",
            "Ocp-Apim-Subscription-Key" :   self.apiKey
        }
    }, function (error, response, body) {
        if (error) {
            callback("Could not connect with Oxford");
        } else {
            self._parseResponse(response, body, callback);
        }
    });
};

/**
 * 
 * @param {type} faceIds - Array of person face Ids. The maximum face count is 32.
 * @param {type} groupId - The target person's belonging person group's ID.
 * @param {type} name - Target person's display name. 
 * @param {type} userData - Optional fields for user-provided data attached to a person. 
 * @param {type} callback (error, data)
 * @returns {unresolved}
 */
OxfordFace.prototype._createPerson = function (groupId, faceIds, name, userData, callback) {
    var self = this;
    var urlPlusOptions = self.personBaseUrl + '/' + groupId + '/persons';

    return request({
        url:    urlPlusOptions,
        method: "POST",
        json:   true,
        body:
        {
            faceIds :   faceIds,
            name :      name,
            userData :  userData
        },
        headers: {
            "content-type" :              "application/json",
            "Ocp-Apim-Subscription-Key" : self.apiKey
        }
    }, function (error, response, body) {
        if (error) {
            callback("Could not connect with Oxford");
        } else {
            self._parseResponse(response, body, callback);
        }
    });
};

/**
 * Communicates with Oxford to train a personGroup
 * @param {type} groupId - Target person group to be trained.
 * @param {type} callback - (error, data)
 * @returns {unresolved}
 */
OxfordFace.prototype._trainPersonGroup = function (groupId, callback) {
    var self = this;
    var urlPlusOptions = self.personBaseUrl + '/' + groupId + '/training';

    return request({
        url:    urlPlusOptions,
        method: "POST",
        json:   false,
        headers: {
            "Ocp-Apim-Subscription-Key" : self.apiKey
        }
    }, function (error, response, body) {
        if (error) {
            callback("Could not connect with Oxford");
        } else {
            self._parseResponse(response, body, callback);
        }
    });
};

/**************************** PUBLIC **********************************
***************************** PUBLIC **********************************
***************************** PUBLIC **********************************
***************************** PUBLIC **********************************/


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

/**
 * Creates a personGroup in Oxford
 * @param {type} personGroupID - User-provided personGroupId as a string.
 * @param {type} name - Human name to give to the group in the Oxford System
 * @param {type} callback (error)
 * @returns {undefined}
 */
OxfordFace.prototype.createPersonGroup = function (personGroupID, name, callback) {
    var self = this;

    if (!personGroupID || !name) {
        callback ("Invalid parameters");
    } else {
        self._createPersonGroup(personGroupID, name, name, callback);
    }
};

/**
 * Creates a Person in Oxford
 * @param {type} personGroupID - The target person's belonging person group's ID.
 * @param {type} faceIDs - Array of facesIDs to be used
 * @param {type} name - Human name for the Person in the Oxford System
 * @param {type} callback (error, data)
 * @returns {undefined}
 */
OxfordFace.prototype.createPerson = function (personGroupID, faceIDs, name, callback) {
    var self = this;

    if (!personGroupID || !name || !faceIDs) {
        callback ("Invalid parameters");
        return;
    }
    
    if(!Array.isArray(faceIDs))
    {
        callback ("faceIDs must be an array");
        return;
    }
    
    self._createPerson(personGroupID, faceIDs, name, name, callback);
};

/**
 * Ask nicely to Oxford to train certain group
 * @param {type} personGroupID - Target person group to be trained.
 * @param {type} callback (error, data)
 * @returns {undefined}
 */
OxfordFace.prototype.trainPersonGroup = function (personGroupID, callback) {
    var self = this;
        
    if (!personGroupID) {
        callback ("Invalid group id");
    } else {
        self._trainPersonGroup(personGroupID, callback);
    }
};


OxfordFace.prototype.checkProjectStatus = function (/*parameteres*/callback) {

  callback (/*error, status*/true);
};

OxfordFace.prototype.identifyPersona = function (/*parameteres*/callback) {

  callback (/*error, persona*/true);
};



module.exports = new OxfordFace();
