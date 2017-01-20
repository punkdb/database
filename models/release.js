var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/punkdb');
var Schema = mongoose.Schema;
var releaseSchema = new Schema({
    id: {type: String, required: true, unique: true},
    created: {type: Date, required: true},
    title: String,
    status: String,
    packaging: String,
    'text-representation': {
        language: String,
        script: String
    },
    'artist-credit': {
        artist: {
            id: String,
            name: String,
            'sort-name': String,
            disambiguation: String,
            aliases: [{
                'sort-name': String,
                name: String,
                locale: String,
                type: String,
                primary: String,
                'begin-date': String,
                'end-date': String
            }]
        }
    },
    'release-group': {
        id: String,
        'primary-type': String
    },
    date: String,
    country: String,
    'release-events': [{
        date: String,
        area: {
            id: String,
            name: String,
            'sort-name': String,
            'iso-3166-1-codes': [{
                String
            }]
        }
    }],
    barcode: String,
    asin: String,
    'label-info': [{
        'catalog-number': String,
        label: {
            id: String,
            name: String
        }
    }],
    'track-count': Number,
    media: [{
        format: String,
        'disc-list': Number,
        'track-list': Number
    }]
}, {collection: 'releases'});

var Release = mongoose.model('Release', releaseSchema);

module.exports = Release;