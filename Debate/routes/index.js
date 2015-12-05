var express = require('express');
var router = express.Router();
//var ImageCtrl = require('../controllers/images');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
    /*var myOptions = ImageCtrl.getNewOptions();
    myOptions.returnImage = true;
    myOptions.filterHasEmotions = false;
    ImageCtrl.getImages(myOptions, function(error, allImages){
        if (error) {
            console.log("FAILURE RETRIEVING IMAGES");
        } else {
            res.render('images', { myimages : allImages } );
        }
    });*/

});

module.exports = router;
