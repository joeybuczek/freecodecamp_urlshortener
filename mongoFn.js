// Mongo Requirements - mongoUser is your production mongo url connection string
var mongo = require('mongodb').MongoClient;
var mongoUrl = require('./mongoUser');
var generators = require('./generators');

// MongoDB Functions ========================================================
// for this project, mongo should => query if original url is already saved, otherwise create shortened
//                                => query for shortened url, then return and redirect user to original
// mongo functions object
var mongoFunctions = {}; 

// add functions to mongo functions object
// mongoCount - returns the total number of entries in the collection - returns an integer
mongoFunctions.mongoCount = function (callback) {
    // connect to mongo database
    mongo.connect(mongoUrl, function (err, db) {
        // if error, throw
        if (err) {
            db.close();
            throw err;
        }
        // get count of items in collection
        var urls = db.collection('urls');
        urls.find({}).toArray(function (err, docs) {
            if (err) {
                // error - close and throw
                db.close();
                throw err;
                
            } else {
                // close and return length of docs array
                db.close()
                callback(docs.length);
                
            } // end if/else
        }); // end find
    }); // end mongo.connect
}; // end mongoCount

// mongoNewUrl - when submitting a new url request - accepts a url string, returns an object
mongoFunctions.mongoNewUrl = function (requestString, callback) {
    // connect to mongo database
    mongo.connect(mongoUrl, function (err, db) {
        // can't connect? return error object
        if (err) callback({ 'error':'unable to connect to database'});
        // db vars for initial query
        var urls = db.collection('urls');
        var query = {'originalUrl':requestString};
        var projection = {'_id':0, 'originalUrl':1, 'shortenedUrl':1};
        
        // get count then proceed
        var dbTotalCount = 0;
        urls.find({}).toArray(function (err, docs) {
            if (err) {
                db.close();
                callback({ 'error':'unable to determine number of records'});
                
            } else {
                dbTotalCount = docs.length;
                var insertObj = {'originalUrl' : requestString, 'shortenedUrl': generators.randomUrl(dbTotalCount)};
                // search to see if url passed already has an entry
                urls.find(query, projection).toArray(function (err, docs) {
                    // already found? return the object
                    if (docs.length > 0) {
                        db.close();
                        callback(docs[0]);
                        
                    } else {
                        // not found - create it
                        urls.insert(insertObj);
                        db.close();
                        var formattedReturnObj = {
                            'originalUrl': insertObj.originalUrl,
                            'shortenedUrl': insertObj.shortenedUrl
                        };
                        callback(formattedReturnObj);
                        
                    } // end if/else
                }); // end insert find
            } // end if/else       
        }); // end dbTotalRecords find
    }); // end mongo.connect
}; // end mongoNewUrl

// mongoGetUrl - searches for the shortened url in the database, and if found, returns the original url
//             - accepts a string and callback function, returns a string
mongoFunctions.mongoGetUrl = function (searchUrl, callback) {
    // connect to the database
    mongo.connect(mongoUrl, function (err, db) {
        // error, return error string
        if (err) callback('Unable to connect to database');
        // search
        var urls = db.collection('urls');
        var query = {'shortenedUrl':searchUrl};
        var projection = {'_id':0, 'originalUrl':1};
        urls.find(query, projection).toArray(function (err, docs) {
            // error, return error string
            if (err) callback('Unable to perform search');
            // return found 
            if (docs.length > 0) {
                db.close()
                callback(docs[0].originalUrl);
                
            } else {
                // not found
                db.close();
                callback('Not Found');
                
            } // end if/else
        }); // end find
    }); // end mongo.connect
}; // end mongoGetUrl

module.exports = mongoFunctions;
