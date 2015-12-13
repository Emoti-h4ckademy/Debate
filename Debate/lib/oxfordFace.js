var config = require('config'),
request = require('request');
fs = require('fs');
path = require('path');
hash = require('hash-string');
PersonCtrl = require('../controllers/person');

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
          console.log("OxfordFace._getFacesIds: ERROR detecting face of " + fullPath + ", error: " + JSON.stringify(err));
        } else {
          var result = JSON.parse(faces)[0];
          faceIds.push({oxfordFaceID : result.faceId, path : fullPath, date : new Date()});
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

OxfordFace.prototype.createPerson = function (directoryPath, name, userData, groupId, callback) {
  var self = this;

  // Step 1: get faces ids for files in directoryPath
  self._getFacesIds (directoryPath, function(error, result){
    if(error) console.log("OxfordFace.createPerson - self._getFacesIds ERROR: " + error);
    var faceIds = [];
    for(var elem in result){
      faceIds.push(result[elem].oxfordFaceID);
    }
    // Step 2: create a person in Oxford with the given faces ids
    self._oxfordCallCreatePerson(faceIds, name, userData, groupId, function(error, oxfordPersonID){
      if(error) console.log("OxfordFace.createPerson - self._oxfordCallCreatePerson ERROR: " + error);
      // Step 3: save person in database
      PersonCtrl.createPerson(name, faceIds, oxfordPersonID, function(error, person){
        if(error) console.log("OxfordFace.createPerson PersonCtrl._createPerson ERROR: " + error);
        callback(error, person);
      });
    });
  });
};

OxfordFace.prototype._oxfordCallCreatePerson = function (faceIds, name, userData, groupId, callback) {
  var self = this;
  var urlPlusOptions = self.personBaseUrl + '/' + groupId + 'persons'; //No extra options

  return request({
    url: urlPlusOptions,
    method: "POST",
    json: true,
    body:
    {
      faceIds : faceIds,
      name : name,
      userData : userData
    },
    headers: {
      "content-type" : "application/json",
      "Ocp-Apim-Subscription-Key" : self.apiKey
    }
  }, function (error, response, body) {
    if (error) {
      console.log("OxfordFace._oxfordCallCreatePerson ERROR: " + JSON.stringify(error));
    }
    console.log("Oxford Person response: " + JSON.stringify(body));
    callback(error, body);
  });
};

OxfordFace.prototype._oxfordCallCreatePersonGroup = function (groupId, name, userGroupData, callback) {
  var self = this;
  var urlPlusOptions = self.personBaseUrl + '/' + groupId; //No extra options

  return request({
    url: urlPlusOptions,
    method: "POST",
    json: true,
    body:
    {
      name : name,
      userData : userGroupData
    },
    headers: {
      "content-type" : "application/json",
      "Ocp-Apim-Subscription-Key" : self.apiKey
    }
  }, function (error, response, body) {
    if (error) {
      console.log("OxfordFace._oxfordCallCreatePersonGroup ERROR: " + JSON.stringify(error));
    }
    console.log("Oxford PersonGroup response: " + JSON.stringify(body));
    callback(error, body);
  });
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
