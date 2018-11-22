const express = require('express')
const router = express.Router()
const categories = require('../models/category')

//前端分类展示
router.get('/', (req, res, next)=>{
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
	categories.find().sort({_id:1}).then((result)=>{
		res.render('main/index.html', {
			userInfo: req.userInfo,
			categories: result
		})
	})
})


module.exports = router
