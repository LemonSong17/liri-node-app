require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var moment = require('moment');
moment().format();


//axios
var axios = require("axios");
// Store all of the arguments in an array
var nodeArgs = process.argv;
// Create an empty variable for holding the movie name
var movieName = "";
// Grab the movieName which will always be the third node argument.
var command = process.argv[2];
let response = process.argv[3];

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 2; i < nodeArgs.length; i++) {

    if (i > 2 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
  
    }
  }

// Then run a request with axios to the OMDB API with the movie specified
function movieThis(response) {

    if ( response === undefined ) {
        response = "Mr. Nobody"
    }

let queryUrl = "http://www.omdbapi.com/?t=" + response + "&y=&plot=short&apikey=trilogy";

axios.get(queryUrl).then(
    function(response) {
        var movieInfo=
        "-----------------------" +
    //parsing for the title 
    "\nMovie Title: " + response.data.Title +
    //parsing for the release year 
    "\nRelease Year: " + response.data.Year +
    //parsing for the imdb rating 
    "\nIMDB Rating: " + response.data.imdbRating +
    //parsing for rotten tomatoes
    "\nRotton Tomatoes Rating: " + response.data.Ratings[1].Value +
    //parsing for country produced 
    "\nCountry Produced: " + response.data.Country +
    //parsing for language 
    "\nMovie Language: " + response.data.Language +
    //parsing for plot
    "\nPlot: " + response.data.Plot +
    //parsing for actors
    "\nActors: " + response.data.Actors;
    console.log(movieInfo)
  })

      .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        // console.log("---------------Status---------------");
        // console.log(error.response.status);
        // console.log("---------------Status---------------");
        // console.log(error.response.);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//Bands in Town
function showConcertInfo (response) {
    axios.get("https://rest.bandsintown.com/artists/" + response + "/events?app_id=codingbootcamp")
    .then(function(response) {
        if ( response.data.length === 0 ) {
            console.log("I was unable to find an upcoming show for " + response + ".")
        }
        else {          
                for (var i = 0; i < response.data.length; i++) {
            //Saves datetime response into a variable
            var datetime = response.data[i].datetime; 
            //Spliting the date from the time in the response
            var justDate = datetime.split('T'); 
            var displayConcerts =           
                "--------------------------------" +
                    "\nVenue Name: " + response.data[i].venue.name + 
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(justDate[0]).format("MM-DD-YYYY"); //justDate[0] is now the date separated from time
                    console.log(displayConcerts);
        }
        } 
    })
    .catch(function (error) {
        console.log(error);
    });
}

//Spotify
function songThis (song) {
    if ( song === undefined ) {
        song = "The Sign"
    }
    spotify.search({ type: 'track', query: song}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } 
        var songData = data.tracks.items[0];
                //artist
                console.log("Artist: " + songData.artists[0].name);
                //song name
                console.log("Song: " + songData.name);
                //spotify preview link
                console.log("Preview URL: " + songData.preview_url);
                //album name
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");
        // data.tracks.items[0] <- the first item in list of search results
      // Artist data.tracks.items[0].artists[0].name
      // Song Name
      // Preview Link data.tracks.items[0].externalurls.spotify
      // Album data.tracks.items[0].album.name
      
     // console.log(data.tracks.items[0])
      });
    }

    function doWhatItSays(tool) {
        fs.readFile('random.txt', "utf8", function (error, data) {
            console.log("Got this from file: " + data)
            var rndm = data.split(',');
            switch (rndm[0]) {
                case "spotify-this-song":
                    songThis(rndm[1]);
                    break;
                case "concert-this":
                    showConcertInfo(rndm[1]);
                    break;
                }
        });
    }

    
switch (command) {
    case "movie-this":
        movieThis(response);
        break;
    case "concert-this":
        showConcertInfo(response);
        break;
    case "spotify-this-song":
        songThis(response);
        break;
    case "do-what-it-says":
        doWhatItSays(response);
        break;

};

//VARIABLES
//FUNCTIONS
//CALL FUNCTIONS
