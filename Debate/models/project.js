var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    name :              { type: String, required: true },
    //Oxford
    trainedStatus :     { type: String, required: true }, /* no, running, succeeded, failed */
    oxfordPersonGroupID :     { type: String }, //Generated by us to Oxford
    creationDate :      { type: Date }
});

module.exports = mongoose.model('Project', projectSchema);