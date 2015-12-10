var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personImageSchema = new Schema({
    fullPath :              { type: String, required: true },
        //Oxford
    oxfordFaceID :      { type: String},
    oxfordDetectionDate :     { type: Date }
});

var personSchema = new Schema({
    projectID :         { type: String, required: true }, //Database id of the related project in the DB
    name :              { type: String, required: true },
    faces :             { type: [personImageSchema], required: true},
    //Oxford
    oxfordPersonID :         { type: String, required: true } //Generated by Oxford
});

module.exports = {
    Person: mongoose.model('Person', personSchema),
    PersonImage : mongoose.model('PersonImage', personImageSchema)
};