const express = require('express')
const router = express.Router()

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
	resData.message = '注册成功'
	res.json(resData)
})

module.exports = router
