/**
 * Person constructor
 * @returns {Person}
 */
function Person() {
    this.personDB = require('../models/person');
}

module.exports = new Person();
