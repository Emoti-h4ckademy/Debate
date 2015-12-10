var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emotionSchema = new Schema({
    projectID :         { type: String, required: true }, //Database id of the related project in the DB
    personID :          { type: String, required: true }, //Database id of the related person in the DB
    frameID :              { type: String, required: true }, //Database id of the related frame in the DB
    emotion :           { type: String, required: true },
    time :              { type : Number }
});

module.exports = mongoose.model('Emotion', emotionSchema);