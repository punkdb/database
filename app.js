var http = require('http');
var data = JSON.stringify({
    'id': '2'
});

var options = {
    host: 'musicbrainz.org',
    port: '80',
    path: '/ws/2/artist/?query=tag:punk&limit=1&fmt=json',
    method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length,
            'User-Agent': 'PunkDB | Database Builder v0.1.0 | www.punkdb.com'
        }
};

var req = http.request(options, function (res) {
    var msg = '';

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        msg += chunk;
    });
    res.on('end', function () {
        console.log(JSON.parse(msg));
        console.log('\n\n\n');
        console.log(JSON.parse(msg).artists[0]);

        process.exit();
    });
});

req.write(data);
req.end();