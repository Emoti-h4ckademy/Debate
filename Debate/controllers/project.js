/**
 * Project constructor
 * @returns {Project}
 */
function Project() {
    this.projectDB = require('../models/project');
}

module.exports = new Project();