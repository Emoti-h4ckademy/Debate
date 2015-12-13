var fs = require ('fs');
var Face = require('../../lib/oxfordFace');
var express = require('express');
var dbHandler  = require('../../lib/dbHandler');
var app = express();

//Initialize database
dbHandler.initializeDatabase(app, function (error) {
    if (error) {
        console.log ("Could not initialize database.",error);
        process.exit(1);
    }
});

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

describe("Create a person in Oxford", function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    var groupId = "2392905290752375";

    it("A group must be created in Oxford", function (done) {
        var name = "Grupo de prueba";
        var groupData = "Grupo de prueba para testing";
        Face._oxfordCallCreatePersonGroup(groupId, name, groupData, function(error, result){
            expect(error).not.toEqual(jasmine.anything());
            done();
        });

    });

    it("AJAX call to Oxford create person must work", function (done) {
        var faceIds = ["f6eb7ed7-29b0-4d88-8720-b39ee9d0c488","4de03350-d087-4092-befa-772213e75251"];
        var name = "Test person";
        var userData = "Person used for testing";
        Face._oxfordCallCreatePerson (faceIds, name, userData, groupId, function(error, response){
            expect(error).not.toEqual(jasmine.anything());
            done();
        });
    });

    it("Must create a person with a given name and directoryPath as parameters", function (done) {
        var directoryPath = 'spec/lib/person';
        var name = 'Bertín Osborne';
        var useInfoString = 'Persona ' + name + ' creado el ' + new Date();

        Face.createPerson (directoryPath, name, useInfoString, groupId, function(error, personId){
            expect(personId).toEqual(jasmine.anything());
            done();
        });
    });

});
