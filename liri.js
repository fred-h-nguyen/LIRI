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

//
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: "mapquest",
    apiKey: "VcPyAXvCwBFq4OMnuzJgcZCVdX3GVsGg"
};

var geocoder = NodeGeocoder(options);

// process.argv to get commands
var args = process.argv;

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




