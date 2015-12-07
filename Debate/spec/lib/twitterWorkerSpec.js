/* global expect */ 
console.log = function() {}; //Disable logs

describe('twitterWorker - _tweetStatus', function () {
    var TwitterLib = require('twitter');
    var twitter = require('../../lib/twitterWorker');
    var oldTPost;
    
    beforeAll(function() {
        oldTPost = TwitterLib.prototype.post.bind(TwitterLib);
        TwitterLib.prototype.post = function (url, params, callback){
            callback (false, "Data", "Response");
        };
    });
    
    afterAll(function() {
        TwitterLib.prototype.post = oldTPost.bind(TwitterLib);
    });
    
    
    it('Should post a correct status to Twitter', function(done){
        twitter._tweetStatus("My message", {}, function (error, tweet){
           expect(error).toBeFalsy();
           done();
        });
    });
    
    it('Should fail with an empty message', function(done){
        twitter._tweetStatus(null, {}, function (error, tweet){
           expect(error).toBeTruthy();
           done();
        });
    });
    
    it('Should be OK with an empty string', function(done){
        twitter._tweetStatus("", {}, function (error, tweet){
           expect(error).toBeFalsy();
           done();
        });
    });
    
    it('Should fail with a int as message', function(done){
        twitter._tweetStatus(8, {}, function (error, tweet){
           expect(error).toBeTruthy();
           done();
        });
    });
    
    it('Should accept empty options', function(done){
        twitter._tweetStatus("My message", null, function (error, tweet){
           expect(error).toBeFalsy();
           done();
        });
    });
    
    it('Should accept options for twitter and respect them', function(done){
        oldTPost = TwitterLib.prototype.post.bind(TwitterLib);
        var included = false;
        TwitterLib.prototype.post = function (url, params, callback){
            if (params['possibly_sensitive'] === true) included = true;
            callback (false, "Data", "Response");
        };
        
        twitter._tweetStatus("My message", {possibly_sensitive : true}, function (error, tweet){
            expect(error).toBeFalsy();
            expect(included).toBeTruthy();
            TwitterLib.prototype.post = oldTPost.bind(TwitterLib);
            done();
        });
    });
    
    it('Should fail with a int as options', function(done){
        twitter._tweetStatus("My message", 5, function (error, tweet){
           expect(error).toBeTruthy();
           done();
        });
    });
});

describe('twitterWorker - _tweetMedia', function () {
    var TwitterLib = require('twitter');
    var twitter = require('../../lib/twitterWorker');
    var oldTPost;
//    var base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwEEAQDhG1JwgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAUSURBVAjXY/z//z8DDDAxIAHcHACWbgMF2hiSxQAAAABJRU5ErkJggg==';
    var base64Image = "aaaa";
            
    beforeAll(function() {
        oldTPost = TwitterLib.prototype.post.bind(TwitterLib);
        TwitterLib.prototype.post = function (url, params, callback){
            callback (false, "Data", "Response");
        };
    });
    
    afterAll(function() {
        TwitterLib.prototype.post = oldTPost.bind(TwitterLib);
    });
    
    it('Should be OK with correct values', function(done){
        twitter._tweetMedia(base64Image, function(error, twitterMediaID){
            expect(error).toBeFalsy();
            done();
        });
    });
    
    it('Should fail with empty media', function(done){
        twitter._tweetMedia(null, function(error, twitterMediaID){
            expect(error).toBeTruthy();
            done();
        });
    });
    
    it('Should fail with invalid media', function(done){
        twitter._tweetMedia(88888, function(error, twitterMediaID){
            expect(error).toBeTruthy();
            done();
        });
    });
    
    it('Should return media value from Twitter', function(done){
        oldTPost = TwitterLib.prototype.post.bind(TwitterLib);
        var myID = "potato";
        TwitterLib.prototype.post = function (url, params, callback){
            callback (false, {media_id_string : myID}, "Response");
        };
        
        twitter._tweetMedia(base64Image, function(error, twitterMediaID){
            expect(error).toBeFalsy();
            expect(twitterMediaID).toBe(myID);
            TwitterLib.prototype.post = oldTPost.bind(TwitterLib);
            done();
        });
    });
    
});