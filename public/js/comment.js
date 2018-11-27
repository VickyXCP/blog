$(function () {
	
	let limit = 2, page = 1, pages = 0, comments = []
	
	$('.commentBtn').on('click', () => {
		$.ajax({
			type: 'POST',
			url: '/api/comment/post',
			data: {
				contentid: $('#contentid').val(),
				content: $('#cont').val()
			},
			success: (res) => {
				$('#cont').val('')
				comments = res.data.comments.reverse()
				renderComment()
			}
		})
	})
	
	$.ajax({
		type: 'GET',
		url: '/api/comment',
		data: {
			contentid: $('#contentid').val()
		},
		success: function (res) {
			comments = res.data.comments.reverse()
			console.log(res)
			renderComment()
		}
	})
	
	/**
	 * delegate() 方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件
	 * 发生时运行的函数。
	 *使用 delegate() 方法的事件处理程序适用于当前或未来的元素（比如由脚本创建的新元素）
	 */
	$('.pagination').delegate('a', 'click', function(){
		if ($(this).parent().hasClass('pre')){
			page--
		} else {
			page++
		}
		renderComment()
	})
	
	
	function renderComment () {
		pages = Math.ceil(comments.length / limit) //分页总数
		let start = Math.max(0, (page - 1) * limit)//当前分页的开始条数
		let end = Math.min(start + limit, comments.length)//当前分页的结束条数
		let spans = $('.pagination>span')
		spans.eq(1).html(page + '/' + pages)
		if (page <= 1) {
			page = 1
			spans.eq(0).html(`<span>没有上一页了</span>`)
		} else {
			spans.eq(0).html(`<a href='javascript: void(0)'>上一页</a>`)
		}
		if (page >= pages) {
			page = pages
			spans.eq(2).html(`<span>没有下一页了</span>`)
		} else {
			spans.eq(2).html(`<a href='javascript: void(0)'>下一页</a>`)
		}
		if (comments.length == 0) {
			$('.comment-list').html(`<li>还没有评论</li>`)
		} else {
			let html = ''
			for (let i = start; i < end; i++) {
				html += `<li>
									<p>${comments[i].username}</p>
									<p>${formatDate(comments[i].postTime)}</p>
									<div>${comments[i].content}</div>
								</li>`
			}
			$('.comment-list').html(html)
		}
	}
	
	function formatDate(date){
		let date1 = new Date(date)
		return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + '  ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
	}
})
