var fs = require('fs');
var path = require('path');

/**
 * Person constructor
 * @returns {Person}
 */
function Person() {
    this.personDB = require('../models/person').Person;
    this.faceDB = require('../models/person').PersonImage;
    this.oxfordFace = require('../lib/oxfordFace');
}

Person.prototype._getFacesIds = function (directoryPath, callback) {

      var files = fs.readdirSync(directoryPath);
      var faceIds = [];
      var faceImg;
      var error;
      if (files) {
        for (var i = 0; i < files.length; i++){
          faceImg = fs.readFileSync(directoryPath + path.sep + files[i]);
          person.oxfordFace.detectFaces(faceImg)
          .then(function(face){
            console.log("_getFacesIds Face Id: " + faceId);
            faceIds.push(face[0].faceId);
          }).catch(function (err) {
            error = err;
            console.log("Error detecting face of " + files[i] + ", error: " + JSON.stringify(err));
          });
        }
      };
  callback(error, faceIds);


};

Person.prototype.create = function (name, directoryPath, callback) {
  person._getFacesIds(directoryPath, function(error, facesIds){
      //TODO
  });

    callback(/*error, generatedDocumet*/true);
};

Person.prototype.train = function (personID, callback) {

    callback(/*error, updatedDocument*/true);
};


var person = module.exports = new Person();
