// all required packages
//axios used for omdb and bands api
var axios = require('axios');

// used to pull spotify keys from keys.js
require('dotenv').config();
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);

//moment used to get time for concerts
var moment = require('moment');

// process.argv to get commands
var args = process.argv;

function concert(artist) {

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

            //console.log(response)
            var data = response.data

            //console.log(data)

            //Name of the venue

            console.log(data[0].venue.name)

            //Venue location

            //Date of the Event (use moment to format this as "MM/DD/YYYY")
            console.log(moment(data[0].datetime).format('MM/DD/YYYY'))


        })


}

concert('U2')

