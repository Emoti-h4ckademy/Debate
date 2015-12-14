var express = require('express');
var ImageCtrl = require('../controllers/images');
var TwitterWorker = require('../lib/twitterWorker');
var ImageTransformation = require('../lib/imageTransformation');
var router = express.Router();
var config = require('config');


/* GET home page. */
router.get('/', function(req, res) {
    myOptions = ImageCtrl.getNewOptions();
    myOptions.returnImage = true;
    myOptions.filterHasEmotions = false;
    myOptions.sortDate = 'desc';
    myOptions.queryLimit = 30;
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
                 if(value){
                   return '#' + value.replace(' ', '');
                 }else{
                   return '';
                 }
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
          var scores = JSON.parse(image.emotions)[0].scores;
          res.json({
            scores: scores,
            emotion: image.mainemotion,
            tranformedImage: image.tranformedImage
          });
          return;
        }
        console.log("Image in DB, now detecting emotions...");
        ImageCtrl.oxfordLib.recognizeImageB64(image.image, function(error, emotions) {
        var error = false;
        //EXAMPLE FOR NEW DRAW EMOTIONS
//        var emotions = '[{"faceRectangle":{"height":74,"left":117,"top":61,"width":74},"scores":{"anger":0.00563287176,"contempt":0.0330147259,"disgust":0.009175014,"fear":0.000168148355,"happiness":0.400165141,"neutral":0.540461838,"sadness":0.00180949341,"surprise":0.009572777}},{"faceRectangle":{"height":74,"left":385,"top":63,"width":74},"scores":{"anger":0.0146066947,"contempt":0.102840692,"disgust":0.00597200776,"fear":8.23523E-06,"happiness":0.5685659,"neutral":0.303208828,"sadness":0.00471350038,"surprise":8.410675E-05}}]';
//        var facesResponse = '[{\"faceId\":\"8fee428a-1b87-40ce-a3c5-3c7184de1954\",\"faceRectangle\":{\"top\":62,\"left\":384,\"width\":77,\"height\":77},\"attributes\":{}},{\"faceId\":\"9117f85d-292e-4afc-a3ce-07895af07357\",\"faceRectangle\":{\"top\":60,\"left\":116,\"width\":76,\"height\":76},\"attributes\":{}}]';
//        var identificationResponse = '[{"faceId":"8fee428a-1b87-40ce-a3c5-3c7184de1954","candidates":[{"personId":"7504701d-e830-4d6f-ae4e-b188e1c2ee1e","confidence":0.61106}]},{"faceId":"9117f85d-292e-4afc-a3ce-07895af07357","candidates":[{"personId":"6f7fbfc4-264d-41d1-a3dc-a4e5eb473a25","confidence":0.75943}]}]';
          //Current
          var facesResponse = "";
          var identificationResponse = "";
          if (error) {
              console.log("Demo: No emotions detected. Error: "+ error);
              res.status(500).json(error);
          }else{
            var mainEmotionObj = ImageCtrl.oxfordLib.extractMainEmotion(emotions);
            var mainEmotion = mainEmotionObj.emotion;

            console.log("DEMO: Image recognition: " + mainEmotion + " (" + emotions + ")");

            image.emotions = emotions;
            image.mainemotion = mainEmotion;

            ImageTransformation.drawEmotions(new Buffer(image.image, 'base64'), emotions, facesResponse, identificationResponse,  function(error, tranformedImage){
              if (error){
                    console.log("ImageTransformation: "+ error);
                    res.status(500).json(error);
              } else {
                image.tranformedImage = tranformedImage.toString('base64');
                image.save(function (error, store) {
                  if (error) {
                      console.log("Demo error DB: "+ error);
                      res.status(500).json(error);
                  } else {
                      res.json({
                        scores: JSON.parse(image.emotions)[0].scores,
                        emotion: mainEmotion,
                        tranformedImage: image.tranformedImage
                      });
                  }
                });
              }
              image.save();
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
        var imageToTweet = image.tranformedImage || image.image;
        TwitterWorker.postTweet(text, imageToTweet, function(error, tweet, response){
          if(error){
            console.log(error);
            res.status(500).json(error);
          } else{
            res.json(tweet);
          }
        });
      }

    });
});


module.exports = router;
