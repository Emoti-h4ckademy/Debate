var exec = require('child_process').exec,
    child;
var mkdirp = require('mkdirp');

var laSextaStreamURL = "http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8";
var secondsBetweenCaptures = 3;
var destinationFolder = "./snapshots";
var ffmpegCommand = "ffmpeg -i "+laSextaStreamURL+" -preset ultrafast -vf fps=1/"+secondsBetweenCaptures+" "+destinationFolder+"/out%d.png";


mkdirp(destinationFolder, function (error) {
    if (error) {
        console.log("COULD NOT CREATE FOLDER " + destinationFolder +": " + error);
    } else {
        child = exec(ffmpegCommand,
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        });
    }
});
