var http = require('http');
var Artist = require('./models/artist');

function processArtists(artists) {
    // If webservice return no results, skip this
    if(!artists) {
        return;
    }

    var i = artists.length;
    while(i--) {
        var temp = artists[i];
        var artist = new Artist({
            id: temp.id,
            name: temp.name,
            created: Date()
        });

        // Add these values if they are set for the specific artist
        if(temp.type) {
            artist.type = temp.type;
        }
        if(temp['sort-name']) {
            artist['sort-name'] = temp['sort-name'];
        }
        if(temp.country) {
            artist.country = temp.country;
        }
        if(temp['begin-area']) {
            artist['begin-area'] = temp['begin-area'];
        }
        if(temp.area) {
            artist.area = temp.area;
        }
        if(temp['life-span']) {
            artist['life-span'] = temp['life-span'];
        }

        // Save the artist into the database
        artist.save((err,tmp) => {
            if (err) throw err;
        });
    }
}

function main() {
    var offset = 0;

    var interval = setInterval(() => {
        var options = {
            host: 'musicbrainz.org',
            port: '80',
            path: '/ws/2/artist/?query=tag:punk&limit=100&offset=' + offset + '&fmt=json',
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'User-Agent': 'Database Builder v0.1.0 | PunkDB | www.punkdb.com | thepunkdb@gmail.com'
                }
        };

        var callback = (res) => {
            var msg = '';

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                msg += chunk;
            });
            res.on('end', () => {
                var raw = JSON.parse(msg);

                // Increase Offset for WS Request
                offset += 100;
                
                // Process Result
                processArtists(raw.artists);
                
                // Termination of loop
                if(offset > raw.count) {
                    process.exit();
                }
            });
        };

        http.request(options, callback).end();

    }, 20000); // Using generous timeout to be friendly on musicbrainz webservice
}

main();