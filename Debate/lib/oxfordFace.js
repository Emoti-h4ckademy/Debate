var config = require('config'),
request = require('request');

/**
* OxfordFace constructor.
*/
function OxfordFace() {
  this.apiKey               = config.get('OXFORD_FACE_API_KEY');
  this.faceBaseUrl          = config.get('OXFORD_FACE_DETECTION_URL');
  this.personBaseUrl        = config.get('OXFORD_PERSON_URL');
  this.identificationUrl    = config.get('OXFORD_IDENTIFICATIONS_URL'); 
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

    if (response.statusCode < 200 || response.statusCode >= 300) {
        error = response.statusMessage + "(" + response.statusCode + ")" + (body.code ? " " + body.code : "") + ": " + body.message;
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
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0375749c3f70a50e79b82
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
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0387249c3f70a50e79b84
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
 * Creates a new person in a specified person group for identification. 
 * @param {type} faceIds - Array of person face Ids. The maximum face count is 32.
 * @param {type} groupId - The target person's belonging person group's ID.
 * @param {type} name - Target person's display name. 
 * @param {type} userData - Optional fields for user-provided data attached to a person. 
 * @param {type} callback (error, data)
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f153f149c3f7124859da42
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
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f55e6b49c3f712f472478d
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

/**
 * Calls Oxford API to retrieve the training status of a person group
 * @param {type} groupId - The id of target person group.
 * @param {type} callback (error, data)
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f55e803d8a4b1048bada87 
 * @returns {unresolved}
 */
OxfordFace.prototype._getTrainStatus = function (groupId, callback) {
    var self = this;
    var urlPlusOptions = self.personBaseUrl + '/' + groupId + '/training';

    return request({
        url:    urlPlusOptions,
        method: "GET",
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

/**
 * Calls Oxford API to try to match a faceID to a person in a group
 * @param {type} faceIDs - Array to faceIds to be identified
 * @param {type} personGroupID - The id of target person group.
 * @param {type} callback (error, data)
 * API doc: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0391149c3f70a50e79b87
 * @returns {unresolved}
 */
OxfordFace.prototype._identifyFaces = function (faceIDs, personGroupID, callback) {
    var self = this;
    var urlPlusOptions = self.identificationUrl;
    
    return request({
        url:    urlPlusOptions,
        method: "POST",
        json:   true,
        body:
        {
            faceIds                     :   faceIDs,
            personGroupId               :   personGroupID,
            maxNumOfCandidatesReturned  : 1
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

/**************************** PUBLIC **********************************
***************************** PUBLIC **********************************
***************************** PUBLIC **********************************
***************************** PUBLIC **********************************/


/**
* Analyzes an image (binary) calling oxford API
* @param {type} binaryImage
* @param {type} callback (error, data)
* data format: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0375749c3f70a50e79b82
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
 * data format: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f153f149c3f7124859da42
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
 * Starts a person group training
 * @param {type} personGroupID - Target person group to be trained.
 * @param {type} callback (error, data)
 * data format: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f55e6b49c3f712f472478d
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

/**
 * Retrieves the training status of a person group. 
 * @param {type} personGroupID - The id of target person group.
 * @param {type} callback (error, data)
 * data format: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f55e803d8a4b1048bada87
 * @returns {undefined} 
 */
OxfordFace.prototype.checkGroupStatus = function (personGroupID, callback) {
    var self = this;
        
    if (!personGroupID) {
        callback ("Invalid group id");
    } else {
        self._getTrainStatus(personGroupID, callback);
    }
};

/**
 * Identifies persons from a person group by one or more input faces. 
 * @param {type} faceIDs - Array of the faces to be identified
 * @param {type} personGroupID - Target person group's ID 
 * @param {type} callback (error, data)
 * data format: https://dev.projectoxford.ai/docs/services/54d85c1d5eefd00dc474a0ef/operations/54f0391149c3f70a50e79b87
 * @returns {undefined}
 */
OxfordFace.prototype.identifyPersona = function (faceIDs, personGroupID, callback) {
    var self = this;

    if (!personGroupID || !faceIDs) {
        callback ("Invalid parameters");
        return;
    }
    
    if(!Array.isArray(faceIDs))
    {
        callback ("faceIDs must be an array");
        return;
    }
    
    self._identifyFaces(faceIDs, personGroupID, callback);
};

module.exports = new OxfordFace();
