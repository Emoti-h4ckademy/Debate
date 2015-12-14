/**
 * Emotion constructor
 * @returns {Emotion}
 */
function Emotion() {
    this.emotionDB = require('../models/emotion');
}

/**
 * Adds a new emotion to the DB
 * @param {type} projectID
 * @param {type} personID
 * @param {type} frameID
 * @param {type} emotion
 * @param {type} time
 * @param {type} callback (error, document)
 * @returns {undefined}
 */
Emotion.prototype.create = function (
        projectID,
        personID,
        frameID,
        emotion,
        time,
        callback) {
    var self = this;
    
    var newEmotion = new self.emotionDB({
        projectID : projectID,
        personID :  personID,
        frameID :   frameID,
        emotion :   emotion,
        time:       time
    });
    
    newEmotion.save(callback);
};

/**
 * Returns all the objects in the Emotion DB associated to a certain project
 * @param {type} projectID - 
 * @param {type} callback (error, documents)
 * @returns {undefined}
 */
Emotion.prototype.getEmotions = function (projectID, callback) {
    var self = this;
    
    self.emotionDB.find({ _id: projectID}, {}, {}, callback);
};


module.exports = new Emotion();
