describe('Twitter functionality', function () {
  var twitter = require('../../lib/twitterWorker');
  var download = require('../../lib/files').download;

  beforeEach(function(done){
      var src = 'http://lorempixel.com/300/300/';
      var imageSample = './spec/lib/sample.png';

      download( src, imageSample , function () {
          done();
      });
  });

  it('should return a white4x4.png base64 image when prepareimage', function(done){
        var file = './spec/lib/white4x4.png';
        var fixture = 'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwEEAQDhG1JwgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAUSURBVAjXY/z//z8DDDAxIAHcHACWbgMF2hiSxQAAAABJRU5ErkJggg==';

        twitter.prepareAnImageAsBase64(file, function(err, data){
            expect(data).toEqual( fixture );
            done();
        });

  });


  it('should upload an image to twitter and have a media_id', function(done){

      var imageSample = './spec/lib/sample.png';

      twitter.uploadImage( imageSample, function(err, data){
          expect(data.media_id).toBeDefined();
          done();
      });
  });


  it('should be able to tweet a message with picture', function(done){

      var date = new Date();
      var imageSample = './spec/lib/sample.png';

      twitter.postTweet( " picture at " + date, imageSample, function( err, tweet ) {
         // console.log(tweet);
          expect(tweet.entities.media).toBeDefined();
          done();
      });


  });

});
