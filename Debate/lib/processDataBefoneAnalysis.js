var fs = require('fs');
var async = require('async');
var oxfordFace = require('../lib/oxfordFace');

//var group = "debate_a_9";
//var projectName = "Debate a 9";
var group = "caraacara";
var projectName = "Cara a Cara";
var candidatesPath = './snapshots/caraAcara-candidatos';

//createGroup(group); //<-- DONE (1)

function createGroup(group){
    console.log("creating person group ", group, " for Grupo de Debate a 9");
    oxfordFace.createPersonGroup(group, "Grupo de Debate a 9", function(error, data){
        if (error){
            console.log(error);
            return;
        }
        console.log("Response: ", data);
    });
}


//initializeIdentificationGroup(candidatesPath); //<-- DONE (2)

function initializeIdentificationGroup(candidatesPath){
    fs.readdir(candidatesPath, function(error, folders){
        if (error){
            console.log(error);
            return;
        }
        
        async.filter(folders, function(folder, callback){
            fs.stat(candidatesPath + "/" + folder, function(error, stat){
                callback(stat.isDirectory())
            });
            
        }, function(candidates){
            console.log("candidates ", candidates.length);
            async.map(candidates, processCandidate, function(error, results){
                if (error){
                    console.log(error);
                    return;
                }
                console.log(results);
                saveJSONtoFile("candidatesData.json", results)
            });
        });
    });
}

function isNotNull(value){
    return value != null;
}

function processCandidate(candidate, callback){
    fs.readdir(candidatesPath + "/" + candidate, function(error, files){
        if (error){
            callback(error);
            return;
        }
        async.map(files, function(file, callback){
            processCandidateFile(file, candidate, callback);
        }, function(error, facesData){
            if (error){
                callback(error);
                return;
            }
            facesData = facesData.filter(isNotNull);
            var result = {
                name: candidate,
                faceIds: facesData
            };
            callback(null, result);
        });
    });
}

function processCandidateFile(file, candidate, callback){
    fs.readFile(candidatesPath + "/" + candidate + "/" + file, function(error, fileData){
        if (error){
            console.log(error);
            callback(null, null);
            return;
        }
        console.log("candidate ", candidate , " has a file ", file);
        oxfordFace.detectFaces(fileData, function(error, data){
            if (error){
                callback(null, null);
                return;
            }
            if(JSON.parse(data).length == 0){
                console.log("No data for this face");
                callback(null, null);
                return;
            }
            var faceId = JSON.parse(data)[0]["faceId"];
            console.log("FaceId ", faceId, " for ", candidate);
            callback(null, faceId);
        });
    });
}

//createPersons(); //<-- OK (3)

function createPersons(){
    var candidates = require("../candidatesData.json");
    async.map(candidates, function(candidate, callback){
        console.log("Creating person for: " + candidate.name);
        oxfordFace.createPerson(
            group,
            candidate["faceIds"],
            candidate["name"], 
            function(error, data){
                if(error){
                    console.log(error);
                    callback(error, null);
                    return;
                }
                //console.log("Data: " + JSON.stringify(data));
                var personId = data["personId"];
                console.log(candidate["name"] + " new personId: " + personId);
                candidate["personId"] = personId;
                callback(null, personId);
            }
        );
    }, function(error, personIds){
        console.log("Saving data to candidates: " + JSON.stringify(candidates));
        saveJSONtoFile("candidatesWithPerson.json", candidates);
    });
}

//trainGroup(); //<-- OK (4)

function trainGroup(){
    oxfordFace.trainPersonGroup(group, function(error, data){
        console.log("Error: " + error);
        console.log("Response: " + JSON.stringify(data));
    });
}

//trainStatus(); //<-- OK (5)

function trainStatus(){
    oxfordFace.checkGroupStatus(group, function(error, data){
        console.log("Error: " + error);
        console.log("Response: " + JSON.stringify(data));
    });
}

var Candidate = require('../models/candidate').candidate;
var express = require('express');
var dbHandler  = require('../lib/dbHandler');
var app = express();

//Initialize database
dbHandler.initializeDatabase(app, function (error) {
    if (error) {
        console.log("Could not initialize database.", error );
        process.exit(1);
    }
});

saveTrainingDataToDB(); //<-- OK (6)

function saveTrainingDataToDB(){
    var candidates = require("../candidatesWithPerson.json");
    candidates.map(function(candidate){
        var theCandidate = new Candidate({
            project: projectName,
            name: candidate.name,
            faces: candidate.faceIds,
            personId: candidate.personId
        });
        theCandidate.save(function(error, data){
            if(error){
                console.log(error);
                return;
            }
            console.log(theCandidate.name + " saved correctly");
        });
    });
}

function saveJSONtoFile(fileName, jsonData){
    fs.writeFile(fileName, JSON.stringify(jsonData));
}