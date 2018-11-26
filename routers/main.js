const express = require('express')
const router = express.Router()
const categories = require('../models/category')
const contents = require('../models/contents')
const moment = require('moment')
const mongoose = require('mongoose')

router.use((req, res, next) => {
	data = {
		userInfo: req.userInfo,
		categoryList: []
	}
	categories.find().sort({_id: -1}).then(categoryList => {
		data.categoryList = categoryList
		next()
	})
})

//前端分类展示
router.get('/', (req, res, next) => {
	//默认排序
	/*	categories.find().then((result)=>{
			res.render('main/index.html', {
				userInfo: req.userInfo,
				categories: result
			})
		})*/
//	升序
	/*categories.find().sort({_id:-1}).then((result)=>{
		res.render('main/index.html', {
			userInfo: req.userInfo,
			categories: result
		})
	})*/
//	降序
	/*categories.find().sort({_id:1}).then((result)=>{
		res.render('main/index.html', {
			userInfo: req.userInfo,
			categories: result
		})
	})*/
	/*let data = {
		userInfo: req.userInfo,
		categoryList: [],
		page: Number(req.query.page) || 1,
		limit: 3,
		pages: 0,
		count: 0,
		url: '/'
	}*/
	data.category = req.query.category
	data.page = Number(req.query.page) || ''
	data.limit = 2
	data.pages = 0
	data.count = 0
	let where = {}
	if (data.category) {
		where.category = data.category
	}
	contents.where(where).countDocuments().then(count => {
		data.count = count
		data.pages = Math.ceil(count / data.limit)
		data.page = Math.max(data.page, 1)
		data.page = Math.min(data.pages, data.page)
		let skip = Math.max((data.page - 1) * data.limit, 0)
		return contents.where(where).find().sort({_id: -1}).limit(data.limit).skip(skip).sort({addTime: -1})
	}).then(contentList => {
		data.contentList = contentList
		res.render('main/index', data)
	})
})

router.get('/view', (req, res, next) => {
	const contentid = req.query.contentid || ''
	contents.findOne({_id: contentid}).then(content=>{
		content.views++
		content.save()
		data.content = content
		res.render('main/view', data)
	})
})

module.exports = router
