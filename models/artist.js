var mongoose = require('mongoose');
// Local DB for development/testing
mongoose.connect('mongodb://localhost/punkdb');
var Schema = mongoose.Schema;
var artistSchema = new Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    type: String,
    'sort-name': String,
    country: String,
    area: {
        id: String,
        name: String,
        'sort-name': String
    },
    'begin-area': {
        id: String,
        name: String,
        'sort-name': String
    },
    'life-span': {
        begin: String,
        ended: String
    },
    created: Date
}, {collection: 'artists'});

var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;