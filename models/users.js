//创建一个user的模型类

//实际是通过操作模型类来对数据库进行操作

const mongoose = require('mongoose')

const userSchema = require('../schemas/users')


//mongoose的模型方法创建User模型,操作usersSchema
const User = mongoose.model('User', userSchema)

module.exports = {
	User
}
