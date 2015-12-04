describe('Twitter functionality', function () {
  var twitter = require('../../lib/twitterWorker');

  it('It posts a tweet', function (done) {
    var date = new Date();
      twitter.postTweet("Te doy la hora: " + date, null, function(error, tweet, response){
        expect(error).toBeFalsy();
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

  it('should upload an image to twitter', function(done){

      var file = './spec/lib/white4x4.png';

      twitter.uploadImage( file, function(err, data){
          expect(data.media_id).toBeDefined();
          done();
      });
  });

});
