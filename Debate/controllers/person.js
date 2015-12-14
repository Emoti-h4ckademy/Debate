var fs = require('fs');
var path = require('path');

/**
 * Person constructor
 * @returns {Person}
 */
function Person() {
    this.personDB = require('../models/person').person;
    this.personImageDB = require('../models/person').personImage;
    this.oxfordFace = require('../lib/oxfordFace');
}

Person.prototype._createDBPersonImage = function (path, faceId, date, callback) {
  var self = this;

  var face = new self.personImageDB({
        fullPath:            path,
        oxfordFaceID:        faceId,
        oxfordDetectionDate: date
    });

    face.save(function (error, data) {
        if (error) {
          console.log("Person Image save (" + path + ") ERROR: " + error.message);
        } else {
          console.log("Person Image save (" + path + ") success:");
        }
        callback(error, data);
    });
};

Person.prototype._createDBPerson = function (name, directoryPath, faces, personId, callback) {
  var self = this;

  var person = new self.personDB({
        name:            name,
        directoryPath:   directoryPath,
        faces:        faces,
        oxfordPersonID: personId
    });

    person.save(function (error, data) {
        if (error) {
          console.log("Person save (" + name + ") ERROR: " + error.message);
        } else {
          console.log("Person save (" + name + ") success:");
        }
        callback(error, data);
    });
};

Person.prototype.train = function (personID, callback) {

    callback(/*error, updatedDocument*/true);
};

Person.prototype._readFilesFromDirectory = function (directoryPath) {
  return fs.readdirSync(directoryPath);
}

Person.prototype._readImageFile = function (fullPath) {
  return fs.readFileSync(fullPath);
}

Person.prototype._getPersonImagesFromImageFiles = function (directoryPath, callback) {
  var self = this;
  var files = self._readFilesFromDirectory(directoryPath);
  var personImages = [];
  var faceImg;
  var error = [];

  var numberOfFiles = callsReamining = files.length;
  for (var i = 0; i < numberOfFiles; i++) {
    var filename = files[i];
    setTimeout(function(f){
      var fullPath = directoryPath + path.sep + f;
      var faceImg = self._readImageFile(fullPath);
      self.oxfordFace.detectFaces(faceImg, function(err, faces){
        --callsReamining;
        if(err) {
          error.push(err);
          console.log("Person._getPersonImagesFromImageFiles: ERROR detecting face of " + fullPath + ", error: " + JSON.stringify(err));
        } else {
          var result = JSON.parse(faces)[0];
          personImages.push({oxfordFaceID : result.faceId, fullPath : fullPath, date : new Date()});
          console.log("Face Id detected: " + result.faceId + ", fullPath: " + fullPath );
        }
        if (callsReamining <= 0) {
          callback(error, personImages);
        }
      });
    }(filename), 1);
  };
};

Person.prototype.createPerson = function (directoryPath, name, userData, groupId, callback) {
  var self = this;

  // Step 1: get faces ids for files in directoryPath
  self._getPersonImagesFromImageFiles (directoryPath, function(error, personImages){
    if(error){
      console.log("Person.createPerson - self._getPersonImagesFromImageFiles ERROR: " + error);
      callback(error);
      return;
    }
    var personImageIDs = [];
    for(var elem in personImages){
      personImageIDs.push(personImages[elem].oxfordFaceID);
    }
    // Step 2: create a person in Oxford with the given faces ids
    self.oxfordFace.createPerson(groupId, personImageIDs, name, function(error, response){
      if(error) {
        console.log("Person.createPerson - self.oxfordFace.createPerson ERROR: " + error);
        callback(error);
      } else {
        // Step 3: save person in database
        self._createDBPerson(name, directoryPath, personImages, response.personId, function(error, person){
          if(error){
            console.log("Person.createPerson - Person._createDBPerson ERROR: " + error);
          }
          callback(error, person);
        });
      }
    });
  });
};

var person = module.exports = new Person();
