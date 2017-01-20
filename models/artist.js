var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/punkdb');
var Schema = mongoose.Schema;
var artistSchema = new Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    created: {type: Date, required: true},
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
    disambiguation: String,
    'life-span': {
        begin: String,
        ended: String
    },
    aliases: [{
        'sort-name': String,
        name: String,
        locale: String,
        type: String,
        primary: String,
        'begin-date': String,
        'end-date': String
    }]
}, {collection: 'artists'});

var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;