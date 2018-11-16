$(function () {
	let reg_username = $('#username'),
		reg_pass = $('#password'),
		reg_con = $('#con-pass'),
		reg_btn = $('#reg-btn'),
		loginname = $('#user-name'),
		login_pass = $('#pass'),
		login_btn = $('#login-btn'),
		name = $('#name'),
		info = $('#info'),
		btn = $('#btn'),
		toLogin = $('#toLogin'),
		toReg = $('#toReg'),
		login = $('.login'),
		register = $('.register'),
		userinfo = $('.userinfo'),
		remind = $('.remind')
	
	toLogin.on('click', () => {
		register.hide()
		// userinfo.hide()
		login.show()
	})
	
	toReg.on('click', () => {
		login.hide()
		// userinfo.hide()
		register.show()
	})
	//注册
	reg_btn.on('click', ()=>{
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data:{
				username: reg_username.val(),
				password: reg_pass.val(),
				repassword: reg_con.val()
			},
			dataType: 'json',
			success: (res)=>{
				console.log(res)
				remind.html(res.message)
				setTimeout(()=>{
					remind.hide()
				}, 1000)
				if (!res.code){
					setTimeout(()=>{
						login.show()
						register.hide()
						// userinfo.hide()
					}, 1000)
				}
			}
		})
	})
	
	// console.log($.cookie())
	
//	登录
	login_btn.on('click', ()=>{
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data:{
				username: loginname.val(),
				password: login_pass.val()
			},
			dataType: 'json',
			success: (res)=>{
				remind.html(res.message)
				setTimeout(()=>{
					remind.hide()
				}, 1000)
				if (!res.code){
					setTimeout(()=>{
						// userinfo.show()
						// userinfo.find('.name').html(res.userInfo.username)
						// userinfo.find('.welcome').html('你好，欢迎光临我的博客')
						// login.hide()
						// register.hide()
						window.location.reload()
					}, 1000)
				}
			}
		})
	})
	
//	登出
	btn.on('click',()=>{
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			success: (res)=>{
				window.location.reload()
				console.log(res)
			}
		})
	})
})
