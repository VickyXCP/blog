const express = require('express')
const router = express.Router()
const categories = require('../models/category')

router.get('/', (req, res, next)=>{
	categories.find().then((result)=>{
		res.render('main/index.html', {
			userInfo: req.userInfo,
			categories: result
		})
	})
})


module.exports = router
