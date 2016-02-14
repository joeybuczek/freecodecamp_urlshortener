// connectivity vars
var http = require('http');
var mongoFn = require('./mongoFn');
// server vars
var express = require('express');
var app = express();


// routes ===================================================================
// html snippets
var htmlHome = "<h2>URL Shortener Microservice</h2>" + 
               "<p>This app's functionality is a basic URL Shortener service. </br>" + 
               "Append the URL you wish to shorten to the <b>/new/</b> path. </br>" +
               "The response is a JSON object with both the original URL and the shortened version. </br>" +
               "All URL objects are stored in a database." +
               "<h3>Usage examples:</h3>" + 
               "<pre>https://fcc-urlshortenermicroservice.herokuapp.com/new/http://www.google.com</pre>" + 
               "<pre>https://fcc-urlshortenermicroservice.herokuapp.com/new/http://bteamphoto.com</pre>" + 
               "<h3>Response examples:</h3>" + 
               "<pre>{'originalUrl':'http://www.google.com','shortenedUrl':'https://fcc-urlshortenermicroservice.herokuapp.com/s/i3W'}</pre>" + 
               "<pre>{'originalUrl':'http://bteamphoto.com','shortenedUrl':'https://fcc-urlshortenermicroservice.herokuapp.com/s/a6k'}</pre>" +
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
        res.json(responseObj);
        // res.send(JSON.stringify(responseObj));
    });    
});

// handle invalid url requests
app.get(/^\/new\/[a-z0-9]+/i, function (req, res) {
    res.json({'url':'invalid'});
    // res.send(JSON.stringify({'url':'invalid'}));
});

// handle incoming shortened url
app.get(/^\/s\/[a-z0-9]+/i,function (req, res) {
    var incomingUrl = "https://fcc-urlshortenermicroservice.herokuapp.com" + req.url;
    
    // mongo search
    mongoFn.mongoGetUrl(incomingUrl, function (fwdUrl) {
        res.redirect(fwdUrl);
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
var port = process.env.PORT || 8080;
app.listen(3000, function(){
    // listening...
    console.log("now listening on port 3000");
});
