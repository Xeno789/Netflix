const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: {type: String, unique: true},
    category: String,
    type: String
})

module.exports = mongoose.model('Video', videoSchema);