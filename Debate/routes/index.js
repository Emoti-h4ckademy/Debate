var express = require('express');
var router = express.Router();
var fs = require('fs');
var imageTransformation = require('../lib/imageTransformation');

/* GET home page. */
router.get('/', function(req, res, next) {

    var buf = fs.readFileSync('/home/algunenano/Pictures/picture_emotions.jpg');
    imageTransformation.drawEmotion(buf, function (error, finalImageBuffer) {
        if (error) {
            console.log("DRAW: " + error);
        } else {
            fs.writeFile("/home/algunenano/Pictures/picture5.jpg", new Buffer (finalImageBuffer), function(error) {
                if(error) {
                    console.log("WRITE: " + error);
                } else {
                    console.log("WRITE: Saved");
                }
            });
        }
    });
  
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
