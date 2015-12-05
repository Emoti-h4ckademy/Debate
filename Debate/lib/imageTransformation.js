var gm = require('gm');
var oxford = require('../lib/oxfordEmotions');

/**
 * Call example:
var fs = require('fs');
var imageTransformation = require('../lib/imageTransformation');

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
 */


function ImageTransformation () {

}

/**
 * Given an image draws the emotion information over it
 * @param {type} image - Buffer with the image to be analyzed
 * @param {type} callback (error, newImageBuffer, emotionResonse)
 * @returns {undefined}
 */
ImageTransformation.prototype.drawEmotion = function (image, callback) {
    var self = this;
    oxford.recognizeImageB64(image, function (error, emotionResponse){
        
        if (error) {
            callback (error);
            return;
        }
        
        var faces = JSON.parse(emotionResponse);

        var myIterator = -1;
        var myForFunction = function (error, newBuffer) {
            if (error) {
                callback (error);
            }

            myIterator++;
            if (myIterator === faces.length) {
                callback (false, newBuffer, emotionResponse);
                return;
            }
            self._drawBox(newBuffer, faces[myIterator]["faceRectangle"], myForFunction);
        };

        myForFunction(false, image);
    });
};

/**
 * Given an image and an object with the emotion data of a face, draws the data 
 * @param {type} image - Base image to draw into (Not modified)
 * @param {type} faceRectangle - Data of the face
 * @param {type} callback (error, newImage)
 * @returns {undefined}
 */
ImageTransformation.prototype._drawBox = function (image, faceRectangle, callback) {
    if (!image || !faceRectangle) {
        callback("DrawBox: Invalid parameters");
    }

    var points = {
        toplx : faceRectangle["left"],                              toply : faceRectangle["top"],
        toprx : faceRectangle["left"] + faceRectangle["width"],     topry : faceRectangle["top"],
        bottomlx : faceRectangle["left"],                           bottomly : faceRectangle["top"] + faceRectangle["height"],
        bottomrx : faceRectangle["left"] + faceRectangle["width"],  bottomry : faceRectangle["top"] + faceRectangle["height"]
    };
    
    gm(image, 'memory.jpg')
        .drawLine(points.toplx, points.toply, points.toprx, points.topry)
        .drawLine(points.toplx, points.toply, points.bottomlx, points.bottomly)
        .drawLine(points.toprx, points.topry, points.bottomrx, points.bottomry)
        .drawLine(points.bottomlx, points.bottomly, points.bottomrx, points.bottomry)
        .toBuffer('JPG', function (error, buffer) {
            console.log("DRAWBOX: " + error);
            callback (error, buffer);
        });
};

var imageTransformation = module.exports = exports = new ImageTransformation();