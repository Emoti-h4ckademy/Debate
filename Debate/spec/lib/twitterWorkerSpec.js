describe('Twitter functionality', function () {
  var twitter = require('../../lib/twitterWorker');

  it('It posts a tweet', function (done) {
    var date = new Date();
      twitter.postTweet("Te doy la hora: " + date, null, function(error, tweet, response){
        expect(error).toBeFalsy();
        done();
      });
  });

});
