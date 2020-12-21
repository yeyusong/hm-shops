import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'

Vue.use(VueRouter)

const routes = [
	{
		path:'/',
		redirect:'/login'
	},
    {
		path:'/login',
		component:Login
	},
	{
		path:'/home',
		component:Home,
		redirect:'/welcome',
		children:[{
			path:'/welcome',
			component:Welcome
		}]
	}
]

const router = new VueRouter({
  routes,
  mode:"history"
})

// 挂载路由导航守卫，当用户没有token访问其他页面时，自动跳回login页面
router.beforeEach((to,form,next)=>{
	if(to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router
