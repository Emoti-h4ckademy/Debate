var exec = require('child_process').exec,
    child;
var mkdirp = require('mkdirp');

var laSextaStreamURL = "http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8";
var video = "video/debateA9.mp4"
var videCaraACara = "video/caraAcara.mp4";
var videBalonOro = "video/BallondOr2015.mp4"
var secondsBetweenCaptures = 1;
var destinationFolder = "./snapshots/balonOro";
var ffmpegCommand = "ffmpeg -i "+videBalonOro+" -preset ultrafast -vf fps=1/"+secondsBetweenCaptures+" "+destinationFolder+"/out%04d.jpeg";


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
