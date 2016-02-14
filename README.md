## URL Shortener Microservice

Free Code Camp Challenge

This app's functionality is a basic URL Shortener service. Append the URL you wish to shorten to the `/new/` path. 
The response is a JSON object with both the original URL and the shortened version. 
All URL objects are stored in a database.

** Usage Examples **

`https://fcc-urlshortenermicroservice.herokuapp.com/new/http://bteamphoto.com`

`https://fcc-urlshortenermicroservice.herokuapp.com/new/http://www.google.com`

** Response Examples **

`{'originalUrl':'http://bteamphoto.com','shortenedUrl':'https://fcc-urlshortenermicroservice.herokuapp.com/s/L0s'}`

`{'originalUrl':'http://www.google.com','shortenedUrl':'https://fcc-urlshortenermicroservice.herokuapp.com/s/G1i'}`

** Invalid URL Example **

`{'url':'invalid'}`
