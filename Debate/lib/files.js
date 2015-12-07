
var http = require('http'),
    fs = require('fs');

exports.download = function( source, dest, callback ) {

    var request = http.get( source , function(response) {
        if (response.statusCode === 200) {
            var file = fs.createWriteStream( dest );
            response.pipe(file);
            if (callback) callback( null, file );
        }
        // Add timeout.
        request.setTimeout(12000, function () {
            request.abort();
        });
    });

};


