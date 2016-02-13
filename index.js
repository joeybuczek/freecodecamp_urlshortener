// connectivity vars
var http = require('http');
var mongoFn = require('./mongoFn');
// server vars
var express = require('express');
var app = express();



// routes ===================================================================
// html snippets
var htmlHome = "<h2>URL Shortener Microservice</h2>" + 
               "<h3>Usage examples:</h3>" + 
               "<pre>/new/http://www.google.com</pre>" + 
               "<pre>/new/http://bteamphoto.com</pre>" + 
               "<h3>Response examples:</h3>" + 
               "<pre>{'originalUrl':'http://www.google.com','shortenedUrl':'/s/i3W'}</pre>" + 
               "<pre>{'originalUrl':'http://bteamphoto.com','shortenedUrl':'/s/a6k'}</pre>" +
               "<h3>Invalid URL example:</h3>" +
               "<pre>{'url':'invalid'}</pre>";
var html404 =  "<center><p style='color: darkred; margin-top:30px;'>" + 
               "404 - Unable to locate what you were looking for." + 
               "</p></center>";

// home
app.get('/', function (req, res) {
    res.send(htmlHome);
});

// new url shorten request - must pass regexp pattern for valid urls
app.get(/^\/new\/http?s?\:\/\/[a-z0-9]+[.]+[a-z0-9]+/i, function (req, res) {

    var reqUrl = req.url.slice(5);

    // mongo logic - pass in url, receive response
    mongoFn.mongoNewUrl(reqUrl, function (responseObj) {
        res.send(JSON.stringify(responseObj));
    });    
});

// handle invalid url requests
app.get(/^\/new\/[a-z0-9]+/i, function (req, res) {
    res.send(JSON.stringify({'url':'invalid'}));
});

// handle incoming shortened url
app.get(/^\/s\/[a-z0-9]+/i,function (req, res) {
    var incomingUrl = req.url.slice(3);
    
    // mongo search
    mongoFn.mongoGetUrl(incomingUrl, function (fwdUrl) {
        res.send('Original url is: ' + fwdUrl);
    });
    
    // fwd logic here
    
    // testing here
    //res.send("Incoming shortened url: " + incomingUrl);
});

// handle all 404 errors
app.use(function(req, res){
    res.send(html404);
});
// end routes ===============================================================

// listen
var port = process.env.PORT || 3000;
app.listen(3000, function(){
    // listening...
    console.log("now listening on port 3000");
});







// OLD CODE

// // logic vars
// // var dbTotalRecords = 0; // # of db records

// // var mongo = require('mongodb').MongoClient;
// // var mongoUrl = "mongodb://localhost:27017/urlshortener";
// // MongoDB Functions ========================================================
// // for this project, mongo should => query if original url is already saved, otherwise create shortened
// //                                => query for shortened url, then return and redirect user to original

// // mongoCount - returns the total number of entries in the collection - returns an integer
// function mongoCount(callback) {
//     // connect to mongo database
//     mongo.connect(mongoUrl, function (err, db) {
        
//         // if error, throw
//         if (err) {
//             db.close();
//             throw err;
//         }
        
//         // get count of items in collection
//         var urls = db.collection('urls');
//         urls.find({}).toArray(function (err, docs) {
//             if (err) {
//                 // error - close and throw
//                 db.close();
//                 throw err;
//             } else {
//                 // close and return length of docs array
//                 db.close()
//                 callback(docs.length);
//             }
//         });
//     });
// }

// // mongoNewUrl - when submitting a new url request - accepts a url string, returns an object
// function mongoNewUrl(requestString, callback) {
    
//     // connect to mongo database
//     mongo.connect(mongoUrl, function (err, db) {
        
//         // can't connect? return error object
//         if (err) callback({ 'error':'unable to connect to database'});
        
//         // db vars for initial query
//         var urls = db.collection('urls');
//         var query = {'originalUrl':requestString};
//         var projection = {'_id':0, 'originalUrl':1, 'shortenedUrl':1};
        
//         // db vars for insert
//         var insertObj = {
//             'originalUrl' : requestString,
//             'shortenedUrl': randomUrl()
//         };
        
//         // search to see if url passed already has an entry
//         urls.find(query, projection).toArray(function (err, docs) {
            
//             // already found? return the object
//             if (docs.length > 0) {
//                 db.close();
//                 callback(docs[0]);
//             } else {
//                 // not found - create it
//                 urls.insert(insertObj);
//                 db.close();
                
//                 var formattedReturnObj = {
//                     'originalUrl': insertObj.originalUrl,
//                     'shortenedUrl': insertObj.shortenedUrl
//                 };
                
//                 callback(formattedReturnObj);
//             }
//         });
//     });
// }

// // mongoGetUrl - searches for the shortened url in the database, and if found, returns the original url
// //             - accepts a string and callback function, returns a string
// function mongoGetUrl (searchUrl, callback) {
//     // connect to the database
//     mongo.connect(mongoUrl, function (err, db) {
        
//         // error, return error string
//         if (err) callback('Unable to connect to database');
        
//         // search
//         var urls = db.collection('urls');
//         var query = {'shortenedUrl':searchUrl};
//         var projection = {'_id':0, 'originalUrl':1};
        
//         urls.find(query, projection).toArray(function (err, docs) {
            
//             // error, return error string
//             if (err) callback('Unable to perform search');
            
//             // return found 
//             if (docs.length > 0) {
//                 db.close()
//                 callback(docs[0].originalUrl);
//             } else {
//                 // not found
//                 db.close();
//                 callback('Not Found');
//             }
//         });
//     });
// }

// // Generator functions ==============================
// // random number from interval
// function randomIntFromInterval (min, max) {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }
// // random shortened url creator
// function randomUrl() {
//     var randomUCase = String.fromCharCode(randomIntFromInterval(65, 90));
//     var randomLCase = String.fromCharCode(randomIntFromInterval(97, 122));
    
//     return "http://s/" + randomUCase + dbTotalRecords + randomLCase;
// }

