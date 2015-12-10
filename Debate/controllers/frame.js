/**
 * Frame constructor
 * @returns {Frame}
 */
function Frame() {
    this.frameDB = require('../models/frame');
}

Frame.prototype.createOne = function (projectID, frameFullPath, callback) {
    
    callback(/*error, generatedDocumet*/true);
};

Frame.prototype.createDirectory = function (projectID, directoryPath, callback) {
    
    callback(/*error, generatedDocumets*/true);
};

Frame.prototype.createVideo = function (projectID, fullPath, callback) {
    
    callback(/*error, generatedDocumets*/true);
};

Frame.prototype.analyzeEverything = function (frameID, callback) {
    
    callback(/*error, updatedDocument*/true);
};

Frame.prototype.analyzeEmotions = function (frameID, callback) {
    
    callback(/*error, updatedDocument*/true);
};

Frame.prototype.analyzeFaces = function (frameID, callback) {
    
    callback(/*error, updatedDocument*/true);
};

Frame.prototype.analyzePersons = function (frameID, callback) {
    
    callback(/*error, updatedDocument*/true);
};


module.exports = new Frame();
