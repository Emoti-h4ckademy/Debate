var express = require('express');
var ImageCtrl = require('../controllers/images');
var TwitterWorker = require('../lib/twitterWorker');
var router = express.Router();
var config = require('config');


/* GET home page. */
router.get('/', function(req, res) {
    myOptions = ImageCtrl.getNewOptions();
    myOptions.returnImage = true;
    myOptions.filterHasEmotions = false;
    ImageCtrl.getImages(myOptions, function(error, allImages){
        if (error) {
            console.log("FAILURE RETRIEVING IMAGES");
            console.log(error);
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

/* POST send image to Oxford to detect emotions. */
router.post('/emotiondetect', function(req, res) {
  var imageId = req.body.imageid;
  console.log("Emotion detection for image ", imageId);

    ImageCtrl.getImageById(imageId, function(error, image){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      }else {
        if (image.mainemotion) {
          res.json({
            scores: image.emotions.scores,
            emotion: image.mainemotion
          });
          return;
        }
        console.log("Image in DB, now detecting emotions...");
        ImageCtrl.oxfordLib.recognizeImageB64(image.image, function(error, emotions) {
          if (error) {
              console.log("Demo: No emotions detected. Error: "+ error);
              res.status(500).json(error);
          }else{
            var mainEmotionObj = ImageCtrl.oxfordLib.extractMainEmotion(emotions);
            var mainEmotion = mainEmotionObj.emotion;

            console.log("DEMO: Image recognition: " + mainEmotion + " (" + emotions + ")");

            image.emotions = emotions;
            image.mainemotion = mainEmotion;

            image.save(function (error, store) {
                if (error) {
                    console.log("Demo error DB: "+ error);
                    res.status(500).json(error);
                } else {
                    res.json({
                      scores: emotions.scores,
                      emotion: mainEmotion
                    });
                } 
            });
        }
      });
    }
  });
});

/* POST send tweet. */
router.post('/tweet', function(req, res) {
  var imageId = req.body.imageid;
  var text = req.body.text;

    ImageCtrl.getImageById(imageId, function(error, image){
      if(error){
        console.log(JSON.stringify(error));
        res.status(500).json(error);
      }else {
        TwitterWorker.tweetWithMedia(text, image.image, function(error, tweet, response){
          if(error){
            console.log(JSON.stringify(error));
            res.status(500).json(error);
          } else{
            res.json(tweet);
          }
        });
      }

    });
});


module.exports = router;
