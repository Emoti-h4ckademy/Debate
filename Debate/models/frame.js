var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var frameSchema = new Schema({
    projectID :         { type: String, required: true },
    path :              { type: String, required: true },
    //Oxford
    analyzedEmotions :  { type: String, default : false },
    analyzedFaces :     { type: String, default : false },
    analyzedPersons :   { type: Boolean }
});

module.exports = mongoose.model('Frame', frameSchema);
