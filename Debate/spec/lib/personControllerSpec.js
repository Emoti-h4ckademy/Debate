var fs = require ('fs');
var PersonCtrl = require('../../controllers/person');
var directoryPath = 'spec/lib/faces/';

describe("OxfordFace - recognize face:", function() {

  xit("More than one image must exist in faces folder", function() {
    var files = fs.readdirSync(directoryPath);
    expect(files.length).toBeGreaterThan(1);
  });

  xit("_getFacesIds must return an array of ids", function(done) {
    var fileName = fs.readdirSync(directoryPath)[1];
    var file = fs.readFileSync(directoryPath + fileName);
    var result;
      PersonCtrl._getFacesIds(directoryPath, function (error, faces) {
          console.log("Faces: " + faces);
          expect(faces.length).toBeGreaterThan(1);
          done();
      });
  });
});
