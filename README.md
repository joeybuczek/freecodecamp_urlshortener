## URL Shortener Microservice

Free Code Camp Challenge

This app's functionlaity is a basic URL Shortener service. Append the url you wish to shorten to the `/new/` path. 
The response is a JSON object with both the original URL and the shortened version. 
All URL objects are stored in a database.

** Usage Examples **

`http://fcc-urlshortenermicroservice.herokuapp.com/new/http://bteamphoto.com`

`http://fcc-urlshortenermicroservice.herokuapp.com/new/http://www.google.com`

** Response Examples **

`{'originalUrl':'http://bteamphoto.com','shortenedUrl':'http://fcc-urlshortenermicroservice.herokuapp.com/s/I0K'}`

`{'originalUrl':'http://www.google.com','shortenedUrl':'http://fcc-urlshortenermicroservice.herokuapp.com/s/a6m'}`

** Invalid URL Example **

`{'url':'invalid'}`
