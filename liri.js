// All REQUIRED PACKAGES
//=====================================================
//axios used for omdb and bands api
var axios = require('axios');

// used to pull spotify keys from keys.js
require('dotenv').config();
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);

//moment used to get time for concerts
var moment = require('moment');

//Geocoder for address
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: "mapquest",
    apiKey: "VcPyAXvCwBFq4OMnuzJgcZCVdX3GVsGg"
};
var geocoder = NodeGeocoder(options);

// process.argv to get commands
var args = process.argv;

//file system node

var fs = require('fs')


//FUNCTIONS
//============================================

//Concert-this
function concert(artist) {

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

            //console.log(response)
            var data = response.data
            //console.log(data)

            if (data == false) {
                console.log('No concert found!')
            } else {

                //for loop

                //for (var i = 0; i < data.length; i++) {

                //Date of the Event(use moment to format this as "MM/DD/YYYY")
                console.log('The concert will play on the date of ' + moment(data[0].datetime).format('MM/DD/YYYY'))


                //Name of the venue
                //console.log(data[0].venue)
                console.log('The concert is playing at ' + data[0].venue.name)

                //Venue location
                var coordinates = { lat: data[0].venue.latitude, lon: data[0].venue.longitude }

                geocoder.reverse(coordinates).then(function (res) {
                    console.log('The address is at ' + res[0].formattedAddress);
                }).catch(function (err) {
                    console.log(err);
                })
                //}
            }

        })


}

//movie-this
function movieInfo(movieTitle) {
    if (!movieTitle) {
        axios.get('http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy')
            .then(function (response) {
                var data = response.data
                console.log('Movie: ' + data.Title);
                console.log('Year: ' + data.Year);
                console.log('IMDB Rating: ' + data.Ratings[0].Value);
                console.log('Rotten Tomatoes Rating: ' + data.Ratings[1].Value);
                console.log('Country: ' + data.Country);
                console.log('Language: ' + data.Language);
                console.log('Plot: ' + data.Plot);
                console.log('Actors: ' + data.Actors)
            })
    } else {

        var newMovieTitle = movieTitle.split(' ').join('+')

        axios.get('http://www.omdbapi.com/?t=' + newMovieTitle + '&y=&plot=short&apikey=trilogy')
            .then(function (response) {
                var data = response.data
                if (data.Response === "True") {
                    console.log('Movie: ' + data.Title);
                    console.log('Year: ' + data.Year);
                    console.log('IMDB Rating: ' + data.Ratings[0].Value);
                    console.log('Rotten Tomatoes Rating: ' + data.Ratings[1].Value);
                    console.log('Country: ' + data.Country);
                    console.log('Language: ' + data.Language);
                    console.log('Plot: ' + data.Plot);
                    console.log('Actors: ' + data.Actors)
                } else {
                    console.log('Movie Not Found')
                }

            })
    }
}


//spotify-this-song
function songInfo(songTitle) {
    spotify.search({
        type: 'track',
        query: songTitle,//use a string
        limit: 1
    }).then(function (response) {
        console.log(JSON.stringify(response, null, 2))
    }).catch(function (err) {
        console.log(err);
    })
}

//do-what-it-says

function doIt() {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        }

        console.log(data)
        var commands = data.split('\r\n')
        console.log(commands)

        commands.forEach(function (command) {

            //var actions = [];
            var keyAction = command.split(',');

            var action = keyAction[1]
            action = action.replace(/"/g, '')
            //console.log(action)

            switch (keyAction[0]) {
                case 'spotify-this-song': songInfo(action)

                    break;

                case 'movie-this': movieInfo(action)

                    break;

                case 'concert-this': concert(action)

                    break;

                default:
                    break;
            }

        })
    })
}

//===========================================
//collect args

var command = args[2]

var query = args.slice(3).join(' ')

//=============================================
//Switch Case

switch (command) {
    case 'spotify-this-song': songInfo(query)

        break;

    case 'movie-this': movieInfo(query)

        break;

    case 'concert-this': concert(query)

        break;

    case 'do-what-it-says': doIt()
        break;

    default:
        break;
}
