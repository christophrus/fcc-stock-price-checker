var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var stockSchema = new Schema({
    name: { type: String, required: true, index: true },
    likes: {type: [String], default: []}
});

module.exports = mongoose.model('Stock', stockSchema);