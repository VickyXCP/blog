const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true})
const db = mongoose.connection
module.exports = db
