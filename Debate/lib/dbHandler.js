/**
 * Created by Carlos on 10/11/15.
 */
var config = require('../config');
var mongoose = require('mongoose');
var dbConnection;


var dbHandler = module.exports = {

    initializeDatabase: function(app, callback){
        console.log("NODE_ENV = " + app.get('env'));
        var dbUrl = process.env.DB_URL || config.db[app.get('env')];
        app.set('DB_URL', dbUrl);

        // Connection to DB
        dbConnection = mongoose.connect(dbUrl, {}, function(err, db) {
            if(err) {
                callback (err);
            }
            console.log('Connected to Database');
            app.set('db', db);
        });

        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected', function () {
            console.log('Mongoose default connection open to ' + dbUrl);
        });

        // If the connection throws an error
        mongoose.connection.on('error',function (err) {
            console.log('Mongoose default connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

        mongoose.connection.on('close', function(){
            console.log("MongoDB connection lost");
            process.exit(1);
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        //Register models
        require('../models/image')(app, mongoose);
        console.log("dbHandler.js: 'Image' model registered");
        callback (false);
    },
    closeConnection: function () {
        dbConnection.disconnect(function (error){
            if(error) console.log(error);
        });
    }
}
