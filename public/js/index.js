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
		regRemind = $('.regRemind'),
		logRemind = $('.logRemind')
	
	toLogin.on('click', () => {
		register.hide()
		userinfo.hide()
		login.show()
	})
	
	toReg.on('click', () => {
		login.hide()
		userinfo.hide()
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
				regRemind.html(res.message)
				if (!res.code){
					setTimeout(()=>{
						login.show()
						register.hide()
						userinfo.hide()
					}, 1000)
				}
			}
		})
	})
})
