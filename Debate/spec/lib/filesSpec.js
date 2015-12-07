describe('Files', function () {
  var files = require('../../lib/files');
  
    xit('should return an image from remote source', function(done){

        var src = 'http://lorempixel.com/300/300/';
        var dst = '/tmp/foo';

        files.download( src, dst , function(err, data){
            expect(err).toBeFalsy();
            done();
        });

  });


});
