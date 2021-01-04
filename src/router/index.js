import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cates from '../components/goods/cate.vue'
import Params from '../components/goods/params.vue'
import GoodsList from '../components/goods/list.vue'
import AddGoods from '../components/goods/add.vue'
import Order from '../components/order/order.vue'
import Report from '../components/report/report.vue'

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
		},{
			path:'/users',
			component:Users
		},
		{
			path:'/rights',
			component:Rights
		},
		{
			path:'/roles',
			component:Roles
		},
		{
			path:'/categories',
			component:Cates
		},
		{
			path:'/params',
			component:Params
		},
		{
			path:'/goods',
			component:GoodsList
		},
		{
			path:'/goods/add',
			component:AddGoods
		},
		{
			path:'/orders',
			component:Order
		},
		{
			path:'/reports',
			component:Report
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
