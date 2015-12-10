/**
 * Frame constructor
 * @returns {Frame}
 */
function Frame() {
    this.frameDB = require('../models/frame');
}

module.exports = new Frame();
