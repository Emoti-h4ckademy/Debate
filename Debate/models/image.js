var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    date:        { type: Date, required: true },
    image:       { type: String, required: true },
    tranformedImage: { type: String},
    persona:    { type: String },
    emotions:    { type: String },
    mainemotion: { type: String}
});

module.exports = mongoose.model('Image', imageSchema);
