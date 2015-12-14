var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Person = require('../models/person').person;

var trainingSchema = new Schema({
    name :                { type: String, required: true },
    people:               { type: [Person] },
    //Oxford
    trainedStatus :       { type: String, default: 'no' }, /* no, running, succeeded, failed */
    oxfordPersonGroupID : { type: String, default: 'undefined' }, //Generated by us to Oxford
    creationDate :        { type: Date }
});

module.exports = mongoose.model('Training', trainingSchema);
