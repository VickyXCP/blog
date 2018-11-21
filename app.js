//应用程序入口
//加载express模块
const express = require('express')
//创建app应用，相当于nodeJs的http.createService
const app = express()
// const mongoose = require('mongoose')
const db = require('./db/db')
const bodyParser = require('body-parser')

const Cookies = require('cookies')

const users = require('./models/users')

//1.加载模板处理模块
// const ejs = require('ejs')
const swig = require('swig')
//2配置模板应用模块
//定义当前应用所使用的模板引擎，第一个参数：模板引擎名称，同时也是模板文件的后缀；第二个参数：解析处理模板内容的方法
// app.engine('html', ejs.renderFile);
app.engine('html', swig.renderFile);
//3设置模板文件存放的目录,第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//4注册模板，第一个参数：必须是view engine,第二个参数与定义模板引擎的第一个参数名称一致
app.set('view engine', 'html')
//补充：第一次读取会把模板缓存到内存当中，下次会直接读取，因此即使改了模板内容刷新也不会有变化，需要在开发过程中需要取消模板缓存
swig.setDefaults({cache:false});

//静态文件托管
/**
 * 托管规则：用户发送http请求到后端，后端解析url，找到匹配规则，执行绑定的函数，返回对应的内容，
 * 静态文件直接读取制定目录下文件返回给用户，动态文件：处理业务逻辑，加载模板，解析模板返回上数据
 */
//当用户请求的路径ulr以/public开头时，以第二个参数的方式进行处理（直接返回__dirname + '/public'目录下文件）
app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))

/**
 * [description] 给app绑定首页路由，把一个url路径通过一个或多个方法绑定
 * @param  {[type]} req       request对象，保存客户端请求相关的一些数据
 * @param  {[type]} res       response对象
 * @param  {[type]} next){} 函数,用于执行下一个和当前路径匹配的函数
 * @return {[type]}           [description]
 */
/*app.get('/', (req,res, next)=>{
	//res.send(string)发送内容直客户端
	// res.send('<h1>欢迎来到我的博客！</h1>')
	
	//5读取views目录下的指定文件，解析并返回给客户端
	//第一个参数：模板的文件相对于views/index1.html
	//第二个参数：传递给模板使用的数据
	res.render('index');
})*/

//设置cookie(cookie在浏览器中保存为字符串格式, 所以要用JSON.parse解析为json对象)
app.use((req, res, next) => {
	//调用req的cookies方法把Cookies加载到req对象里面
	req.cookies = new Cookies(req, res)
	req.userInfo = {}; //定义一个全局访问对象
	//如果浏览器请求有cookie信息,尝试解析cookie
	if (req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'))
			users.findById(req.userInfo._id).then((result)=>{
				req.userInfo.isAdmin = Boolean(result.isAdmin)
				next()
			})
		}catch (e) {
			console.log(e)
			next()
		}
	}else {
		next()
	}
})

//分模块开发
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//连接数据库
/*mongoose.connect('mongodb://localhost:27017/blog', (err)=>{
	if (err){
		console.log(err)
	} else {
		console.log('数据库连接成功')
		app.listen(8081, ()=>{
			console.log('Server is running on http://localhost:8081')
		})
	}
})*/
// console.log(db)
db.on('error', (error) => {
	console.log('数据库连接失败：' + error)
})
db.on('open', () => {
	console.log('数据库连接成功')
	app.listen(8088, () => {
		console.log('Server is running on http://localhost:8088')
	})
})


