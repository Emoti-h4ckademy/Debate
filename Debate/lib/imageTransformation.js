var gm = require('gm');
var oxford = require('../lib/oxfordEmotions');
var mkdirp = require('mkdirp');

/**
 * ImageTransformation constructor
 * @returns {nm$_imageTransformation.ImageTransformation}
 */
function ImageTransformation () {
    /**
     * Font size in the image
     */
    this.fontSize = 18;
    /**
     * Temporal directory used during the composition of the final image
     */
    this.auxDir = "./tmp/";
}

/**
 * Given an image draws the emotion information over it
 * @param {type} image - Buffer with the image to be analyzed
 * @param {type} emotionResponse - Emotion Response from Oxford
 * @param {type} callback (error, newImageBuffer)
 * @returns {undefined}
 */
ImageTransformation.prototype.drawEmotions = function (image, emotionResponse, callback) {
    var self = this;
    if (!image || !emotionResponse || !callback || emotionResponse === oxford.emptyResponse) {
        callback ("Invalid parameters");
        return;
    }
    
    var faces = JSON.parse(emotionResponse);
    var myIterator = faces.length;
    var myForFunction = function (error, newBuffer) {
        myIterator--;
        if (error) {
            callback (error);
        }

        if (myIterator === -1) {
            self._drawBug(newBuffer, function(error, finalImage){
                callback (error, finalImage);
            });
            return;
        }

        self._drawFace(newBuffer, faces[myIterator], myForFunction);
    };

    myForFunction(false, image);
};

/**
 * Given an image and an object with the emotion data of a face, draws the data 
 * @param {type} image - Base image to draw into (Not modified)
 * @param {type} face - Data of the face
 * @param {type} callback (error, newImage)
 * @returns {undefined}
 */
ImageTransformation.prototype._drawFace = function (image, face, callback) {
    var self = this;
    if (!image || !face["faceRectangle"] || !face["scores"]) {
        callback("DrawBox: Invalid parameters");
        return;
    }
    
    var faceRectangle = face["faceRectangle"];
    var scores = face["scores"];

    var points = {
        toplx : faceRectangle["left"],                              toply : faceRectangle["top"],
        toprx : faceRectangle["left"] + faceRectangle["width"],     topry : faceRectangle["top"],
        bottomlx : faceRectangle["left"],                           bottomly : faceRectangle["top"] + faceRectangle["height"],
        bottomrx : faceRectangle["left"] + faceRectangle["width"],  bottomry : faceRectangle["top"] + faceRectangle["height"]
    };
    
    var emotions = {
        anger :     "Enfado: "      + ((parseFloat(scores["anger"])*100).toFixed(2))+"%",
        contempt :  "Desprecio: "   + ((parseFloat(scores["contempt"])*100).toFixed(2))+"%",
        disgust :   "Asco: "        + ((parseFloat(scores["disgust"])*100).toFixed(2))+"%",
        fear :      "Miedo: "       + ((parseFloat(scores["fear"])*100).toFixed(2))+"%",
        happiness : "Felicidad: "   + ((parseFloat(scores["happiness"])*100).toFixed(2))+"%",
        neutral :   "Neutral: "     + ((parseFloat(scores["neutral"])*100).toFixed(2))+"%",
        sadness :   "Tristeza: "    + ((parseFloat(scores["sadness"])*100).toFixed(2))+"%",
        surprise :  "Sorpresa: "    + ((parseFloat(scores["surprise"])*100).toFixed(2))+"%"
    };
    
    var emotionString = "";
    for (var key in emotions) emotionString += emotions[key]+"\n";
    
    var rectangle = {
        sizeX :     self.fontSize * 9,
        sizeY :     self.fontSize * 12,
        sepX :      0,
        sepY :      5,
        cornerw :   4,
        cornerh :   4
    };
    rectangle ['x0'] = points.bottomlx + rectangle.sepX;
    rectangle ['y0'] = points.bottomly + rectangle.sepY;
    rectangle ['x1'] = rectangle.x0 + rectangle.sizeX;
    rectangle ['y1'] = rectangle.y0 + rectangle.sizeY;
    
    var tempImage = gm(image, 'memory.jpg')
        .fill("#ABDF3C") //Green
        .stroke("#ABDF3C")
        .strokeWidth(4)
        .drawLine(points.toplx, points.toply, points.toprx, points.topry)
        .drawLine(points.toplx, points.toply, points.bottomlx, points.bottomly)
        .drawLine(points.toprx, points.topry, points.bottomrx, points.bottomry)
        .drawLine(points.bottomlx, points.bottomly, points.bottomrx, points.bottomry)
        .size(function (error, size) {
            if (error) {
                console.log("DRAWBOX SZ ERROR: " + error);
                callback(error);
                return;
            }
            //Check if resize is needed and set the values to the new size
            var proportion = size.width / size.height;
            var newSizeX = size.width;
            var newSizeY = size.height;
            if (size.width < rectangle.x1 || size.height < rectangle.y1) {
                newSizeX = size.width * rectangle.sizeX / (size.width - rectangle.x0);
                newSizeY = size.height * rectangle.sizeY / (size.height - rectangle.y0);
                
                var newProportion = newSizeX / newSizeY;
                if (newProportion > proportion) {
                    newSizeY = newSizeX / proportion;
                }
                if (newProportion < proportion) {
                    newSizeX = newSizeY * proportion;
                }
                rectangle.x0 *= newSizeX /size.width;
                rectangle.x1 = rectangle.x0 + rectangle.sizeX;
                rectangle.y0 *= newSizeY / size.height;
                rectangle.y1 = rectangle.y0 + rectangle.sizeY;
            }
            
            var myFontSize = ''+self.fontSize+'px';
            tempImage.resize(newSizeX, newSizeY)
                .fill("#262721")
                .drawRectangle(rectangle.x0, rectangle.y0, rectangle.x1, rectangle.y1, rectangle.cornerw, rectangle.cornerh)
                .fill("#D4FCC8")
                .stroke("#D4FCC8")
                .strokeWidth(1)
                .fontSize( myFontSize )
                .drawText(rectangle.x0 + rectangle.cornerw, rectangle.y0 + self.fontSize + rectangle.cornerh, emotionString)
                .toBuffer('JPG', function (error, buffer) {
                    callback (error, buffer);
                });

        });



};

/**
 * Draws H4ckademy bug over a photo
 * @param {type} image
 * @param {type} callback (error, newImage)
 * @returns {undefined}
 */
ImageTransformation.prototype._drawBug = function (image, callback) {
    var self = this;
    var auxPath = self.auxDir + new Date().getTime() + ".jpg";
    
    mkdirp(self.auxDir, function (error) {
        if (error) {
            console.log("DRAWBUG MKDIR ERROR: " + error);
            callback (error);
            return;
        }
        gm(image, 'memory.jpg')
            .write(auxPath, function (error){
                if (error) {
                    console.log("DRAWBUG WRITE: " + error);
                    callback (error);
                    return;
                }
                gm()
                    .in(auxPath)
                    .in('./res/_bug.jpg')
                    .mosaic()
                    .toBuffer('JPG', function (error, buffer) {
                        callback (error, buffer);
                    });
            });
    });
};

module.exports = new ImageTransformation();