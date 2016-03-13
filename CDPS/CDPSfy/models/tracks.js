var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var trackSchema = new Schema({
	id: {type: String},
	name: {type: String},
	url: {type: String},
	urli: {type: String},
	playlist: {type: String}
});

module.exports = mongoose.model('Tracks', trackSchema);