var fs = require ('fs');

describe("Oxford - Integration tests:", function() {
    var OxfordFace = require('../../lib/oxfordFace');;
    var fs = require('fs');
    
    xit("Face detection", function(done) {
        fs.readFile("/home/algunenano/Pictures/Bertin/joven.jpg", function (error, data) {
            console.log(error);
            OxfordFace.detectFaces(data, function(error, data){
                console.log("Error: " + error);
                console.log("Output: " + JSON.stringify(data));
                expect(error).toBeFalsy();
                done();
            });
        });
    });
    
    xit("create Person Group", function(done) {
        OxfordFace.createPersonGroup("bertinh4", "Grupo de Bertín", function(error, data){
            console.log("Error: " + error);
            console.log("Response: " + JSON.stringify(data));
            expect(error).toBeFalsy();
            done();
        });
    });
    
    xit("create Person", function(done) {
        OxfordFace.createPerson(
                "bertinh4",
                ["c3dba1eb-6d78-4979-a89d-113236186aee", "755439ac-3e9d-46ad-b02b-96427f7e6e28", "de89bd88-4d39-49ec-9cca-dd441b2a64c7" ],
                "Bertin", 
                function(error, data){
                    console.log("Error: " + error);
                    console.log("Response: " + JSON.stringify(data));
                    expect(error).toBeFalsy();
                    done();
        });
    });
    
    xit("Train persongroup", function(done) {
        OxfordFace.trainPersonGroup("bertinh4", function(error, data){
                    console.log("Error: " + error);
                    console.log("Response: " + JSON.stringify(data));
                    expect(error).toBeFalsy();
                    done();
        });
    });
    
    xit("get train status", function(done) {
        OxfordFace.checkGroupStatus("bertinh4", function(error, data){
                    console.log("Error: " + error);
                    console.log("Response: " + JSON.stringify(data));
                    expect(error).toBeFalsy();
                    done();
        });
    });
    
    xit("Identify persona", function(done) {
        OxfordFace.identifyPersona(["ae57f3a1-d8eb-4a33-b974-7024f2663798"], "bertinh4",  function(error, data){
                    console.log("Error: " + error);
                    console.log("Response: " + JSON.stringify(data));
                    expect(error).toBeFalsy();
                    done();
        });
    });
        
});
