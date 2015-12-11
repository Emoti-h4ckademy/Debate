var config = require('config'),
    request = require('request');

/**
 * OxfordFace constructor.
 */

function OxfordFace () {
    this.apiKey         = config.get('OXFORD_EMOTION_API_KEY');
    this.faceBaseUrl    = config.get('OXFORD_EMOTION_URL');
    this.personBaseUrl  = config.get('OXFORD_PERSON_URL');
    
}

module.exports = new OxfordFace();
