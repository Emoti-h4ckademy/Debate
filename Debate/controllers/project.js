/**
 * Project constructor
 * @returns {Project}
 */
function Project() {
    this.projectDB  = require('../models/project');
}

Project.prototype.create = function (name, callback) {
    var self = this;
    
    var project = new self.projectDB({
        name:   name,
        trainedStatus: "no"
    });
    
    project.save(function (error, data) {
       if (error) {
           console.log("Project save ("+name+") ERROR:" + error);
       } else {
           console.log("Project save ("+name+") success");
       }
       callback (error, data);
    });
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