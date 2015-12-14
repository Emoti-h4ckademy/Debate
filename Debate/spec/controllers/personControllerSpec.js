var fs = require ('fs');
var Person = require('../../controllers/person');

describe("Person Controller", function () {
    var fakePath = 'Apath';
    var fakeGroupId = "2392905290752375";

    it("creates a list of person image objects from the image files of a directory", function (done) {
        spyOn(Person, "_readFilesFromDirectory").and.returnValue(["one","two"]);
        spyOn(Person, "_readImageFile").and.returnValue("faceData");
        spyOn(Person.oxfordFace, "detectFaces").and.callFake(function(data, callback){
            var expectedResponse = JSON.stringify([{'faceId':'1'}])
            callback(false, expectedResponse);
        });

        Person._getPersonImagesFromImageFiles(fakePath, function(error, personId){
            expect(Person._readFilesFromDirectory).toHaveBeenCalled();
            expect(Person._readImageFile).toHaveBeenCalled();
            expect(Person.oxfordFace.detectFaces).toHaveBeenCalled();
            done();
        });
    });

    it("creates a person from a name and directoryPath", function (done) {
        var fakeName = 'Bertín Osborne';
        var fakeInfoString = 'Persona ' + fakeName + ' creado el ' + new Date();

        spyOn(Person, "_getPersonImagesFromImageFiles").and.callFake(function(data, callback){
            var expectedResponse = [{'oxfordFaceID':'1'}, {'oxfordFaceID':'2'}];
            callback(false, expectedResponse);
        });

         spyOn(Person.oxfordFace, "createPerson").and.callFake(function(data1, data2, data3, callback){
             var expectedResponse = {'personId':'1'};
             callback(false, expectedResponse);
         });

        spyOn(Person, "_createDBPerson").and.callFake(function(data1, data2, data3, data4, callback){
            callback(false, {});
        });

        Person.createPerson (fakePath, fakeName, fakeInfoString, fakeGroupId, function(error, person){
            expect(Person._getPersonImagesFromImageFiles).toHaveBeenCalled();
            expect(Person.oxfordFace.createPerson).toHaveBeenCalled();
            expect(Person._createDBPerson).toHaveBeenCalled();
            expect(error).toBeFalsy();
            expect(person).toBeTruthy();
            done();
        });
    });

});