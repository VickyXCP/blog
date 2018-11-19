const mongoose = require('mongoose')
const categorySchema = require('../schemas/category')

const categories = mongoose.model('categories', categorySchema)

module.exports = categories
