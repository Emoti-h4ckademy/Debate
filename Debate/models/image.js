/**
 * Created by Carlos on 6/11/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    date:        { type: Date, required: true },
    image:       { type: String, required: true },
    persona:    { type: String },
    emotions:    { type: String },
    mainemotion: { type: String}
});

module.exports = mongoose.model('Image', imageSchema);
