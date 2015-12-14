var chokidar = require('chokidar');
var fs = require('fs');
var imageController = require('../controllers/images');
//var ImageWithEmotions = require('../models/image');
 
var watcher = chokidar.watch('./snapshots/', {
  ignored: /[\/\\]\./, persistent: true
});


console.log("Watching files from the snapshots folder.");
var initialScan = false;
watcher
    .on('ready', function() { console.log('Initial scan complete. Ready for changes.'); initialScan = true; })
    .on('add', function(path) {
        if (initialScan) {
            console.log('File', path, 'has been added');

            fs.readFile(path, function (error, data) {
                if (error) {
                    console.log("Demo error");
                } else {
                    var myimage = data.toString('base64');
                    var newImage = new imageController.imageDB({
                        persona:    "CaraACaraL6",
                        date:        new Date(),
                        image:       myimage
                    });

                    newImage.save(function (error, store) {
                        if (error) {
                            console.log("Demo error DB: "+ error);
                        } else {
                            console.log("DEMO: New image added", path);
                        } 
                    });    
                }
            });
        }
    });