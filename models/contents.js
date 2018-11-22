const mongoose = require('mongoose')
const contentSchema = require('../schemas/content')

const contents = mongoose.model('contents', contentSchema)

module.exports = contents
