var fs = require ('fs');
var Face = require('../../lib/oxfordFace');

describe("Oxford get faces ids for multiple files in folder:", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  var directoryPath = 'spec/lib/faces';

  it("More than one image must exist in faces folder", function() {
    var files = fs.readdirSync(directoryPath);
    expect(files.length).toBeGreaterThan(1);
  });

 it("_getFacesIds must return non empty array", function(done) {
    var result;
      Face._getFacesIds(directoryPath, function (error, faces) {
          expect(faces.length).toBeGreaterThan(1);
          done();
      });
  });

  it("_getFacesIds elements of result array must be an Object { faceId : String, path: String, date : Date}", function(done) {

      Face._getFacesIds(directoryPath, function (error, faces) {
        var correctParameters = true;
          faces.forEach(function(face) {
            correctParameters = correctParameters && face.faceId;
            correctParameters = correctParameters && face.path;
            correctParameters = correctParameters && face.date;
          });
          expect(correctParameters).toBeTruthy();
          done();
      });
  });
});
