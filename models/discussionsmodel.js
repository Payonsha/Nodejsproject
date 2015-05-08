var mongoose = require('mongoose');
// Discussion Schema
var DscSchema = mongoose.Schema({
 dsc: String,
 discussionID: String
});

// Discussion model
Dsc = mongoose.model('Discussion', DscSchema);
module.exports = Dsc;