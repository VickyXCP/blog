const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog')
const db = mongoose.connection
module.exports = db
