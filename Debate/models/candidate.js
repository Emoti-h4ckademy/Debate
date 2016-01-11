var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emotionSchema = new Schema({
    //Emotions
    anger:       {type: Number},
    contempt:    {type: Number},
    disgust:     {type: Number},
    fear:        {type: Number},
    happiness:   {type: Number},
    neutral:     {type: Number},
    sadness:     {type: Number},
    surprise:    {type: Number},
    //Other data
    timestamp:   {type: Number},
    mainEmotion: {type: String}
});

var candidateSchema = new Schema({
    project:     { type: String },
    name:        { type: String },
    faces:       { type: [String] },
    personId:    { type: String },
    emotions:    { type: [emotionSchema] }
});

module.exports = {
    candidate: mongoose.model('Candidate', candidateSchema),
    emotion : mongoose.model('Emotion', emotionSchema)
};
