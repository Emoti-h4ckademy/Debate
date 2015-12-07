var chokidar = require('chokidar');
var fs = require('fs');
var imageController = require('../controllers/images');

function ImageProccesor(){
}

ImageProccesor.prototype.watch = function( path, onAddCallback ){

    var watcher = chokidar.watch( path , {
      ignored: /[\/\\]\./, persistent: true
    });

    watcher
      .on('ready', function() { 
            console.log('Initial scan complete. Ready for changes.') 
      })
      .on('add', function(path) {
            console.log('File', path, 'has been added');
            onAddCallback(path);
    });
}

ImageProccesor.prototype.startWatcherAndProcess = function ( path, callback ){

    this.watch( path, this.processFile );
}

ImageProccesor.prototype.processFile = function (file ){
    
    fs.readFile( file , function (error, data) {
        if (error) {
            console.log("Error reading file ");
            return error ;

        } else {
            
            var myImage = data.toString('base64');
            var newImage = new imageController.imageDB({
                persona:    "h4ckademy power",
                date:        new Date(),
                image:       myImage
            });

            newImage.save(function (error, store) {
                if (error) {
                    console.log("Error saving at DB: "+ error);
                } else {
                    console.log("DEMO: New image added", file);
                } 
            });    
        }
    });
}


module.exports = new ImageProccesor();
