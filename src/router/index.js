import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Category from '@/components/goods/Category'
import Goods from '@/components/goods/Goods'
import Add from '@/components/goods/Add'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 用于配置home路由的子路由
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Category
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: Add
        }
      ]
    }
  ]
})

// 给router对象注册导航守卫
router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  // 如果是去登入界面得，直接放行即可
  if (to.path === '/login') {
    next()
    return
  }
  // 剩下的就需要检查是否有合法的token,没有就去登入
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    console.log('导航守卫拦截成功，请先登入验证')
    next('/login')
  }
})

export default router
