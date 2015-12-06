var express = require('express');
var ImageCtrl = require('../controllers/images');
var TwitterWorker = require('../lib/twitterWorker');
var router = express.Router();
var config = require('config');
//var ImageCtrl = require('../controllers/images');

/* GET home page. */
router.get('/', function(req, res) {
    myOptions = ImageCtrl.getNewOptions();
    myOptions.returnImage = true;
    myOptions.filterHasEmotions = false;
    ImageCtrl.getImages(myOptions, function(error, allImages){
        if (error) {
            console.log("FAILURE RETRIEVING IMAGES");
        } else {
            res.render('index', { myimages : allImages, hashtags : config.get('DEFAULT_HASHTAGS').join(' '),
            helpers: {
              debug: function(value){
                  console.log("Current Context");
                  console.log("======================");
                  console.log(this);

                  if(value) {
                    console.log("Value");
                    console.log("======================");
                    console.log(value);
                  }
               },
               tagify: function(value){
                 value = value.replace(' ', '');
                 return '#' + value;
               }
          }});
        }
    });

});

/* POST send tweet. */
router.post('/tweet', function(req, res) {
  var imageId = req.body.imgid;
  var text = req.body.text;
    myOptions = ImageCtrl.getNewOptions();
    myOptions.returnImage = true;
    myOptions.filterHasEmotions = false;

    TwitterWorker.postTweet(text, undefined, function(error, tweet, response){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      } else{
        res.send(tweet);
      }
    });
});


module.exports = router;
