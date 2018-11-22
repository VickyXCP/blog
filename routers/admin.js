const express = require('express')
const router = express.Router()
const users = require('../models/users')
const categories = require('../models/category')
const contents = require('../models/contents')
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
		return Promise.reject()
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

//内容展示
router.get('/content', (req, res)=>{
	let page = req.query.page || 1, limit = 2, pages = 0
	contents.countDocuments().then(count=>{
		pages = Math.ceil(count/limit)
		page = Math.max(page, 1)
		page = Math.min(pages, page)
		let skip = (Math.max(page, 1) - 1)*limit
		//populate进行关联category表单
		contents.find().limit(limit).skip(skip).populate('user').then(result=>{
			console.log(result)
			res.render('admin/content_index', {
				userInfo: req.userInfo,
				contents: result,
				page,
				limit,
				pages,
				count
			})
		})
	})
})

//内容添加
router.get('/content/add', (req, res)=>{
	categories.find().sort({_id: -1}).then((result)=>{
		res.render('admin/content_add', {
			userInfo: req.userInfo,
			categories: result
		})
	})
})

// 内容保存
router.post('/content/add', (req, res)=>{
	let title = req.body.title, content = req.body.content, desc = req.body.desc, category = req.body.category
	if (title === '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return Promise.reject()
	}
	if (content === '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容不能为空'
		})
		return Promise.reject()
	}
	new contents({title, content, desc, category}).save().then(()=>{
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content'
		})
	})
})

//内容编辑
router.get('/content/edit', (req, res)=>{
	const id = mongoose.Types.ObjectId(req.query.id)
	let selections = null
	categories.find().sort({_id: -1}).then((result)=>{
		selections = result
		return contents.findOne({_id: id}).populate('category')
	}).then((content)=>{
		if (!content){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '指定内容不存在'
			})
			return Promise.reject()
		} else {
			res.render('admin/content_edit', {
				userInfo: req.userInfo,
				categories: selections,
				content
			})
		}
	})
})

//内容编辑保存
router.post('/content/edit', (req,res)=>{
	let category = req.body.category, title = req.body.title, desc = req.body.desc, content = req.body.content, id = req.body.id || ''
	if (title===''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return Promise.reject()
	}
	if (content===''){
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容不能为空'
		})
		return Promise.reject()
	}
	contents.updateOne({_id: id}, {category, title, desc, content}).then(result=>{
		res.render('admin/success',{
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content'
		})
	})
})

//内容删除
router.get('/content/delete', (req, res)=>{
	const id = req.query.id || ''
	contents.remove({_id: id}).then(result=>{
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功',
			url: '/admin/content'
		})
	})
})

module.exports = router
