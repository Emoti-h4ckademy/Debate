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

describe("Oxford - recognizeImageB64:", function() {
    var OxfordFace = require('../../lib/oxfordFace');;
    var fs = require('fs');
    
    xit("Integration test - Face detection - Good image", function(done) {
        fs.readFile("/home/algunenano/Pictures/1920x1080_archlinux_leopard-1240352.jpg", function (error, data) {
            console.log(error);
            OxfordFace.detectFaces(data, function(error, output){
                console.log("Error: " + error);
                console.log("Output: " + output);
                expect(error).toBeFalsy();
                done();
            });
        });
    });
        
});

