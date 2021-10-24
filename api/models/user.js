const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    sessionId: Number,
    queue: {type: Array, "default": [] }
})

module.exports = mongoose.model('User', userSchema);