var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emotionSchema = new Schema({
    projectID :         { type: String, required: true },
    personID :          { type: String, required: true },
    path :              { type: String, required: true },
    emotion :           { type: String, required: true },
    time :              { type : Number }
});

module.exports = mongoose.model('Emotion', emotionSchema);