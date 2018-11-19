$(function(){
	const logout = $('#logout')
	
	$('.list-show').on('click',()=>{
		$('.user-list').show()
		$('.manage-list').hide()
	})
	
	$('#u-list').on('click', ()=>{
		window.location.href='/admin/user'
		$('.user-list').show()
	})
	
	logout.on('click', ()=>{
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			success: (res)=>{
				window.location.href='/'
			}
		})
	})
})
