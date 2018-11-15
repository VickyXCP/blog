const mongoose = require('mongoose')
const userSchema = require('../schemas/user')

const users = mongoose.model('users', userSchema)

module.exports = users
