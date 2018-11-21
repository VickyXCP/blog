const express = require('express')
const router = express.Router()
const users = require('../models/users')
const categories = require('../models/category')
const mongoose = require('mongoose')

router.use((req, res, next) => {
	if (!req.userInfo.isAdmin) {
		res.send('对不起，只要管理员才可以进去管理页面')
	}
	next()
})

//管理首页
router.get('/', (req, res, next) => {
	res.render('admin/index', {
		userInfo: req.userInfo
	})
})

//用户管理与分页
router.get('/user', (req, res, next) => {
	//limit()限制获取的用户条数
	//skip()忽略数据的查询
	
	let page = Number(req.query.page) || 1, limit = 2, pages = 0
	
	users.countDocuments().then(count => {
		pages = Math.ceil(count / limit)//计算总页数
		page = Math.min(page, pages)//page值不能小于pages
		page = Math.max(page, 1)//page值不能小于1
		let skip = (page - 1) * limit
		users.find().limit(limit).skip(skip).then((result) => {
			res.render('admin/user_index', {
				userInfo: req.userInfo,
				users: result,
				page: page,
				count: count,
				pages: pages,
				limit: limit,
				url: '/admin/user'
			})
		})
	})
	
	
})

//分类管理
router.get('/category', (req, res, next) => {
	let page = req.query.page || 1, pages = 0, limit = 2
	
	categories.countDocuments().then(count=>{
		pages = Math.ceil(count/limit)
		page = Math.max(1, page)
		page = Math.min(pages,page)
		let skip = (page - 1)*limit
		categories.find().limit(limit).skip(skip).then((result)=>{
			res.render('admin/category_index.html', {
				userInfo: req.userInfo,
				categories: result,
				page,
				pages,
				limit,
				count,
				url: '/admin/category'
			})
		})
	})
	
	
})

//分类添加
router.get('/category/add', (req, res, next) => {
	res.render('admin/category_add.html', {
		userInfo: req.userInfo,
	})
})

//分类保存
router.post('/category/add', (req, res) => {
	const name = req.body.name || ''
	if (name == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '名称不能为空',
			url: '/admin/category'
		})
	}
//	查看数据库中是否已存在相同名称
	categories.findOne({name}).then(result => {
		if (result) {
			res.render('/admin/error', {
				userInfo: req.userInfo,
				message: '分类已经存在'
			})
			return Promise.reject()
		} else {
			return new categories({name: name}).save()
		}
	}).then(result => {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '分类保存成功',
			url: '/admin/category'
		})
	})
})

//分类编辑
router.get('/category/edit', (req, res)=>{
	const id = mongoose.Types.ObjectId(req.query.id) || ''
	categories.find({_id:id}).then(result=>{
		if (!result) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			})
			return
		}
		// console.log(result)
		res.render('admin/category_edit', {
			userInfo: req.userInfo,
			category: result,
			url: '/admin/category'
		})
	})
})

//分类编辑保存
router.post('/category/edit', (req, res)=>{
	const name = req.body.name || '',id = req.query.id || ''
	categories.findOne({_id: id}).then(result=>{
		if (!result){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '分类信息不存在'
			})
			return Promise.reject()
		} else {
			if (name == result.name){
				res.render('admin/success', {
					userInfo: req.userInfo,
					message: '修改成功',
					url: '/admin/category'
				})
				return Promise.reject()
			} else {
			//	查看修改名称是否已存在
				return categories.findOne({name: name})
			}
		}
	}).then(result=>{
		if (result){
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类名称已存在'
			})
			return Promise.reject()
		} else {
			return categories.updateOne({_id: id}, {name: name})
		}
	}).then(()=>{
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '修改成功',
			url: '/admin/category'
		})
	})
})

//分类删除
router.get('/category/delete', (req, res)=>{
	const id = req.query.id || ''
	categories.deleteOne({_id: id}).then((result)=>{
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功！',
			url: '/admin/category'
		})
	})
})

module.exports = router
