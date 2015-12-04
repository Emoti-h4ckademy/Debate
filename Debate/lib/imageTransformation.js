var gm = require('gm');
var oxford = require('../lib/oxfordEmotions');


function ImageTransformation () {

}

/**
 * 
 * @param {type} image
 * @param {type} callback (error, finalImageBuffer)
 * @returns {undefined}
 */
ImageTransformation.prototype.drawEmotion = function (image, callback) {
    var self = this;
//    oxford.recognizeImageB64(image, function (error, emotionResponse){
    var error = false;
    var emotionResponse = '[{"faceRectangle":{"height":115,"left":16,"top":81,"width":115},"scores":{"anger":0.005621977,"contempt":0.0315573,"disgust":0.00103119132,"fear":0.000295269449,"happiness":0.008638185,"neutral":0.881767869,"sadness":0.0698585957,"surprise":0.00122961379}}]';

        if (error) {
            callback (error);
            return;
        }
        
    var faces = JSON.parse(emotionResponse);
    var finalImage = new Buffer(image);
        for (var iterator in faces) {
            var faceRectangle = faces[iterator]["faceRectangle"];
            if (!faceRectangle) {
                callback ("Unable to parse face " + iterator);
                return;
            }
            self._drawBox(finalImage, faceRectangle, function (error, newBuffer) {
                if (error) {
                    callback (error);
                    return;
                } else {
                    finalImage = newBuffer;
                }
            });
        }
        callback(false, finalImage);
        return;
//    });
};

ImageTransformation.prototype._drawBox = function (image, faceRectangle, callback) {
    console.log(faceRectangle);
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



var ImageTransformation = module.exports = exports = new ImageTransformation();