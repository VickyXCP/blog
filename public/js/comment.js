$(function(){
	
	let limit = 2, page = 1, pages = 0, comments = []
	
	$('.commentBtn').on('click', ()=>{
		$.ajax({
			type: 'POST',
			url: '/api/comment/post',
			data: {
				contentid: $('#contentid').val(),
				content: $('#cont').val()
			},
			success: (res)=>{
				$('#cont').val('')
				comments = res.data.comments.reverse()
				renderComment()
			}
		})
	})
	
	$.ajax({
		type:'GET',
		url: '/api/comment',
		data: {
			contentid: $('#contentid').val()
		},
		success: function (res) {
			comments = res.data.reverse()
			renderComment()
		}
	})
	
	function renderComment(comments){
		var html = ''
		for (let i=0;i<comments.length;i++){
			html += `<li><div><p>${comments[i].username}</p><p>${comments[i].postTime}</p></div><div>${comments[i].content}</div></li>`
		}
		$('.comment-list').html(html)
	}
})
