/**
 * Emotion constructor
 * @returns {Emotion}
 */
function Emotion() {
    this.emotionDB = require('../models/emotion');
}
    
Emotion.prototype.create = function (
        projectID,
        personID,
        frameID,
        emotion,
        time,
        callback) {
            
    callback (/*error*/true);
};

Emotion.prototype.getEmotions = function (projectID, callback) {

    callback(/*error, generatedDocumets*/true);
};


module.exports = new Emotion();
