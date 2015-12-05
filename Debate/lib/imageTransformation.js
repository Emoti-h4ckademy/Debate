var gm = require('gm');
var oxford = require('../lib/oxfordEmotions');
var mkdirp = require('mkdirp');

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

/**
 * ImageTransformation constructor
 * @returns {nm$_imageTransformation.ImageTransformation}
 */
function ImageTransformation () {
    
}

/**
 * Given an image draws the emotion information over it
 * @param {type} image - Buffer with the image to be analyzed
 * @param {type} callback (error, newImageBuffer, emotionResonse)
 * @returns {undefined}
 */
ImageTransformation.prototype.drawEmotions = function (image, callback) {
    var self = this;
//    oxford.recognizeImageB64(image, function (error, emotionResponse){
    var error = false;
    var emotionResponse = '[{"faceRectangle":{"height":115,"left":16,"top":81,"width":115},"scores":{"anger":0.005621977,"contempt":0.0315573,"disgust":0.00103119132,"fear":0.000295269449,"happiness":0.008638185,"neutral":0.881767869,"sadness":0.0698585957,"surprise":0.00122961379}}]';        
        if (error) {
            callback (error);
            return;
        }
        
        var faces = JSON.parse(emotionResponse);

        var myIterator = -1;
        var myForFunction = function (error, newBuffer) {
            myIterator++;
            if (error) {
                callback (error);
            }

            if (myIterator === faces.length) {
                self._drawBug(newBuffer, function(error, finalImage){
                    callback (error, finalImage, emotionResponse);
                });
                return;
            }
            
            self._drawFace(newBuffer, faces[myIterator], myForFunction);
            
//            console.log(faces.length);
//            console.log(faces);
//            console.log(myIterator);
//            console.log(faces[myIterator]);
//            console.log(faces[myIterator]["faceRectangle"]);
            
        };

        myForFunction(false, image);
//    });
};


function prettyFloat(x,nbDec) { 
    if (!nbDec) nbDec = 100;
    var a = Math.abs(x);
    var e = Math.floor(a);
    var d = Math.round((a-e)*nbDec); if (d === nbDec) { d=0; e++; }
    var signStr = (x<0) ? "-" : " ";
    var decStr = d.toString(); var tmp = 10; while(tmp<nbDec && d*tmp < nbDec) {decStr = "0"+decStr; tmp*=10;}
    var eStr = e.toString();
    return signStr+eStr+"."+decStr;
}

/**
 * Given an image and an object with the emotion data of a face, draws the data 
 * @param {type} image - Base image to draw into (Not modified)
 * @param {type} face - Data of the face
 * @param {type} callback (error, newImage)
 * @returns {undefined}
 */
ImageTransformation.prototype._drawFace = function (image, face, callback) {
    if (!image || !face["faceRectangle"] || !face["scores"]) {
        callback("DrawBox: Invalid parameters");
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
        anger :     "Enfado: "      + (prettyFloat(parseFloat(scores["anger"])*100,2))+"%",
        contempt :  "Desprecio: "   + (prettyFloat(parseFloat(scores["contempt"])*100,2))+"%",
        disgust :   "Asco: "        + (prettyFloat(parseFloat(scores["disgust"])*100,2))+"%",
        fear :      "Miedo: "       + (prettyFloat(parseFloat(scores["fear"])*100,2))+"%",
        happiness : "Feliz: "       + (prettyFloat(parseFloat(scores["happiness"])*100,2))+"%",
        neutral :   "Neutral: "     + (prettyFloat(parseFloat(scores["neutral"])*100,2))+"%",
        sadness :   "Triste: "      + (prettyFloat(parseFloat(scores["sadness"])*100,2))+"%",
        surprise :  "Sorpresa: "    + (prettyFloat(parseFloat(scores["surprise"])*100,2))+"%"
    };
    
    var rectangle = {
        sizeX :     1000,
        sizeY :     5000,
        sepX :      5,
        sepY :      0,
        cornerw :   4,
        cornerh :   4
    };
    rectangle ['x0'] = points.toprx + rectangle.sepX;
    rectangle ['y0'] = points.topry + rectangle.sepY;
    rectangle ['x1'] = rectangle.x0 + rectangle.sizeX;
    rectangle ['y1'] = rectangle.y0 + rectangle.sizeY;
    
    //H4 Logo color: #262721
    
    var tempImage = gm(image, 'memory.jpg')
        .fill("#262721")
        .drawLine(points.toplx, points.toply, points.toprx, points.topry)
        .drawLine(points.toplx, points.toply, points.bottomlx, points.bottomly)
        .drawLine(points.toprx, points.topry, points.bottomrx, points.bottomry)
        .drawLine(points.bottomlx, points.bottomly, points.bottomrx, points.bottomry)
        .size(function (error, size) {
            if (error) {
                console.log("DRAWBOX SZ ERROR: " + error);
                callback(error);
            }
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

                console.log("Old image : " + size.width + " " + size.height);
                console.log("New image : " + newSizeX + " " + newSizeY);
                
                console.log("Old rectangle " + "("+ rectangle.x0 + "," + rectangle.y0+"), ("+rectangle.x1+","+rectangle.y1+")");
                rectangle.x0 *= newSizeX /size.width;
                rectangle.x1 = rectangle.x0 + rectangle.sizeX;
                rectangle.y0 *= newSizeY / size.height;
                rectangle.y1 = rectangle.y0 + rectangle.sizeY;
                console.log("New rectangle " + "("+ rectangle.x0 + "," + rectangle.y0+"), ("+rectangle.x1+","+rectangle.y1+")");
            }
            
            tempImage.resize(newSizeX, newSizeY)
                .fill("#262721")
                .drawRectangle(rectangle.x0, rectangle.y0, rectangle.x1, rectangle.y1, rectangle.cornerw, rectangle.cornerh)
                .toBuffer('JPG', function (error, buffer) {
                    console.log("DRAWBOX: " + error);
                    console.log("FINAL rectangle " + "("+ rectangle.x0 + "," + rectangle.y0+"), ("+rectangle.x1+","+rectangle.y1+")");
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
    var auxDir = "./tmp/";
    var auxPath = auxDir + new Date().getTime() + ".png";
    
    mkdirp(auxDir, function (error) {
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