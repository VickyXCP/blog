const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
	//关联categories表, 分类id
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'categories'
	},
	title: String,
	//关联字段 用户id
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	views: {
		type: Number,
		default: 0
	},
	addTime: {
		type: Date,
		default: new Date()
	},
	description: {
		type: String,
		default: String
	},
	content: {
		type: String,
		default: ''
	},
	comments: {
		type: Array,
		default: []
	}
})
