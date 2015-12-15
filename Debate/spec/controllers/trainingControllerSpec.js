var fs = require ('fs');
var PersonCtrl = require('../../controllers/person');
var TrainingCtrl = require('../../controllers/training');
var Person = require('../../models/person').person;
var express = require('express');
var dbHandler  = require('../../lib/dbHandler');
var app = express();

//Initialize database
dbHandler.initializeDatabase(app, function (error) {
  if (error) {
    console.log("Could not initialize database.", error );
    process.exit(1);
  }
});

describe("Training database methods:", function () {
  it("A training must exist in database", function(done){
    TrainingCtrl.getTrainings(function(error, trainings){
      expect(trainings.length).toBeGreaterThan(0);
      done();
    })
  });

  it("Add person to a training", function(done){
    //var trainingID = '566ed31d71c9593d31fc29ac';

    TrainingCtrl.getTrainings(function(error, trainings){
      var trainingID = trainings[0]._id;
      var personName = 'Bertin Test'
      var personDirectoryPath = '/Users/Carlos/Desktop/personas/bertin';
      TrainingCtrl.addPerson(trainingID, personName, personDirectoryPath, function(error, person){
        expect(person).toEqual(jasmine.any(Object));
        done();
      })
    });
  });

});
