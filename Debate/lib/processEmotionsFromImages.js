var fs = require('fs');
var async = require('async');
//var path = './snap/';
var path = './snapshots/caraAcara/';
var timeBetweenRequests = 5000;

var group = "caraacara";
var projectName = "Cara a Cara";

var oxfordEmotions = require('../lib/oxfordEmotions');
var oxfordFace = require('../lib/oxfordFace');

var Emotion = require('../models/candidate').emotion;
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

analyze();

function analyze(){
    fs.readdir(path, function(error, files){
        if (error){
            console.log(error);
            return;
        }
        console.log("files ", files.length);
        var batchSize = 10;
        var total = files.length;
        var batches = Math.floor(total / batchSize);
        var currentBatch = 0;
        console.log("batches ", batches, " of ", batchSize," elements");

        var intervalObject = setInterval(function(){
            var batch = currentBatch*batchSize;
            analyzeBatch(files, batch, batchSize);
            currentBatch++;
            if(currentBatch >= batches){
                clearInterval(intervalObject);
            }
        }, timeBetweenRequests);
    });
}


function analyzeBatch(files, batch, batchSize){
    for(var j=0; j<batchSize; j++){
        if(batch + j >= files.length){
            return;
        }
        var fileName = files[batch + j];
        console.log("file ", fileName);
        analyzeFile(fileName);
    }
}

function analyzeFile(fileName){
    fs.readFile(path + fileName, function(error, data){

        if (error){
            console.log(error);
            return;
        }

        oxfordEmotions._getEmotion(data, function(error, emotions){
            //console.log("Emotions detected from ", fileName, " is " + emotions);

            if(emotions === oxfordEmotions.emptyResponse){
                console.log("No people, skip frame");
                return;
            }

            oxfordFace.detectFaces(data, function (error, faces) {
                if (error){
                    console.log(error);
                    return;
                }
                
                var myFacesIDs = [];
                var facesAux = JSON.parse(faces);
                if(facesAux.length === 0){
                    console.log("No people, skip frame");
                    return;
                }
                for (var face in facesAux) {
                    myFacesIDs.push(facesAux[face].faceId);
                }
                console.log('', facesAux.length, ' faces detected');

                oxfordFace.identifyPersona(myFacesIDs, group, function (error, persons){
                    if (error){
                        console.log(error);
                        return;
                    }
                    console.log("Persons detected from ", fileName, " is ", persons);

                    if(persons.length == 0){
                        console.log("No candidate detected in ", fileName);
                        return;
                    }
                    persons.map(function(person){
                        var time = parseInt( fileName.slice(3, -5) );
                        matchPerson(person, emotions, time);
                    });
                });
            });
        });
    });
}

function matchPerson(person, emotions, time){
    if(person.candidates.length == 0){
        console.log("No candidate detected in ", time);
        return;
    }
    var personId = person.candidates[0].personId;
    var confidence = person.candidates[0].confidence;
    console.log("Persons from ", time, " is ", personId, " with confidence ", confidence);

    if(confidence < 0.3){
        console.log("Candidate detection not accurate enough: skipping...");
        return;
    }

    Candidate.findOne({personId: personId}, {}, function(error, candidate){
        if (error){
            console.log(error);
            return;
        }
        var mainEmotion = oxfordEmotions.extractMainEmotion(emotions).emotion;
        var emotionObj = JSON.parse(emotions)[0].scores;
        console.log("Emotion detected from ", candidate.name, " is ", mainEmotion);

        var emotion = new Emotion({
            timestamp: time,
            mainEmotion : mainEmotion,
            anger :     parseFloat(emotionObj.anger),
            contempt :  parseFloat(emotionObj.contempt),
            disgust :   parseFloat(emotionObj.disgust),
            fear :      parseFloat(emotionObj.fear),
            happiness : parseFloat(emotionObj.happiness),
            neutral :   parseFloat(emotionObj.neutral),
            sadness :   parseFloat(emotionObj.sadness),
            surprise :  parseFloat(emotionObj.surprise)
        });
        candidate.emotions.push(emotion);
        candidate.save(function(error, response){
            if (error){
                console.log(error);
                return;
            }
            console.log("Correctly saved ", candidate.name, " with emotion ", mainEmotion);
        });
    });
}
