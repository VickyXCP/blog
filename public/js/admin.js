$(function(){
	const logout = $('#logout')
	
	logout.on('click', ()=>{
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			success: (res)=>{
				window.location.href('../main/index.html')
			}
		})
	})
})
