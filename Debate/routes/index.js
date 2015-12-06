var express = require('express');
var router = express.Router();
var fs = require('fs');
var imageTransformation = require('../lib/imageTransformation');
var oxford = require('../lib/oxfordEmotions');

/* GET home page. */
router.get('/', function(req, res, next) {

    var buf = fs.readFileSync('/home/algunenano/Pictures/picture_emotions.jpg');
    
    //Read emotions from Oxford
    oxford.recognizeImageB64(buf, function (error, emotionResponse){
//        var emotionResponse = '[{"faceRectangle":{"height":115,"left":16,"top":81,"width":115},"scores":{"anger":0.005621977,"contempt":0.0315573,"disgust":0.00103119132,"fear":0.000295269449,"happiness":0.008638185,"neutral":0.881767869,"sadness":0.0698585957,"surprise":0.00122961379}}]';        
//        var emotionResponse = '[{"faceRectangle":{"height":68,"left":937,"top":201,"width":68},"scores":{"anger":0.000119316057,"contempt":0.00465921964,"disgust":0.000107181921,"fear":1.72401651E-05,"happiness":0.220338389,"neutral":0.77275753,"sadness":0.00030303825,"surprise":0.00169807661}},{"faceRectangle":{"height":60,"left":121,"top":122,"width":60},"scores":{"anger":0.009621782,"contempt":0.000640757266,"disgust":0.000343065563,"fear":0.01789026,"happiness":0.00261470978,"neutral":0.9336181,"sadness":0.032830026,"surprise":0.002441267}},{"faceRectangle":{"height":50,"left":304,"top":152,"width":50},"scores":{"anger":0.00186215271,"contempt":0.0008075808,"disgust":5.5633016E-05,"fear":0.000258956134,"happiness":0.0228468068,"neutral":0.9567135,"sadness":0.006311753,"surprise":0.0111436425}},{"faceRectangle":{"height":48,"left":512,"top":137,"width":48},"scores":{"anger":9.461755E-05,"contempt":0.00115551741,"disgust":3.61391831E-05,"fear":1.27863977E-05,"happiness":0.0003819165,"neutral":0.9849269,"sadness":0.0133687267,"surprise":2.34166273E-05}},{"faceRectangle":{"height":46,"left":774,"top":237,"width":46},"scores":{"anger":0.004230738,"contempt":0.103962176,"disgust":0.00709356368,"fear":0.000846643234,"happiness":0.004687066,"neutral":0.762300253,"sadness":0.116052091,"surprise":0.000827486}}]';
//        var error = false;
        if (error) {
            console.log("OXFORD ERROR: " + error);
        } else {
            console.log(emotionResponse);
            imageTransformation.drawEmotions(buf, emotionResponse, function (error, finalImageBuffer) {
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
        }

    });

  
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
