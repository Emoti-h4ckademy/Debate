var fs = require ('fs');
var PersonCtrl = require('../../controllers/person');
var PersonImage = require('../../models/person').personImage;
var directoryPath = 'spec/lib/faces';
var express = require('express');
var dbHandler  = require('../../lib/dbHandler');
var app = express();

//Initialize database
dbHandler.initializeDatabase(app, function (error) {
  if (error) {
    console.log ("Could not initialize database. Check if MongoDB service is up");
    process.exit(1);
  }
});

describe("Person image methods", function () {
  it("Person must be saved in database", function(done){
    var faces = [new PersonImage ({
      fullPath:            "mock_path",
      oxfordFaceID:        "mock_id",
      oxfordDetectionDate: new Date()
    })];
    PersonCtrl.createPerson("mock_name" , faces, "mock_personId", function(error, person){
      expect(person).toEqual(jasmine.any(Object));
      done();
    })
  });

  it("Person Image must be saved in database", function(done){
    PersonCtrl.createPersonImage("mock_path", "mock_id", new Date(), function(error, personImage){
      expect(personImage).toEqual(jasmine.any(Object));
      done();
    })
  });
});
