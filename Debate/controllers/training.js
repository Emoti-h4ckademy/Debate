/**
 * Training constructor
 * @returns {Training}
 */
function Training() {
    this.trainingDB  = require('../models/training');
}

Training.prototype.getTrainings = function (callback) {
    this.trainingDB.find().
            exec(callback);
};

Training.prototype.getTrainingById = function (callback) {
    this.trainingDB.findById().
            exec(callback);
};

Training.prototype.create = function (name, callback) {
    var self = this;

    var training = new self.trainingDB({
        name:   name,
        trainedStatus: "no",
        date = new Date()
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
