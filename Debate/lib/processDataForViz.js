var fs = require('fs');
var Candidate = require('../models/candidate').candidate;
var emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];
var candidates = ["ciudadanos", "pp", "psoe", "upyd", "iu", "pnv", "unio", "unio2", "podemos"];

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

candidates.map(loadDataforCandidates);
//loadDataforCandidates(candidates[0]);

function loadDataforCandidates(candidate){
  var emotionResults = emotions.map(function(emotion){
    return {name: emotion, data: []};
  })

  saveInfoFrom(candidate, emotionResults);
}

function saveInfoFrom(candidateName, emotionResults){
  console.log("Saving info from", candidateName);
  Candidate.findOne({name: candidateName}, function(error, candidate){
    //console.log("candidate ", candidate);
    candidate.emotions = candidate.emotions.sort(function(a, b) {
      return a.timestamp - b.timestamp;
    });
        
    var times = candidate.emotions.map(function(emotion){
      emotionResults.forEach(function(result){
        result.data.push(emotion[result.name]);
      });
      return emotion.timestamp;
    });
    saveJSONtoFile(candidateName+"-time.json", times);
    saveJSONtoFile(candidateName+"-data.json", emotionResults);
  });
}

//TODO: calcular emociones media con un reduce sobre todas las medidas de cada emoción
function calculateAverageEmotions(candidateName){
  Candidate.findOne({name: candidateName}, {name:1, emotions.}, function(error, candidate){
    emotions.map
  });
}

function saveJSONtoFile(fileName, jsonData){
    fs.writeFile(fileName, JSON.stringify(jsonData));
}