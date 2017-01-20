var http = require('http');
var Artist = require('./models/artist');

function processArtists(artists) {
    var artist = new Artist();
    var temp = null;
    
    // If webservice return no results, skip this
    if(!artists) {
        return;
    }

    var i = artists.length;
    while(i--) {
        temp = artists[i];
        artist = new Artist({
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
        if(temp.disambiguation) {
            artist.disambiguation = temp.disambiguation;
        }
        if(temp.aliases) {
            artist.disambiguation = temp.aliases;
        }

        // Save the artist into the database
        artist.save((err,tmp) => {
            if (err) {
                if(err.code == 11000) {
                    console.log('[ERROR][DUP ARTIST]', tmp.name);
                    return;
                }
                throw err;
            }
            console.log('[ INFO][SAVED]', tmp.name);
        });
    }
}

function processReleases() {

}

function scrapeArtists() {
    var offset = 0;
    
    var interval = setInterval(() => {
        var options = {
            host: 'musicbrainz.org',
            port: '80',
            // Webservice limit of 100 results per query (default of 25)
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
                    clearInterval(interval);
                }
            });
        };

        http.request(options, callback).end();

    }, 5000); // Using generous timeout to be friendly on musicbrainz webservice
}

function scrapeReleases() {
    
    Artist.find({}).select({id: 1, name: 1}).exec((err, result) => {
        var offset = 0;
        var i = 0;
        var interval = setInterval(() => {
            var options = {
                host: 'musicbrainz.org',
                port: '80',
                // TODO: Need to correct the request URL to have dynamic artist name based off
                // database query
                path: '/ws/2/release/?query=artist:' + result[i++].name + '&limit=100&offset=' + offset + '&fmt=json',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'User-Agent': 'Database Builder v0.1.0 | PunkDB | www.punkdb.com | thepunkdb@gmail.com'
                }
            }

            var callback = (res) => {
                var msg = '';

                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    msg += chunk;
                });
                res.on('end', () => {
                    var raw = JSON.parse(msg);

                    offset += 100;

                    processReleases(raw['releases']);

                    if(offset > raw.count) {
                        clearInterval(interval);
                    }
                });
            };

            http.request(options, callback).end();

        }, 5000); // Using generous timeout to be friendly on musicbrainz webservice
    });
}

function main() {
    //scrapeArtists();
    scrapeReleases();
    // TODO:
    // scrapeLabel();
    // scrapeReleaseGroup(); --Maybe
}

main();