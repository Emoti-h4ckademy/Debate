/**
 * Project constructor
 * @returns {Project}
 */
function Project() {
    this.projectDB  = require('../models/project');
}

Project.prototype.create = function (name, callback) {
    
    callback(/*error, generatedDocumet*/true);
};

Project.prototype._generatePersonGroupID = function (projectID, callback) {
    
    callback(/*error, trainedStatus*/true);
};

Project.prototype.train = function (projectID, callback) {
    
    callback(/*error, updatedDocument*/true);
};

Project.prototype.getTrainedStatus = function (projectID, callback) {
    
    callback(/*error, trainedStatus*/true);
};

Project.prototype.analyze = function (projectID, callback) {
    
    callback(/*error, trainedStatus*/true);
};

Project.prototype.getAnalysisStatus = function (projectID, callback) {
    
    callback(/*error, trainedStatus*/true);
};

Project.prototype.getEmotions = function (projectID, callback) {
    
    callback(/*error, trainedStatus*/true);
};


module.exports = new Project();