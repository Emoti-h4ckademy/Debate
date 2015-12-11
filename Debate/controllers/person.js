/**
 * Person constructor
 * @returns {Person}
 */
function Person() {
    this.personDB = require('../models/person');
}

Person.prototype.create = function (projectID, name, directoryPath, callback) {
    
    callback(/*error, generatedDocumet*/true);
};

Person.prototype.train = function (personID, callback) {
    
    callback(/*error, updatedDocument*/true);
};


module.exports = new Person();
