var exec = require('child_process').exec,
    child;

var laSextaStreamURL = "http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8";
var secondsBetweenCaptures = 3;
var destinationFolder = "./snapshots";
var ffmpegCommand = "ffmpeg -i "+laSextaStreamURL+" -vf fps=1/"+secondsBetweenCaptures+" "+destinationFolder+"/out%d.png";

child = exec(ffmpegCommand,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});