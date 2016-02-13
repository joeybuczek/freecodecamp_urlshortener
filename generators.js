// Generator functions ==============================
var generators = {};

// random number from interval - returns an integer
generators.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};
    
// random shortened url creator - returns a string
generators.randomUrl = function (dbTotalRecords) {
    var randomUCase = String.fromCharCode(this.randomIntFromInterval(65, 90));
    var randomLCase = String.fromCharCode(this.randomIntFromInterval(97, 122));
    return "https://fcc-urlshortenermicroservice.herokuapp.com/s/" + randomUCase + dbTotalRecords + randomLCase;
};

module.exports = generators;