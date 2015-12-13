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

Person.prototype._getFacesIds = function (directoryPath, callback) {
      var files = fs.readdirSync(directoryPath);
      var faceIds = [];
      var faceImg;
      var error = [];

      var numberOfFiles = callsReamining = files.length;

      for (var i = 0; i < numberOfFiles; i++) {
        var filename = files[i];
        var fullPath = directoryPath + path.sep + filename;
        faceImg = fs.readFileSync(fullPath);
        person.oxfordFace.detectFaces(faceImg, function(err, faces){
          --callsReamining;
          if(err) {
            error.push(err);
            console.log("_getFacesIds Error detecting face of " + fullPath + ", error: " + JSON.stringify(err));
          } else {
            var result = JSON.parse(faces)[0];
            faceIds.push({faceId : result.faceId, path : fullPath, date : new Date()});
            console.log("Face Id detected: " + result.faceId);
          }

          if (callsReamining <= 0) {
            callback(error, faceIds);
          }
        });
      }
};

Person.prototype.createPersonImage = function (path, faceId, date, callback) {
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

Person.prototype.createPerson = function (name, faces, personId, callback) {
  var self = this;

  var person = new self.personDB({
        name:            name,
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


var person = module.exports = new Person();
