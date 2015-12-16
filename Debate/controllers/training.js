/**
 * Training constructor
 * @returns {Training}
 */
function Training() {
    this.trainingDB  = require('../models/training');
    this.personDB = require('../models/person').person;
}

Training.prototype.getTrainings = function (callback) {
    this.trainingDB.find(function(error, trainings){
      if(error) console.log(error);
      callback(error, trainings);
    });
};

Training.prototype.getTrainingById = function (trainingId, callback) {
    this.trainingDB.findById(trainingId, function(error, training){
      if(error) console.log(error);
      callback(error, training);
    });
};

Training.prototype.create = function (name, callback) {
    var self = this;

    var training = new self.trainingDB({
        name:   name,
        trainedStatus: "no",
        date : new Date()
    });

    training.save(function (error, data) {
       if (error) {
           console.log("Training save ("+name+") ERROR:" + error);
       } else {
           console.log("Training save ("+name+") success");
       }
       callback (error, data);
    });
};

Training.prototype.addPerson = function (trainingID, personName, personDirectoryPath, callback) {
  var self = this;
  var person = new self.personDB ({
    name : personName,
    directoryPath: personDirectoryPath,
    faces : [],
    oxfordPersonID : ''
  });
  console.log("Training.addPerson person: " + JSON.stringify(person));
  self.trainingDB.update({ _id: trainingID }, { $push: { people: person }}, function(error, training){
    if(error) console.log(error);
    callback(error, training);
  });
};

Training.prototype._generatePersonGroupID = function (trainingID, callback) {

    callback(/*error, trainedStatus*/true);
};

Training.prototype.train = function (trainingID, callback) {

    callback(/*error, updatedDocument*/true);
};

Training.prototype.getTrainedStatus = function (trainingID, callback) {

    callback(/*error, trainedStatus*/true);
};

Training.prototype.analyze = function (trainingID, callback) {

    callback(/*error, trainedStatus*/true);
};

Training.prototype.getAnalysisStatus = function (trainingID, callback) {

    callback(/*error, trainedStatus*/true);
};

Training.prototype.getEmotions = function (trainingID, callback) {

    callback(/*error, trainedStatus*/true);
};


module.exports = new Training();
