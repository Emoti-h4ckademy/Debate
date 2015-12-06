var chokidar = require('chokidar');
var fs = require('fs');
var imageController = require('../controllers/images');
var ImageWithEmotions = require('../models/image');
 
var watcher = chokidar.watch('./snapshots/', {
  ignored: /[\/\\]\./, persistent: true
});
 
console.log("Watching files from the snapshots folder.");
watcher
    // .on('addDir', function(path) { console.log('Directory', path, 'has been added'); })
    // .on('change', function(path) { console.log('File', path, 'has been changed'); })
    // .on('unlink', function(path) { console.log('File', path, 'has been removed'); })
    // .on('unlinkDir', function(path) { console.log('Directory', path, 'has been removed'); })
    // .on('error', function(error) { console.log('Error happened', error); })
    // .on('ready', function() { console.log('Initial scan complete. Ready for changes.'); initialScan = true; })
    // .on('raw', function(event, path, details) { console.log('Raw event info:', event, path, details); })
    .on('add', function(path) {
        console.log('File', path, 'has been added');

        fs.readFile(path, function (error, data) {
            if (error) {
                console.log("Demo error");
            } else {
                //console.log("Let's recognize "+path+" ");
                myimage = data.toString('base64');
                imageController.oxfordLib.recognizeImageB64(data, function(error, emotions) {
                    if (error) {
                        console.log("Demo: No emotions detected. Error: "+ error);
                        return;
                    } else {

                        //Extract main emotion
                        var mainEmotionObj = imageController.oxfordLib.extractMainEmotion(emotions);

                        var mainEmotion = mainEmotionObj.emotion;

                        console.log("DEMO: Image recognition: " + mainEmotion + " (" + emotions + ")");
                       
                        var newImage = new ImageWithEmotions({
                            persona:    "Demo",
                            date:        new Date(),
                            image:       myimage,
                            emotions:    JSON.stringify(emotions),
                            mainemotion: mainEmotion
                        });

                        console.log("DEMO: Now save "+path);

                        newImage.save(function (error, store) {
                            if (error) {
                                console.log("Demo error DB");
                            } else {
                                console.log("DEMO: New image added");
                            } 
                        });
                    }
                });
            }
        });
    });