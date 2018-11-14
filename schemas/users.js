//定义数据库表存储结构

//引入mongoose模块操作数据库
const mongoose = require('mongoose')

//定义用户表结构（字段和类型）
const users = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})

module.exports = {
	users
}
