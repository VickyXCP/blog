const express = require('express')
const router = express.Router()

router.use((req,res,next)=>{
	if (!req.userInfo.isAdmin){
		res.send('对不起，只要管理员才可以进去管理页面')
	}
	next()
})

router.get('/', (req, res, next)=>{
	res.render('admin/index', {
		userInfo: req.userInfo
	})
})

module.exports = router
