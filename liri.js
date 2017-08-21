// keys.js file for Twitter keys and secret
var keys = require('./keys.js');
//NPM packages
var request = require('request');
var twitter = require('twitter');
// Defines Twitter keys for user 
var user = new twitter(keys.twitterKeys);
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: 'b20d7a42e711480091833d2a2007728e',
  secret: 'f824f0b707274c83b0d81b444dcd942a',
  });

var fs = require('fs');

// Store node arguments in an array
var nodeArgv = process.argv;
var command = process.argv[2];

// Create an empty variable for holding the movie or song name
var mediaName = "";

//Loop through all words in node argument
for (var i=3; i<nodeArgv.length; i++) {
  if(i>3 && i<nodeArgv.length){
    mediaName = mediaName + "+" + nodeArgv[i];
  } 
  else {
    mediaName = mediaName + nodeArgv[i];
  }
}

//switch case for Twitter. Spotify, or OMBD movies
switch(command) {
  //When user types "my-tweets" command...
  case "my-tweets":
    showTweets();
  break;

 //When user types "spotify-this=song" command...
  case "spotify-this-song":
    if(mediaName){
      spotifySong(mediaName);
    } 
    else {
      //Display if no song selected
      spotifySong("The Sign");
    }
  break;


  case "movie-this":
  //When user types "movie-this" command...
    if(mediaName) {
      omdbData(mediaName)
    } 
    else {
      omdbData("Mr. Nobody")
    }
  break;
  
  //When user types do-what-it-says command...
  case "do-what-it-says": 
    doWhatItSays();
  break;

  default:
    console.log("{Please enter a command: my-tweets or movie-this}");
  break;
}

// Function to display last 20 tweets 
function showTweets() {

  var screenName = {screen_name: 'Donny Trumpet'};
  // get method to return twitter key data for user
  user.get('statuses/user_timeline', screenName, function(error, tweets, response) {

    if(!error && response.statusCode == 200) {
      //Array to display up to 20 tweets and date created
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("Donny Trumpet@Slovenkai1: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("------------------------------");
      }
    }
    else {
      console.log('Error occurred.  Try again.');
    }
  });
}

//Function to get music info from Spotify.
function spotifySong(song) {
  spotify.search({type: 'track', query: song}, function(error, data) {

    if(!error) {
      //Array to display song info
      for(var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        //Output song data to terminal after parsing object
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        console.log("------------------------------");
      }
    } 
    else {
      console.log('Error occurred. Tough luck.');
    }
  });
}

//Function to display movie data
function omdbData(movie){

// Runs a request to the OMDB API with the movie specified
var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true'+'&apikey=40e9cece';
  request(omdbURL, function (error, response, body){

    if(!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      //Output movie data to terminal after parsing object
      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);     
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
    } 

  //if error finding movie
    else {
       console.log('Error occurred. Try entering name again')
    }
  // Condition for alternate text for Mr. Nobody.
    if (movie === "Mr. Nobody") {
      console.log("------------------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
     }
  });
}

// Try to read random.txt file.
function doWhatItSays() {
  fs.readFile('random.txt', "utf8", function(error, data) {
    var txt = data.split(',');
       spotifySong(txt[1]);
  });
}