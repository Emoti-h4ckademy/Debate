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
    
    xit("Integration test - create Person Group", function(done) {
        OxfordFace.createPersonGroup("data343w343443434", function(error, response){
            console.log("Error: " + error);
            console.log("Response: " + response);
            expect(error).toBeFalsy();
            done();
        });
    });
        
});