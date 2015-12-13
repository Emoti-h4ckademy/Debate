var fs = require ('fs');
var Face = require('../../lib/oxfordFace');
var directoryPath = 'spec/lib/faces/';

describe("OxfordFace - recognize face:", function() {

  it("An image must exist in faces folder", function() {
    var fileName = fs.readdirSync(directoryPath)[0];
    expect(fileName).toEqual(jasmine.anything());
  });

  it("Oxford Face Detection AJAX call works properly", function(done) {
    var fileName = fs.readdirSync(directoryPath)[0];
    var file = fs.readFileSync(directoryPath + fileName);
    var result;
      Face._getFaces(file, function (error, faces) {
        if(error) console.log(error);
          result = faces;
          expect(result).toEqual(jasmine.anything());
          done();
      });
  });

  it("Recognize image from a file", function() {
    var fileName = fs.readdirSync(directoryPath)[0];
    var file = fs.readFileSync(directoryPath + fileName);
    var result;
      Face.detectFaces(file).then(function (error, faces) {
          console.log("Faces from promises: " + JSON.stringify(faces));
          expect(faces).toEqual(jasmine.any(Object));
      });
      //expect(result).toEqual(jasmine.any(Object));
  });
});

describe("Oxford get faces ids for multiple files in folder:", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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
