/**
 * Emotion constructor
 * @returns {Emotion}
 */
function Emotion() {
    this.emotionDB = require('../models/emotion');
}

module.exports = new Emotion();
