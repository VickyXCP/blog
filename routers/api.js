const express = require('express')
const router = express.Router()
const users = require('../models/users')

router.get('/user', (req, res, next) => {
	res.send('api')
})

var resData
router.use((req, res, next) => {
	resData = {
		code: 0,
		message: ''
	}
	next()
})

router.post('/user/register', (req, res, next) => {
	let username = req.body.username,
		password = req.body.password,
		repassword = req.body.repassword
	// 后端验证
	if (username == '') {
		resData.code = 1
		resData.message = '用户名不能为空'
		res.json(resData)
		return
	}
	if (password == '') {
		resData.code = 2
		resData.message = '密码不能为空'
		res.json(resData)
		return
	}
	if (password != repassword) {
		resData.code = 3
		resData.message = '两次输入密码不一致'
		res.json(resData)
		return
	}
	users.findOne({username: username}).then((result)=>{
		if (result){
			// console.log(123)
			resData.code = 4
			resData.message = '用户名已被注册'
			res.json(resData)
			return ''
		}
		users.insertMany([{username, password}],(res, err)=>{
			if (err){
				console.log(err)
				return
			}
			// console.log(res)
		})
	}).then((result)=>{
		resData.message = '注册成功'
		res.json(resData)
	})
})

router.post('/user/login', (req, res, next)=>{
	let username = req.body.username, password = req.body.password
	if (username == '' || password == ''){
		resData.code = 1
		resData.message = '用户名或密码不能为空'
		res.json(resData)
		return
	}
	users.find({username, password}).then(result=>{
		if (!result){
			resData.code = 2
			resData.message = '用户名或密码错误'
			res.json(resData)
			return
		}
		// console.log(result)
		resData.message = '登录成功'
		resData.userInfo = {
			_id: result[0]._id,
			username: result[0].username
		}
		req.cookies.set('userInfo', JSON.stringify(resData.userInfo))
		// console.log(req.cookies.get('userInfo'))
		res.json(resData)
		return
	})
})

router.get('/user/logout', (req, res, next)=>{
	req.cookies.set('userInfo', null)
	res.json(resData)
})

module.exports = router

//三种插入数据的方法
//1
/*users.create({username, password}, (res, err)=>{
	if (err){
		console.log(err)
		return
	}
	console.log(res)
})*/
//	2
/*let user = new users({username, password})
user.save((res,err)=>{
	if (err){
		console.log(err)
		return
	}
	console.log(res)
})*/
