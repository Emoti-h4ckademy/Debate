var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var frameSchema = new Schema({
    projectID :         { type: String, required: true }, //Database id of the related project in the DB
    fullPath :              { type: String, required: true },
    //Oxford
    oxfordAnalyzedEmotions :  { type: String, default : false },
    oxfordAnalyzedFaces :     { type: String, default : false },
    oxfordAnalyzedPersons :   { type: Boolean }
});

module.exports = mongoose.model('Frame', frameSchema);
